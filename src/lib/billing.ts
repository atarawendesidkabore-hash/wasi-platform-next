export const BILLING_PLANS = [
  {
    id: "free",
    label: "Free",
    description: "Decouverte, onboarding et 3 requetes WASI par mois.",
    priceEuro: 0,
    priceXof: 0,
    quotaMonthly: 3,
    features: ["3 requetes/mois", "Acces dashboard", "Banking et KYC de base"]
  },
  {
    id: "analyst",
    label: "Analyst",
    description: "Pour analystes individuels et cabinets en veille CEDEAO.",
    priceEuro: 99,
    priceXof: 64936,
    quotaMonthly: 200,
    features: ["200 requetes/mois", "Export rapports", "WASI Intelligence avancee"]
  },
  {
    id: "pro",
    label: "Pro",
    description: "Pour banques, fonds et PME a forte intensite analytique.",
    priceEuro: 299,
    priceXof: 196130,
    quotaMonthly: 500,
    features: ["500 requetes/mois", "Connecteurs banking", "DEX et API prioritaires"]
  },
  {
    id: "enterprise",
    label: "Enterprise",
    description: "White-label, quotas illimites et integrateur dedie.",
    priceEuro: null,
    priceXof: null,
    quotaMonthly: null,
    features: ["Quotas illimites", "White-label", "SLA et due diligence"]
  }
] as const;

export type BillingPlanId = (typeof BILLING_PLANS)[number]["id"];

export function getBillingPlan(planId: string | null | undefined) {
  return BILLING_PLANS.find((plan) => plan.id === planId) ?? BILLING_PLANS[0];
}
