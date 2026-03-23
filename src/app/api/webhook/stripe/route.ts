import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { hasEnv, requireEnv } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createStripeServerClient } from "@/lib/stripe";

export async function POST(request: Request) {
  if (!hasEnv("STRIPE_SECRET_KEY") || !hasEnv("STRIPE_WEBHOOK_SECRET") || !hasEnv("SUPABASE_SERVICE_ROLE_KEY")) {
    return NextResponse.json({ error: "Stripe webhook non configure" }, { status: 503 });
  }

  const signature = headers().get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  const body = await request.text();
  const stripe = createStripeServerClient();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, requireEnv("STRIPE_WEBHOOK_SECRET"));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid signature" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const orgId = session.metadata?.orgId ?? null;
      const plan = session.metadata?.plan ?? "pro";
      if (orgId) {
        await supabase.from("subscriptions").insert({
          org_id: orgId,
          plan,
          status: "active",
          stripe_sub_id: typeof session.subscription === "string" ? session.subscription : null,
          amount: session.amount_total ? session.amount_total / 100 : null,
          currency: session.currency?.toUpperCase() ?? "EUR",
          period_start: new Date().toISOString().slice(0, 10)
        });
        await supabase
          .from("organizations")
          .update({
            plan,
            stripe_customer_id: typeof session.customer === "string" ? session.customer : null
          })
          .eq("id", orgId);
      }
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await supabase
        .from("subscriptions")
        .update({
          status: subscription.status
        })
        .eq("stripe_sub_id", subscription.id);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
