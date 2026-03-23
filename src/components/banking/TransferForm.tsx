"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { BankAccountRecord } from "@/lib/platform-data";
import { formatCurrency } from "@/lib/utils";

type TransferFormProps = {
  accounts: BankAccountRecord[];
};

export function TransferForm({ accounts }: TransferFormProps) {
  const router = useRouter();
  const [fromAccountId, setFromAccountId] = useState(accounts[0]?.id ?? "");
  const [toAccountNumber, setToAccountNumber] = useState(accounts[1]?.account_number ?? "");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedSource = accounts.find((account) => account.id === fromAccountId) ?? null;
  const quickTargets = accounts.filter((account) => account.id !== fromAccountId && account.account_number);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult("");

    try {
      const response = await fetch("/api/banking/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fromAccountId,
          toAccountNumber,
          amount: Number(amount),
          note
        })
      });

      const payload = (await response.json()) as {
        reference?: string;
        error?: string;
        fee?: number;
        currency?: string;
      };

      if (!response.ok) {
        setError(payload.error ?? "Le virement a echoue.");
        return;
      }

      setResult(`Virement enregistre. Reference: ${payload.reference}. Frais: ${formatCurrency(Number(payload.fee ?? 0), payload.currency ?? "XOF")}.`);
      setAmount("");
      setNote("");
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
        <CardTitle>Virement UEMOA</CardTitle>
        <CardDescription>Debit, credit et journalisation en base sans exposition de UUID techniques a l'utilisateur.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {accounts.length === 0 ? (
          <div className="rounded-lg border border-border bg-[#081220] p-4 text-sm text-muted">
            Connectez-vous pour provisionner vos comptes de base avant d'executer un virement.
          </div>
        ) : (
          <form className="space-y-4" onSubmit={onSubmit}>
            <Select onChange={(event) => setFromAccountId(event.target.value)} value={fromAccountId}>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {(account.type ?? "Compte").toUpperCase()} - {account.account_number ?? account.id}
                </option>
              ))}
            </Select>

            {selectedSource ? (
              <div className="rounded-lg border border-border bg-[#081220] p-4 text-sm text-muted">
                Solde disponible:{" "}
                <span className="font-semibold text-foreground">
                  {formatCurrency(Number(selectedSource.balance ?? 0), selectedSource.currency ?? "XOF")}
                </span>
              </div>
            ) : null}

            <Input value={toAccountNumber} onChange={(event) => setToAccountNumber(event.target.value)} placeholder="Numero de compte beneficiaire" />

            {quickTargets.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {quickTargets.map((account) => (
                  <button
                    className="rounded-full border border-border px-3 py-1 text-xs text-muted transition hover:border-accent hover:text-foreground"
                    key={account.id}
                    onClick={() => setToAccountNumber(account.account_number ?? "")}
                    type="button"
                  >
                    {account.account_number}
                  </button>
                ))}
              </div>
            ) : null}

            <Input value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="Montant en XOF" type="number" min="1" />
            <Input value={note} onChange={(event) => setNote(event.target.value)} placeholder="Motif ou reference operation" />
            <Button disabled={loading} type="submit">
              {loading ? "Traitement..." : "Executer le virement"}
            </Button>
          </form>
        )}

        {result ? <div className="rounded-lg border border-success/40 bg-[#10301f] p-4 text-sm text-success">{result}</div> : null}
        {error ? <div className="rounded-lg border border-danger/40 bg-[#31161b] p-4 text-sm text-danger">{error}</div> : null}
      </CardContent>
    </Card>
  );
}
