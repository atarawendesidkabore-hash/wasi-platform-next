import { NextResponse } from "next/server";
import { z } from "zod";
import { hasEnv } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const bodySchema = z
  .object({
    fromAccountId: z.string().uuid(),
    toAccountId: z.string().uuid().optional(),
    toAccountNumber: z.string().min(8).optional(),
    amount: z.number().positive(),
    note: z.string().max(160).optional()
  })
  .refine((value) => Boolean(value.toAccountId || value.toAccountNumber), {
    message: "Le compte beneficiaire est requis."
  });

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
  const { data: source } = await supabase
    .from("bank_accounts")
    .select("id, user_id, account_number, balance, country, currency")
    .eq("id", parsed.data.fromAccountId)
    .maybeSingle();

  if (!source || source.user_id !== user.id) {
    return NextResponse.json({ error: "Compte source introuvable" }, { status: 404 });
  }

  const destinationQuery = parsed.data.toAccountId
    ? supabase.from("bank_accounts").select("id, account_number, balance, country, currency").eq("id", parsed.data.toAccountId)
    : supabase.from("bank_accounts").select("id, account_number, balance, country, currency").eq("account_number", parsed.data.toAccountNumber ?? "");
  const { data: destination } = await destinationQuery.maybeSingle();

  if (!destination) {
    return NextResponse.json({ error: "Compte destinataire introuvable" }, { status: 404 });
  }

  if (destination.id === source.id) {
    return NextResponse.json({ error: "Le compte source et le compte destinataire doivent etre differents" }, { status: 400 });
  }

  const intraCountry = source.country === destination.country;
  const fee = intraCountry ? Math.max(parsed.data.amount * 0.005, 500) : Math.max(parsed.data.amount * 0.01, 1000);
  const totalDebit = parsed.data.amount + fee;
  const sourceBalance = Number(source.balance ?? 0);
  const destinationBalance = Number(destination.balance ?? 0);

  if (sourceBalance < totalDebit) {
    return NextResponse.json({ error: "Solde insuffisant" }, { status: 400 });
  }

  const reference = `VIR-${Date.now().toString().slice(-8)}`;
  const updatedSourceBalance = sourceBalance - totalDebit;
  const updatedDestinationBalance = destinationBalance + parsed.data.amount;

  const { error: sourceUpdateError } = await supabase.from("bank_accounts").update({ balance: updatedSourceBalance }).eq("id", source.id).eq("user_id", user.id);
  if (sourceUpdateError) {
    return NextResponse.json({ error: sourceUpdateError.message }, { status: 500 });
  }

  const { error: destinationUpdateError } = await supabase.from("bank_accounts").update({ balance: updatedDestinationBalance }).eq("id", destination.id);
  if (destinationUpdateError) {
    await supabase.from("bank_accounts").update({ balance: sourceBalance }).eq("id", source.id).eq("user_id", user.id);
    return NextResponse.json({ error: destinationUpdateError.message }, { status: 500 });
  }

  const { error: transactionError } = await supabase.from("transactions").insert({
    from_account: source.id,
    to_account: destination.id,
    type: "virement",
    amount: parsed.data.amount,
    fee,
    currency: source.currency ?? "XOF",
    reference,
    status: "completed",
    metadata: {
      corridor: intraCountry ? "local" : "uemoa",
      note: parsed.data.note ?? null,
      destination_account_number: destination.account_number ?? parsed.data.toAccountNumber ?? null
    }
  });

  if (transactionError) {
    await supabase.from("bank_accounts").update({ balance: sourceBalance }).eq("id", source.id).eq("user_id", user.id);
    await supabase.from("bank_accounts").update({ balance: destinationBalance }).eq("id", destination.id);
    return NextResponse.json({ error: transactionError.message }, { status: 500 });
  }

  return NextResponse.json({
    reference,
    fee,
    amount: parsed.data.amount,
    currency: source.currency ?? "XOF",
    destinationAccountNumber: destination.account_number ?? parsed.data.toAccountNumber ?? null
  });
}
