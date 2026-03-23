import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const BOURSES = [
  { code: "BRVM", name: "Bourse Regionale des Valeurs Mobilieres", region: "UEMOA / Afrique de l'Ouest", currency: "XOF", status: "active", stocks: 46, description: "Bourse regionale couvrant 8 pays de l'UEMOA. Siege a Abidjan, Cote d'Ivoire." },
  { code: "NGX", name: "Nigerian Exchange Group", region: "Nigeria", currency: "NGN", status: "active", stocks: 150, description: "Plus grande bourse d'Afrique de l'Ouest par capitalisation. Lagos." },
  { code: "GSE", name: "Ghana Stock Exchange", region: "Ghana", currency: "GHS", status: "active", stocks: 42, description: "Marche secondaire principal du Ghana. Accra." },
  { code: "JSE", name: "Johannesburg Stock Exchange", region: "Afrique du Sud", currency: "ZAR", status: "active", stocks: 350, description: "Plus grande bourse d'Afrique par capitalisation boursiere." },
  { code: "EGX", name: "Egyptian Exchange", region: "Egypte", currency: "EGP", status: "active", stocks: 220, description: "L'une des plus anciennes bourses d'Afrique. Le Caire." },
  { code: "CSE", name: "Casablanca Stock Exchange", region: "Maroc", currency: "MAD", status: "active", stocks: 76, description: "Principale bourse du Maghreb. Casablanca." },
  { code: "NSE", name: "Nairobi Securities Exchange", region: "Kenya", currency: "KES", status: "active", stocks: 65, description: "Bourse leader d'Afrique de l'Est. Nairobi." },
  { code: "DSE", name: "Dar es Salaam Stock Exchange", region: "Tanzanie", currency: "TZS", status: "active", stocks: 28, description: "Marche emergent est-africain. Dar es Salaam." },
  { code: "USE", name: "Uganda Securities Exchange", region: "Ouganda", currency: "UGX", status: "active", stocks: 17, description: "Marche en croissance de l'Afrique de l'Est. Kampala." },
  { code: "BVMAC", name: "Bourse des Valeurs Mobilieres de l'Afrique Centrale", region: "CEMAC / Afrique Centrale", currency: "XAF", status: "active", stocks: 12, description: "Bourse regionale des 6 pays de la CEMAC. Douala." },
  { code: "RSE", name: "Rwanda Stock Exchange", region: "Rwanda", currency: "RWF", status: "active", stocks: 10, description: "Marche emergent d'Afrique de l'Est. Kigali." },
  { code: "BSSE", name: "Botswana Stock Exchange", region: "Botswana", currency: "BWP", status: "active", stocks: 35, description: "L'une des bourses les mieux reglementees d'Afrique. Gaborone." },
  { code: "LuSE", name: "Lusaka Securities Exchange", region: "Zambie", currency: "ZMW", status: "active", stocks: 24, description: "Marche de capitaux principal de la Zambie. Lusaka." },
  { code: "ZSE", name: "Zimbabwe Stock Exchange", region: "Zimbabwe", currency: "ZWG", status: "active", stocks: 60, description: "Bourse historique d'Afrique australe. Harare." },
  { code: "SEM", name: "Stock Exchange of Mauritius", region: "Maurice", currency: "MUR", status: "active", stocks: 52, description: "Hub financier de l'Ocean Indien. Port Louis." },
  { code: "MSEI", name: "Malawi Stock Exchange", region: "Malawi", currency: "MWK", status: "active", stocks: 16, description: "Marche en developpement. Blantyre." },
  { code: "ASE", name: "Algiers Stock Exchange", region: "Algerie", currency: "DZD", status: "active", stocks: 5, description: "Marche naissant d'Afrique du Nord. Alger." },
];

const REGION_COLORS: Record<string, string> = {
  "UEMOA / Afrique de l'Ouest": "#22c55e",
  "Nigeria": "#22c55e",
  "Ghana": "#22c55e",
  "Afrique du Sud": "#ef4444",
  "Egypte": "#f59e0b",
  "Maroc": "#f59e0b",
  "Kenya": "#3b82f6",
  "Tanzanie": "#3b82f6",
  "Ouganda": "#3b82f6",
  "CEMAC / Afrique Centrale": "#a78bfa",
  "Rwanda": "#3b82f6",
  "Botswana": "#ef4444",
  "Zambie": "#ef4444",
  "Zimbabwe": "#ef4444",
  "Maurice": "#ef4444",
  "Malawi": "#ef4444",
  "Algerie": "#f59e0b",
};

export default function BoursePage() {
  const totalStocks = BOURSES.reduce((s, b) => s + b.stocks, 0);

  return (
    <>
      {/* KPI strip */}
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
        {[
          { label: "Bourses", value: BOURSES.length },
          { label: "Titres listes", value: totalStocks },
          { label: "Devises", value: new Set(BOURSES.map((b) => b.currency)).size },
          { label: "Statut", value: "Toutes actives" },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-lg border border-border bg-[#081220] p-3">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">{kpi.label}</div>
            <div className="mt-1 font-mono text-2xl font-bold text-foreground">{kpi.value}</div>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bourses Africaines</CardTitle>
          <CardDescription>
            {BOURSES.length} places boursieres couvrant l&apos;ensemble du continent africain. Donnees structurelles et connectivite pour le trading panafricain.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-[#0a1628]">
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Code</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Nom</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Region</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Devise</th>
                  <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Titres</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Statut</th>
                </tr>
              </thead>
              <tbody>
                {BOURSES.map((b) => (
                  <tr key={b.code} className="border-b border-border/50 transition hover:bg-[#122033]">
                    <td className="px-4 py-3 font-mono font-bold text-accent">{b.code}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{b.name}</div>
                      <div className="text-xs text-muted">{b.description}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: `${REGION_COLORS[b.region] ?? "#666"}22`, color: REGION_COLORS[b.region] ?? "#666" }}>
                        {b.region}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">{b.currency}</td>
                    <td className="px-4 py-3 text-center font-mono text-sm font-semibold">{b.stocks}</td>
                    <td className="px-4 py-3">
                      <Badge variant="success">Actif</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* WASI Private Market */}
      <Card>
        <CardHeader>
          <CardTitle>WASI Private Market</CardTitle>
          <CardDescription>
            Emissions privees, marche secondaire de tokens AFEX, et placement de titres non cotes.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {[
            { title: "Emissions primaires", desc: "IPO, augmentations de capital et placements prives structures pour les entreprises africaines.", status: "Interface prete" },
            { title: "Marche secondaire AFEX", desc: "Echange de parts de fonds AFEX entre investisseurs qualifies avec carnet d'ordres.", status: "Architecture prete" },
            { title: "Tokenisation", desc: "Representation numerique des actifs sous-jacents via la blockchain pour la transparence et la liquidite.", status: "Recherche en cours" },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-border bg-[#081220] p-4 space-y-2">
              <div className="font-semibold">{item.title}</div>
              <p className="text-xs leading-relaxed text-muted">{item.desc}</p>
              <Badge variant="warning">{item.status}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}
