"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { BankAccountRecord } from "@/lib/platform-data";
import { formatCurrency } from "@/lib/utils";

type MobileMoneyFormProps = {
  accounts: BankAccountRecord[];
};

export function MobileMoneyForm({ accounts }: MobileMoneyFormProps) {
  const router = useRouter();
  const [accountId, setAccountId] = useState(accounts[0]?.id ?? "");
  const [direction, setDirection] = useState("deposit");
  const [operator, setOperator] = useState("orange");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedAccount = accounts.find((account) => account.id === accountId) ?? null;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult("");

    try {
      const response = await fetch("/api/banking/mobile-money", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          accountId,
          direction,
          operator,
          phoneNumber,
          amount: Number(amount)
        })
      });

      const payload = (await response.json()) as { reference?: string; error?: string; fee?: number; netAmount?: number; currency?: string };
      if (!response.ok) {
        setError(payload.error ?? "L'operation Mobile Money a echoue.");
        return;
      }

      setResult(
        `Operation Mobile Money enregistree. Reference: ${payload.reference}. Net: ${formatCurrency(Number(payload.netAmount ?? 0), payload.currency ?? "XOF")}.`
      );
      setAmount("");
      setPhoneNumber("");
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
        <CardTitle>Mobile Money</CardTitle>
        <CardDescription>Orange Money, Wave, MTN MoMo, Moov et Coris via un workflow bancaire unifie.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {accounts.length === 0 ? (
          <div className="rounded-lg border border-border bg-[#081220] p-4 text-sm text-muted">
            Connectez-vous pour provisionner vos comptes avant d'executer une operation Mobile Money.
          </div>
        ) : (
          <form className="space-y-4" onSubmit={onSubmit}>
            <Select onChange={(event) => setAccountId(event.target.value)} value={accountId}>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {(account.type ?? "Compte").toUpperCase()} - {account.account_number ?? account.id}
                </option>
              ))}
            </Select>

            {selectedAccount ? (
              <div className="rounded-lg border border-border bg-[#081220] p-4 text-sm text-muted">
                Solde courant:{" "}
                <span className="font-semibold text-foreground">
                  {formatCurrency(Number(selectedAccount.balance ?? 0), selectedAccount.currency ?? "XOF")}
                </span>
              </div>
            ) : null}

            <Select onChange={(event) => setDirection(event.target.value)} value={direction}>
              <option value="deposit">Depot Mobile Money vers compte</option>
              <option value="withdraw">Retrait compte vers Mobile Money</option>
            </Select>

            <Select onChange={(event) => setOperator(event.target.value)} value={operator}>
              <option value="orange">Orange Money</option>
              <option value="wave">Wave</option>
              <option value="mtn">MTN MoMo</option>
              <option value="moov">Moov Money</option>
              <option value="coris">Coris Money</option>
            </Select>

            <Input onChange={(event) => setPhoneNumber(event.target.value)} placeholder="Numero Mobile Money" value={phoneNumber} />
            <Input onChange={(event) => setAmount(event.target.value)} placeholder="Montant en XOF" type="number" min="1" value={amount} />

            <Button disabled={loading} type="submit">
              {loading ? "Traitement..." : "Executer l'operation"}
            </Button>
          </form>
        )}

        {result ? <div className="rounded-lg border border-success/40 bg-[#10301f] p-4 text-sm text-success">{result}</div> : null}
        {error ? <div className="rounded-lg border border-danger/40 bg-[#31161b] p-4 text-sm text-danger">{error}</div> : null}
      </CardContent>
    </Card>
  );
}
