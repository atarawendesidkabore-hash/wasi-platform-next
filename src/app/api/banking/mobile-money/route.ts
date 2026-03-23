import { NextResponse } from "next/server";
import { z } from "zod";
import { hasEnv } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  accountId: z.string().uuid(),
  direction: z.enum(["deposit", "withdraw"]),
  operator: z.enum(["orange", "wave", "mtn", "moov", "coris"]),
  phoneNumber: z.string().min(8),
  amount: z.number().positive()
});

const operatorFees = {
  orange: { deposit: 0.01, withdraw: 0.015 },
  wave: { deposit: 0.005, withdraw: 0.01 },
  mtn: { deposit: 0.01, withdraw: 0.015 },
  moov: { deposit: 0.012, withdraw: 0.018 },
  coris: { deposit: 0.009, withdraw: 0.013 }
} as const;

export async function POST(request: Request) {
  if (!hasEnv("NEXT_PUBLIC_SUPABASE_URL") || !hasEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY") || !hasEnv("SUPABASE_SERVICE_ROLE_KEY")) {
    return NextResponse.json({ error: "Supabase n'est pas configure" }, { status: 503 });
  }

  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().formErrors.join(", ") || "Payload invalide" }, { status: 400 });
  }

  const supabaseServer = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabaseServer.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Authentification requise" }, { status: 401 });
  }

  const supabase = createSupabaseAdminClient();
  const { data: account } = await supabase
    .from("bank_accounts")
    .select("id, user_id, balance, currency")
    .eq("id", parsed.data.accountId)
    .maybeSingle();

  if (!account || account.user_id !== user.id) {
    return NextResponse.json({ error: "Compte bancaire introuvable" }, { status: 404 });
  }

  const feeRate = operatorFees[parsed.data.operator][parsed.data.direction];
  const fee = Math.max(Math.round(parsed.data.amount * feeRate), 100);
  const balance = Number(account.balance ?? 0);

  let nextBalance = balance;
  let netAmount = parsed.data.amount;
  if (parsed.data.direction === "deposit") {
    netAmount = parsed.data.amount - fee;
    nextBalance = balance + netAmount;
  } else {
    const totalDebit = parsed.data.amount + fee;
    if (balance < totalDebit) {
      return NextResponse.json({ error: "Solde insuffisant pour le retrait Mobile Money" }, { status: 400 });
    }
    netAmount = parsed.data.amount;
    nextBalance = balance - totalDebit;
  }

  const reference = `MM-${Date.now().toString().slice(-8)}`;
  const { error: updateError } = await supabase.from("bank_accounts").update({ balance: nextBalance }).eq("id", account.id).eq("user_id", user.id);
  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  const { error: transactionError } = await supabase.from("transactions").insert({
    from_account: parsed.data.direction === "withdraw" ? account.id : null,
    to_account: parsed.data.direction === "deposit" ? account.id : null,
    type: "mobile_money",
    amount: parsed.data.amount,
    fee,
    currency: account.currency ?? "XOF",
    reference,
    status: "completed",
    metadata: {
      operator: parsed.data.operator,
      direction: parsed.data.direction,
      phone_number: parsed.data.phoneNumber,
      net_amount: netAmount
    }
  });

  if (transactionError) {
    await supabase.from("bank_accounts").update({ balance }).eq("id", account.id).eq("user_id", user.id);
    return NextResponse.json({ error: transactionError.message }, { status: 500 });
  }

  return NextResponse.json({
    reference,
    fee,
    netAmount,
    currency: account.currency ?? "XOF"
  });
}
