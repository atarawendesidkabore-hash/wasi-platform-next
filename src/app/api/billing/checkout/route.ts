import { NextResponse } from "next/server";
import { z } from "zod";
import { BILLING_PLANS, getBillingPlan } from "@/lib/billing";
import { createPaydunyaCheckout } from "@/lib/paydunya";
import { createStripeServerClient } from "@/lib/stripe";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { ensureUserWorkspace, getCurrentUser, loadOrganizationRecord } from "@/lib/platform-data";
import { hasEnv } from "@/lib/env";

const bodySchema = z.object({
  plan: z.enum(BILLING_PLANS.map((plan) => plan.id) as [string, ...string[]]),
  provider: z.enum(["stripe", "paydunya"])
});

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Payload invalide" }, { status: 400 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Authentification requise" }, { status: 401 });
  }

  const workspace = await ensureUserWorkspace(user);
  if (!workspace.organizationId) {
    return NextResponse.json({ error: "Organisation introuvable" }, { status: 400 });
  }

  const organization = await loadOrganizationRecord(user.id);
  const plan = getBillingPlan(parsed.data.plan);
  const origin = new URL(request.url).origin;

  if (plan.id === "enterprise") {
    return NextResponse.json({
      message: "Le plan enterprise se traite sur devis. Un workflow commercial doit etre declenche."
    });
  }

  if (plan.id === "free") {
    if (!hasEnv("SUPABASE_SERVICE_ROLE_KEY")) {
      return NextResponse.json({ error: "Supabase service role manquant" }, { status: 503 });
    }

    const supabase = createSupabaseAdminClient();
    await supabase.from("organizations").update({ plan: "free", quota_monthly: 3 }).eq("id", workspace.organizationId);
    await supabase.from("subscriptions").insert({
      org_id: workspace.organizationId,
      plan: "free",
      status: "active",
      amount: 0,
      currency: "XOF",
      period_start: new Date().toISOString().slice(0, 10)
    });

    return NextResponse.json({
      message: "Plan Free active."
    });
  }

  if (parsed.data.provider === "stripe") {
    if (!hasEnv("STRIPE_SECRET_KEY")) {
      return NextResponse.json({ error: "Stripe n'est pas configure" }, { status: 503 });
    }

    const stripe = createStripeServerClient();
    let customerId = organization?.stripe_customer_id ?? null;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        name: workspace.organizationName ?? undefined,
        metadata: {
          orgId: workspace.organizationId
        }
      });
      customerId = customer.id;

      if (hasEnv("SUPABASE_SERVICE_ROLE_KEY")) {
        const supabase = createSupabaseAdminClient();
        await supabase.from("organizations").update({ stripe_customer_id: customerId }).eq("id", workspace.organizationId);
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId ?? undefined,
      customer_email: customerId ? undefined : user.email ?? undefined,
      success_url: `${origin}/billing?success=true&provider=stripe`,
      cancel_url: `${origin}/billing?cancelled=true&provider=stripe`,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: Math.round((plan.priceEuro ?? 0) * 100),
            recurring: {
              interval: "month"
            },
            product_data: {
              name: `WASI ${plan.label}`,
              description: plan.description
            }
          }
        }
      ],
      metadata: {
        orgId: workspace.organizationId,
        plan: plan.id
      }
    });

    return NextResponse.json({
      checkoutUrl: session.url
    });
  }

  if (!hasEnv("PAYDUNYA_MASTER_KEY") || !hasEnv("PAYDUNYA_PRIVATE_KEY") || !hasEnv("PAYDUNYA_TOKEN")) {
    return NextResponse.json({ error: "PayDunya n'est pas configure" }, { status: 503 });
  }

  const checkout = await createPaydunyaCheckout({
    amount: plan.priceXof ?? 0,
    description: `WASI ${plan.label} - abonnement mensuel`,
    orgId: workspace.organizationId,
    plan: plan.id,
    callbackUrl: `${origin}/api/webhook/paydunya`,
    returnUrl: `${origin}/billing?success=true&provider=paydunya`,
    cancelUrl: `${origin}/billing?cancelled=true&provider=paydunya`
  });

  return NextResponse.json({
    checkoutUrl: checkout.invoiceUrl
  });
}
