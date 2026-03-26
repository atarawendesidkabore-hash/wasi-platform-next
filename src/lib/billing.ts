export const BILLING_PLANS = [
  {
    id: "free",
    label: "Free",
    description: "Decouverte, onboarding et 5 requetes WASI par mois.",
    priceEuro: 0,
    priceXof: 0,
    quotaMonthly: 5,
    features: ["5 requetes/mois", "Acces dashboard lecture seule", "Demo Banking et KYC"]
  },
  {
    id: "analyst",
    label: "Analyst",
    description: "Pour analystes individuels et cabinets en veille CEDEAO.",
    priceEuro: 49,
    priceXof: 32143,
    quotaMonthly: 300,
    features: ["300 requetes/mois", "Intelligence + DEX + Banking", "Export PDF des rapports"]
  },
  {
    id: "pro",
    label: "Pro",
    description: "Pour brokers, PME et petites banques a forte intensite analytique.",
    priceEuro: 199,
    priceXof: 130542,
    quotaMonthly: 2000,
    features: ["2 000 requetes/mois", "Tous les modules + API", "Support prioritaire — 3 seats"]
  },
  {
    id: "enterprise",
    label: "Enterprise",
    description: "Grandes banques, white-label, quotas illimites et SLA dedie.",
    priceEuro: 899,
    priceXof: 589900,
    quotaMonthly: null,
    features: ["Quotas illimites — 10+ seats", "White-label et integration API", "SLA 99.9% et due diligence"]
  }
] as const;

export type BillingPlanId = (typeof BILLING_PLANS)[number]["id"];

export function getBillingPlan(planId: string | null | undefined) {
  return BILLING_PLANS.find((plan) => plan.id === planId) ?? BILLING_PLANS[0];
}
