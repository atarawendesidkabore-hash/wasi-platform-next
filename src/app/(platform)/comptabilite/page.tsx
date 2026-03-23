import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const OHADA_MODULES = [
  {
    title: "Journal",
    code: "JRN",
    description: "Enregistrement chronologique de toutes les operations comptables selon le plan OHADA.",
    features: ["Ecritures debit/credit", "Journal de banque", "Journal de caisse", "Journal des achats", "Journal des ventes"],
    status: "pret",
  },
  {
    title: "Grand Livre",
    code: "GL",
    description: "Regroupement de toutes les ecritures par compte comptable pour l'analyse detaillee.",
    features: ["Soldes par compte", "Lettrage", "Rapprochement bancaire", "Export PDF"],
    status: "pret",
  },
  {
    title: "Balance",
    code: "BAL",
    description: "Situation de l'ensemble des comptes a une date donnee avec soldes debiteurs et crediteurs.",
    features: ["Balance generale", "Balance agee", "Balance par tiers", "Comparaison N/N-1"],
    status: "pret",
  },
  {
    title: "Bilan",
    code: "BIL",
    description: "Etat de la situation patrimoniale : actifs, passifs et capitaux propres.",
    features: ["Actif immobilise", "Actif circulant", "Capitaux propres", "Dettes", "Tresorerie"],
    status: "pret",
  },
  {
    title: "Compte de Resultat",
    code: "CR",
    description: "Synthese des produits et charges de l'exercice pour determiner le resultat net.",
    features: ["Produits d'exploitation", "Charges d'exploitation", "Resultat financier", "Resultat exceptionnel"],
    status: "pret",
  },
  {
    title: "TAFIRE",
    code: "TAF",
    description: "Tableau Financier des Ressources et Emplois — flux de tresorerie OHADA.",
    features: ["Activites d'exploitation", "Activites d'investissement", "Activites de financement"],
    status: "en_dev",
  },
  {
    title: "Notes Annexes",
    code: "ANN",
    description: "Informations complementaires aux etats financiers pour une image fidele.",
    features: ["Methodes comptables", "Engagements hors bilan", "Evenements posterieurs"],
    status: "en_dev",
  },
  {
    title: "Integration DGI",
    code: "DGI",
    description: "Generation automatique des declarations fiscales au format requis par la Direction Generale des Impots.",
    features: ["DSF (Declaration Statistique et Fiscale)", "TVA", "BIC/BNC", "Patente", "Export EDI"],
    status: "planifie",
  },
];

const PLAN_COMPTABLE = [
  { classe: 1, label: "Comptes de ressources durables", color: "#3b82f6" },
  { classe: 2, label: "Comptes d'actif immobilise", color: "#a78bfa" },
  { classe: 3, label: "Comptes de stocks", color: "#f59e0b" },
  { classe: 4, label: "Comptes de tiers", color: "#22c55e" },
  { classe: 5, label: "Comptes de tresorerie", color: "#22d3ee" },
  { classe: 6, label: "Comptes de charges des activites ordinaires", color: "#ef4444" },
  { classe: 7, label: "Comptes de produits des activites ordinaires", color: "#10b981" },
  { classe: 8, label: "Comptes des autres charges et produits", color: "#f97316" },
];

function statusBadge(status: string) {
  if (status === "pret") return <Badge variant="success">Pret</Badge>;
  if (status === "en_dev") return <Badge variant="warning">En dev</Badge>;
  return <Badge variant="secondary">Planifie</Badge>;
}

export default function ComptabilitePage() {
  return (
    <>
      {/* Header */}
      <div className="space-y-1">
        <h1 className="font-mono text-2xl font-bold tracking-tight">Comptabilite OHADA</h1>
        <p className="text-sm text-muted">
          Module de comptabilite conforme au referentiel SYSCOHADA revise. Plan comptable OHADA, etats financiers, et integration DGI.
        </p>
      </div>

      {/* KPI strip */}
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
        {[
          { label: "Modules", value: OHADA_MODULES.length },
          { label: "Prets", value: OHADA_MODULES.filter((m) => m.status === "pret").length },
          { label: "Classes comptables", value: PLAN_COMPTABLE.length },
          { label: "Referentiel", value: "SYSCOHADA" },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-lg border border-border bg-[#081220] p-3">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">{kpi.label}</div>
            <div className="mt-1 font-mono text-2xl font-bold text-foreground">{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Modules */}
      <Card>
        <CardHeader>
          <CardTitle>Modules Comptables</CardTitle>
          <CardDescription>
            Etats financiers SYSCOHADA : journal, grand livre, balance, bilan, compte de resultat, TAFIRE, notes annexes, et integration fiscale DGI.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {OHADA_MODULES.map((mod) => (
              <div key={mod.code} className="rounded-xl border border-border bg-[#081220] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-accent">{mod.code}</span>
                  {statusBadge(mod.status)}
                </div>
                <div className="font-semibold">{mod.title}</div>
                <p className="text-xs leading-relaxed text-muted">{mod.description}</p>
                <div className="flex flex-wrap gap-1">
                  {mod.features.map((f) => (
                    <span key={f} className="rounded-full bg-[#1a2d45] px-2 py-0.5 text-[10px] font-medium">{f}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Plan comptable OHADA */}
      <Card>
        <CardHeader>
          <CardTitle>Plan Comptable OHADA</CardTitle>
          <CardDescription>
            8 classes comptables du referentiel SYSCOHADA revise. Classification conforme a l&apos;Acte Uniforme relatif au droit comptable.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-[#0a1628]">
                  <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Classe</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Intitule</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Categorie</th>
                </tr>
              </thead>
              <tbody>
                {PLAN_COMPTABLE.map((pc) => (
                  <tr key={pc.classe} className="border-b border-border/50 transition hover:bg-[#122033]">
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full font-mono text-sm font-bold" style={{ background: `${pc.color}22`, color: pc.color }}>
                        {pc.classe}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">{pc.label}</td>
                    <td className="px-4 py-3">
                      <Badge variant={pc.classe <= 5 ? "secondary" : "warning"}>
                        {pc.classe <= 5 ? "Bilan" : "Gestion"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Conformite */}
      <Card>
        <CardHeader>
          <CardTitle>Conformite et Reglementation</CardTitle>
          <CardDescription>
            Cadre juridique et references normatives du module comptable.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {[
            { title: "OHADA", desc: "Organisation pour l'Harmonisation en Afrique du Droit des Affaires. 17 etats membres partageant un droit comptable uniforme." },
            { title: "SYSCOHADA Revise", desc: "Systeme Comptable OHADA revise entre en vigueur le 1er janvier 2018. Alignement partiel sur les normes IFRS." },
            { title: "Acte Uniforme", desc: "Acte Uniforme relatif au droit comptable et a l'information financiere. Base legale du plan comptable OHADA." },
            { title: "DSF / DGI", desc: "Declaration Statistique et Fiscale transmise a la Direction Generale des Impots. Obligation annuelle pour toutes les entreprises." },
          ].map((item) => (
            <div key={item.title} className="rounded-lg bg-[#081220] p-4 space-y-2">
              <div className="font-semibold">{item.title}</div>
              <p className="text-xs leading-relaxed text-muted">{item.desc}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}
