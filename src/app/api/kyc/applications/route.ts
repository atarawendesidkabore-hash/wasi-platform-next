import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasEnv } from "@/lib/env";

const bodySchema = z.object({
  tierRequested: z.number().int().min(1).max(4),
  ppeDeclared: z.boolean(),
  idDocumentUrl: z.string().min(3),
  addressProofUrl: z.string().min(3),
  selfieUrl: z.string().min(3),
  companyRegistrationUrl: z.string().optional(),
  notes: z.string().max(1000).optional()
});

export async function POST(request: Request) {
  if (!hasEnv("NEXT_PUBLIC_SUPABASE_URL") || !hasEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY")) {
    return NextResponse.json({ error: "Supabase n'est pas configure" }, { status: 503 });
  }

  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().formErrors.join(", ") || "Payload invalide" }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Authentification requise" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("kyc_applications")
    .insert({
      user_id: user.id,
      tier_requested: parsed.data.tierRequested,
      status: "pending",
      aml_cleared: false,
      ppe_declared: parsed.data.ppeDeclared,
      documents: {
        id_document_url: parsed.data.idDocumentUrl,
        address_proof_url: parsed.data.addressProofUrl,
        selfie_url: parsed.data.selfieUrl,
        company_registration_url: parsed.data.companyRegistrationUrl ?? null,
        notes: parsed.data.notes ?? null,
        aml_declarations_accepted: true
      }
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    id: data?.id ?? null,
    message: "Dossier KYC soumis pour revue analyste."
  });
}
