import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AfexTable } from "@/components/dex/AfexTable";
import { AFEX_INSTRUMENTS, getAfexStats } from "@/lib/afex-instruments";

export default function DexAfexPage() {
  const stats = getAfexStats();

  return (
    <>
      {/* KPI strip */}
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-8">
        {[
          { label: "Instruments", value: stats.total },
          { label: "Sous-familles", value: stats.subfamilies },
          { label: "Detailles", value: stats.detailed },
          { label: "Starter", value: stats.starter },
          { label: "Matieres", value: stats.commodities },
          { label: "Devises", value: stats.currencies },
          { label: "Cotier", value: stats.coastal },
          { label: "Enclave", value: stats.landlocked },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-lg border border-border bg-[#081220] p-3">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">{kpi.label}</div>
            <div className="mt-1 font-mono text-2xl font-bold text-foreground">{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Main table */}
      <Card>
        <CardHeader>
          <CardTitle>AFEX — Africa Export Index Family</CardTitle>
          <CardDescription>
            54 fonds indiciels souverains d&apos;exportation de matieres premieres couvrant l&apos;ensemble du continent africain.
            Comparaison continentale en USD. Chaque pays conserve sa propre methodologie d&apos;exportation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AfexTable instruments={AFEX_INSTRUMENTS} />
        </CardContent>
      </Card>
    </>
  );
}
