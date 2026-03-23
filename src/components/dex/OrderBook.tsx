import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type OrderBookProps = {
  rates: {
    EUR?: number;
    USD?: number;
    GHS?: number;
    NGN?: number;
  };
};

export function OrderBook({ rates }: OrderBookProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Desk de cotation</CardTitle>
        <CardDescription>Feed FX live branche pour le desk DEX. Le carnet BRVM temps reel reste a connecter a votre fournisseur de marche.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Object.entries(rates).map(([symbol, value]) => (
          <div className="rounded-lg border border-border bg-[#081220] p-4" key={symbol}>
            <div className="text-xs uppercase tracking-[0.18em] text-muted">{symbol}/XOF</div>
            <div className="mt-2 font-mono text-2xl font-semibold text-foreground">{value ? (1 / value).toFixed(3) : "n/a"}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
