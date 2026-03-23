"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type KycPayload = {
  tierRequested: number;
  ppeDeclared: boolean;
  idDocumentUrl: string;
  addressProofUrl: string;
  selfieUrl: string;
  companyRegistrationUrl?: string;
  notes?: string;
};

export function KycApplicationForm() {
  const router = useRouter();
  const [tierRequested, setTierRequested] = useState("2");
  const [idDocumentUrl, setIdDocumentUrl] = useState("");
  const [addressProofUrl, setAddressProofUrl] = useState("");
  const [selfieUrl, setSelfieUrl] = useState("");
  const [companyRegistrationUrl, setCompanyRegistrationUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [ppeDeclared, setPpeDeclared] = useState(false);
  const [amlAccepted, setAmlAccepted] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (!amlAccepted) {
      setLoading(false);
      setError("Vous devez accepter les declarations AML avant soumission.");
      return;
    }

    const payload: KycPayload = {
      tierRequested: Number(tierRequested),
      ppeDeclared,
      idDocumentUrl,
      addressProofUrl,
      selfieUrl,
      companyRegistrationUrl: companyRegistrationUrl || undefined,
      notes: notes || undefined
    };

    try {
      const response = await fetch("/api/kyc/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = (await response.json()) as { id?: string; error?: string; message?: string };
      if (!response.ok) {
        setError(result.error ?? "La soumission KYC a echoue.");
        return;
      }

      setMessage(result.message ?? `Dossier KYC soumis. Reference: ${result.id}`);
      setIdDocumentUrl("");
      setAddressProofUrl("");
      setSelfieUrl("");
      setCompanyRegistrationUrl("");
      setNotes("");
      setPpeDeclared(false);
      setAmlAccepted(false);
      router.refresh();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Soumettre un dossier KYC</CardTitle>
        <CardDescription>Workflow BCEAO avec preuves documentaires stockees en base et pretes pour Supabase Storage.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form className="space-y-4" onSubmit={onSubmit}>
          <Select onChange={(event) => setTierRequested(event.target.value)} value={tierRequested}>
            <option value="1">Tier 1 - Basique</option>
            <option value="2">Tier 2 - Standard</option>
            <option value="3">Tier 3 - Entreprise</option>
            <option value="4">Tier 4 - Institutionnel</option>
          </Select>
          <Input onChange={(event) => setIdDocumentUrl(event.target.value)} placeholder="URL ou chemin de la piece d'identite" value={idDocumentUrl} />
          <Input onChange={(event) => setAddressProofUrl(event.target.value)} placeholder="URL du justificatif de domicile" value={addressProofUrl} />
          <Input onChange={(event) => setSelfieUrl(event.target.value)} placeholder="URL du selfie / liveness check" value={selfieUrl} />
          <Input
            onChange={(event) => setCompanyRegistrationUrl(event.target.value)}
            placeholder="URL RCCM / registre de commerce (optionnel)"
            value={companyRegistrationUrl}
          />
          <Textarea onChange={(event) => setNotes(event.target.value)} placeholder="Informations complementaires, IFU, due diligence..." value={notes} />
          <label className="flex items-start gap-3 rounded-lg border border-border bg-[#081220] p-4 text-sm text-muted">
            <input checked={ppeDeclared} onChange={(event) => setPpeDeclared(event.target.checked)} type="checkbox" />
            <span>Je suis une personne politiquement exposee (PPE) ou j'en declare explicitement le statut pour revue.</span>
          </label>
          <label className="flex items-start gap-3 rounded-lg border border-border bg-[#081220] p-4 text-sm text-muted">
            <input checked={amlAccepted} onChange={(event) => setAmlAccepted(event.target.checked)} type="checkbox" />
            <span>Je confirme l'origine licite des fonds et j'accepte la revue AML/CFT conforme BCEAO.</span>
          </label>
          <Button disabled={loading} type="submit">
            {loading ? "Soumission..." : "Soumettre le dossier"}
          </Button>
        </form>
        {message ? <div className="rounded-lg border border-success/40 bg-[#10301f] p-4 text-sm text-success">{message}</div> : null}
        {error ? <div className="rounded-lg border border-danger/40 bg-[#31161b] p-4 text-sm text-danger">{error}</div> : null}
      </CardContent>
    </Card>
  );
}
