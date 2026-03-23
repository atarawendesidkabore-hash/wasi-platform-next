import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

type AccountCardProps = {
  accountNumber: string | null;
  type: string | null;
  balance: number | string | null;
  currency: string | null;
  country: string | null;
  status: string | null;
};

export function AccountCard({ accountNumber, type, balance, currency, country, status }: AccountCardProps) {
  const numericBalance = typeof balance === "number" ? balance : Number(balance ?? 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{type ?? "Compte"}</CardTitle>
        <CardDescription>{accountNumber ?? "Numero non attribue"}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="font-mono text-3xl font-bold text-foreground">{formatCurrency(numericBalance, currency ?? "XOF")}</div>
        <div className="text-sm text-muted">
          {country ?? "Pays non defini"} · {status ?? "statut inconnu"}
        </div>
      </CardContent>
    </Card>
  );
}
