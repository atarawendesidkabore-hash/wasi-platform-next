import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BRVMTable } from "@/components/dex/BRVMTable";
import { ETFCard } from "@/components/dex/ETFCard";
import { OrderBook } from "@/components/dex/OrderBook";
import { AfexTable } from "@/components/dex/AfexTable";
import { EmptyState } from "@/components/ui/empty-state";
import { getCurrentUser, loadUserDexOrders } from "@/lib/platform-data";
import { fetchLiveCrypto, fetchLiveRates } from "@/lib/wasi-indices";
import { AFEX_INSTRUMENTS, getAfexStats } from "@/lib/afex-instruments";
import Link from "next/link";

export default async function DexPage() {
  const user = await getCurrentUser();
  const orders = await loadUserDexOrders(user?.id);
  const afexStats = getAfexStats();

  const [ratesResult, cryptoResult] = await Promise.allSettled([fetchLiveRates(), fetchLiveCrypto()]);
  const rates = ratesResult.status === "fulfilled" ? ratesResult.value.rates : {};
  const crypto = cryptoResult.status === "fulfilled" ? cryptoResult.value.assets : null;

  return (
    <>
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>WASI DEX</CardTitle>
            <CardDescription>Ordres stockes en base, feed FX live, et architecture ETF/crypto prete a connecter.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <ETFCard title="WASI Shipping" description="Produit marquee pour le maritime ouest-africain." status="Structure produit prete; NAV et executions a brancher au moteur ETF." />
              <ETFCard title="UEMOA baskets" description="Creation / redemption de paniers personnalises." status="Workflow UI a relier a vos actifs custodians et a la compta fonds." />
              <ETFCard title="Crypto bridge" description="BTC / ETH / USDC / XOF via proxy backend." status={crypto ? "Prix live CoinGecko connectes." : "API CoinGecko non disponible."} />
              <Link href="/dex/afex" className="block">
                <ETFCard
                  title={`AFEX — ${afexStats.total} pays`}
                  description="Indices d'exportation de matieres premieres pour 54 etats africains souverains."
                  status={`${afexStats.detailed} prototypes detailles, ${afexStats.starter} profils starter, ${afexStats.commodities} matieres premieres, ${afexStats.subfamilies} sous-familles.`}
                />
              </Link>
            </div>
          </CardContent>
        </Card>
        <OrderBook rates={rates} />
      </section>

      {/* AFEX Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>AFEX — Africa Export Index Family</CardTitle>
              <CardDescription>54 fonds indiciels souverains. Cliquez sur une ligne pour voir le detail.</CardDescription>
            </div>
            <Link href="/dex/afex" className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-accent transition hover:bg-[#122033]">
              Voir tout AFEX →
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <AfexTable instruments={AFEX_INSTRUMENTS} />
        </CardContent>
      </Card>

      {crypto ? (
        <Card>
          <CardHeader>
            <CardTitle>Flux crypto live</CardTitle>
            <CardDescription>Proxy backend sur CoinGecko sans donnees fictives.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {Object.entries(crypto).map(([ticker, value]) => (
              <div className="rounded-lg border border-border bg-[#081220] p-4" key={ticker}>
                <div className="text-xs uppercase tracking-[0.18em] text-muted">{ticker}</div>
                <div className="mt-2 font-mono text-2xl font-semibold text-foreground">{value?.usd ?? "n/a"} USD</div>
                <div className="mt-1 text-sm text-muted">24h {value?.usd_24h_change?.toFixed(2) ?? "n/a"}%</div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
        <EmptyState title="Flux crypto indisponible" description="La page reste branchee aux APIs live; si CoinGecko ne repond pas, aucun prix de remplacement n'est injecte." />
      )}

      <BRVMTable orders={orders as never[]} />
    </>
  );
}
