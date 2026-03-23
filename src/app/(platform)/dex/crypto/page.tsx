import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { fetchLiveCrypto } from "@/lib/wasi-indices";

export default async function DexCryptoPage() {
  const result = await fetchLiveCrypto().catch(() => null);

  if (!result) {
    return <EmptyState title="Aucun flux crypto" description="Le proxy CoinGecko n'a pas repondu. Aucun prix de secours n'est injecte." />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crypto bridge</CardTitle>
        <CardDescription>Prix live recupere cote serveur et servi par le backend Next.js.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {Object.entries(result.assets).map(([ticker, value]) => (
          <div className="rounded-lg border border-border bg-[#081220] p-4" key={ticker}>
            <div className="text-xs uppercase tracking-[0.18em] text-muted">{ticker}</div>
            <div className="mt-2 font-mono text-2xl font-semibold">{value?.usd ?? "n/a"} USD</div>
            <div className="mt-1 text-sm text-muted">{value?.usd_24h_change?.toFixed(2) ?? "n/a"}% sur 24h</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
