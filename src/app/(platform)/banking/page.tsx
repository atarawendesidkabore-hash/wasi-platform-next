import { AccountCard } from "@/components/banking/AccountCard";
import { CreditScore } from "@/components/banking/CreditScore";
import { TransferForm } from "@/components/banking/TransferForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ensureUserWorkspace, getCurrentUser, loadUserBankAccounts, loadUserTransactions, loadWasiIndices } from "@/lib/platform-data";
import { formatCurrency } from "@/lib/utils";

export default async function BankingPage() {
  const user = await getCurrentUser();
  await ensureUserWorkspace(user);

  const [accounts, transactions, snapshot] = await Promise.all([
    loadUserBankAccounts(user?.id),
    loadUserTransactions(user?.id),
    loadWasiIndices()
  ]);

  const totalBalance = accounts.reduce((sum, account) => sum + Number(account.balance ?? 0), 0);
  const bfIndex = snapshot.rows.find((row) => row.country_code === "BF")?.composite ?? null;
  const score = accounts.length > 0 && bfIndex !== null ? Math.min(850, Math.round(250 + totalBalance / 15000 + bfIndex * 4)) : null;
  const decision = score === null ? "Decision indisponible" : score >= 700 ? "Eligible" : score >= 580 ? "Sous conditions" : "A renforcer";
  const rationale =
    score === null
      ? "Connectez un compte utilisateur et des indices pays pour activer le moteur de decision."
      : `Score calcule depuis ${accounts.length} compte(s), une liquidite de ${formatCurrency(totalBalance)} et l'indice WASI Burkina ${bfIndex}/100.`;

  return (
    <>
      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>Vue comptes UEMOA</CardTitle>
            <CardDescription>Comptes et transactions servis depuis Supabase avec RLS.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="font-mono text-4xl font-bold text-foreground">{formatCurrency(totalBalance)}</div>
            <div className="text-sm text-muted">{user?.email ?? "Aucun utilisateur connecte"}</div>
          </CardContent>
        </Card>
        <CreditScore decision={decision} rationale={rationale} score={score} />
      </section>

      {accounts.length > 0 ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {accounts.map((account) => (
            <AccountCard
              accountNumber={account.account_number}
              balance={account.balance}
              country={account.country}
              currency={account.currency}
              key={account.id}
              status={account.status}
              type={account.type}
            />
          ))}
        </section>
      ) : (
        <EmptyState title="Aucun compte bancaire" description="Connectez-vous pour provisionner vos comptes ou verifiez que Supabase est correctement configure." />
      )}

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <TransferForm accounts={accounts} />
        <Card>
          <CardHeader>
            <CardTitle>Dernieres transactions</CardTitle>
            <CardDescription>Le journal transactionnel est remonte depuis la base en temps reel applicatif.</CardDescription>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <EmptyState title="Aucune transaction" description="Les virements, depots et mouvements Mobile Money apparaitront ici apres execution." />
            ) : (
              <div className="overflow-x-auto rounded-xl border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Frais</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.type}</TableCell>
                        <TableCell>{formatCurrency(Number(transaction.amount ?? 0), transaction.currency ?? "XOF")}</TableCell>
                        <TableCell>{formatCurrency(Number(transaction.fee ?? 0), transaction.currency ?? "XOF")}</TableCell>
                        <TableCell className="font-mono text-xs">{transaction.reference ?? "-"}</TableCell>
                        <TableCell>{transaction.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </>
  );
}
