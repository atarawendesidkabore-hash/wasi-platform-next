import { ETFCard } from "@/components/dex/ETFCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AfexTable } from "@/components/dex/AfexTable";
import { AFEX_INSTRUMENTS, AFEX_SUBFAMILIES, getAfexStats } from "@/lib/afex-instruments";
import Link from "next/link";

export default function DexEtfPage() {
  const stats = getAfexStats();

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <ETFCard title="WASI UEMOA" description="ETF large cap regional et allocation money market." status="Documentation produit et structure routees; branchement custodian a realiser." />
        <ETFCard title="WASI Shipping" description="Produit phare shipping/logistique/trade finance." status="Pret a etre alimente par les indices WASI et les flux maritimes live." />
        <ETFCard title="Custom Basket" description="Creation de paniers client institutionnel." status="UI de souscription a connecter a la chaine de settlement et au registre fonds." />
        <Link href="/dex/afex" className="block">
          <ETFCard
            title={`AFEX (${stats.total} pays)`}
            description="Indices d'exportation de matieres premieres africaines couvrant 54 etats souverains."
            status={`${stats.subfamilies} sous-familles: ${AFEX_SUBFAMILIES.map((sf) => sf.code).join(", ")}. ${stats.commodities} matieres premieres.`}
          />
        </Link>
      </div>

      {/* Full AFEX table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>ETF AFEX — Indices Export Afrique</CardTitle>
              <CardDescription>
                {stats.total} instruments souverains | {stats.detailed} prototypes detailles | {stats.commodities} matieres premieres | Comparaison continentale en USD
              </CardDescription>
            </div>
            <Link href="/dex/afex" className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-accent transition hover:bg-[#122033]">
              Vue complete →
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <AfexTable instruments={AFEX_INSTRUMENTS} />
        </CardContent>
      </Card>
    </>
  );
}
