"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function CreditRequestForm() {
  const [country, setCountry] = useState("BF");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/banking/credit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          countryCode: country,
          requestedAmount: Number(amount)
        })
      });

      const payload = (await response.json()) as { decision?: string; rationale?: string; error?: string; score?: number };

      if (!response.ok) {
        setError(payload.error ?? "La simulation credit a echoue.");
        return;
      }

      setMessage(`${payload.decision} - Score ${payload.score ?? "n/a"}/850 - ${payload.rationale ?? ""}`);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Demande de credit</CardTitle>
        <CardDescription>Le moteur s'appuie sur `bank_accounts` et `wasi_indices` en base.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form className="space-y-4" onSubmit={onSubmit}>
          <Select onChange={(event) => setCountry(event.target.value)} value={country}>
            <option value="BF">Burkina Faso</option>
            <option value="CI">Cote d'Ivoire</option>
            <option value="SN">Senegal</option>
            <option value="GH">Ghana</option>
            <option value="NG">Nigeria</option>
          </Select>
          <Input onChange={(event) => setAmount(event.target.value)} placeholder="Montant demande en XOF" type="number" min="1" value={amount} />
          <Button disabled={loading} type="submit">
            {loading ? "Analyse..." : "Evaluer"}
          </Button>
        </form>
        {message ? <div className="rounded-lg border border-success/40 bg-[#10301f] p-4 text-sm text-success">{message}</div> : null}
        {error ? <div className="rounded-lg border border-danger/40 bg-[#31161b] p-4 text-sm text-danger">{error}</div> : null}
      </CardContent>
    </Card>
  );
}
