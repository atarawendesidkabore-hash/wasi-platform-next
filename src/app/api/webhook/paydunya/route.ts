import { NextResponse } from "next/server";
import { hasEnv } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  if (!hasEnv("SUPABASE_SERVICE_ROLE_KEY")) {
    return NextResponse.json({ error: "Supabase service role manquant" }, { status: 503 });
  }

  const payload = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!payload) {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const customData = (payload.custom_data ?? {}) as Record<string, unknown>;
  const orgId = typeof customData.org_id === "string" ? customData.org_id : null;
  const plan = typeof customData.plan === "string" ? customData.plan : "pro";
  const reference = typeof payload.token === "string" ? payload.token : null;
  const status = typeof payload.status === "string" ? payload.status : "pending";
  const amount = typeof payload.total_amount === "number" ? payload.total_amount : null;

  if (!orgId || !reference) {
    return NextResponse.json({ received: true });
  }

  const supabase = createSupabaseAdminClient();
  await supabase.from("subscriptions").insert({
    org_id: orgId,
    plan,
    status,
    paydunya_ref: reference,
    amount,
    currency: "XOF",
    period_start: new Date().toISOString().slice(0, 10)
  });
  await supabase.from("organizations").update({ plan }).eq("id", orgId);

  return NextResponse.json({ received: true });
}
