import { NextResponse } from "next/server";
import { z } from "zod";
import { hasEnv } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { loadWasiIndices } from "@/lib/platform-data";

const bodySchema = z.object({
  countryCode: z.string().length(2),
  requestedAmount: z.number().positive()
});

export async function POST(request: Request) {
  if (!hasEnv("NEXT_PUBLIC_SUPABASE_URL") || !hasEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY") || !hasEnv("SUPABASE_SERVICE_ROLE_KEY")) {
    return NextResponse.json({ error: "Supabase n'est pas configure" }, { status: 503 });
  }

  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Payload invalide" }, { status: 400 });
  }

  const supabaseServer = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabaseServer.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Authentification requise" }, { status: 401 });
  }

  const supabase = createSupabaseAdminClient();
  const [{ data: accounts }, snapshot] = await Promise.all([
    supabase.from("bank_accounts").select("balance").eq("user_id", user.id),
    loadWasiIndices()
  ]);

  const totalBalance = ((accounts ?? []) as Array<{ balance: number | string | null }>).reduce(
    (sum: number, account: { balance: number | string | null }) => sum + Number(account.balance ?? 0),
    0
  );
  const indexRow = snapshot.rows.find((row) => row.country_code === parsed.data.countryCode);
  if (!indexRow) {
    return NextResponse.json({ error: "Indice pays introuvable" }, { status: 404 });
  }

  const countryComposite = Number(indexRow.composite);
  const coupPenalty = indexRow.is_coup ? 120 : 0;
  const liquidityScore = Math.min(350, Math.round(totalBalance / 20000));
  const ticketPenalty = Math.min(180, Math.round(parsed.data.requestedAmount / 75000));
  const score = Math.max(0, Math.min(850, 250 + liquidityScore + countryComposite * 4 - ticketPenalty - coupPenalty));

  let decision = "Refuse";
  let rationale = "Score insuffisant pour la grille credit.";

  if (indexRow.is_coup) {
    decision = "Refuse";
    rationale = "Le pays est marque en transition politique, ce qui declenche un veto credit.";
  } else if (score >= 700) {
    decision = "Approuve";
    rationale = "Liquidite et indice pays compatibles avec une approbation rapide.";
  } else if (score >= 580) {
    decision = "Sous conditions";
    rationale = "Le dossier est recevable sous reserve de garanties ou d'un montant reduit.";
  }

  return NextResponse.json({
    score,
    decision,
    rationale,
    countryComposite,
    totalBalance
  });
}
