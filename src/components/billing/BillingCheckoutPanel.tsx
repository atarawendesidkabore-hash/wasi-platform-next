"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BILLING_PLANS, type BillingPlanId } from "@/lib/billing";
import { formatCurrency } from "@/lib/utils";

type BillingCheckoutPanelProps = {
  currentPlan: string | null | undefined;
  hasStripe: boolean;
  hasPaydunya: boolean;
};

type BillingResponse = {
  checkoutUrl?: string;
  message?: string;
  error?: string;
};

export function BillingCheckoutPanel({ currentPlan, hasStripe, hasPaydunya }: BillingCheckoutPanelProps) {
  const router = useRouter();
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function startCheckout(plan: BillingPlanId, provider: "stripe" | "paydunya") {
    setLoadingKey(`${plan}:${provider}`);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          plan,
          provider
        })
      });

      const payload = (await response.json()) as BillingResponse;
      if (!response.ok) {
        setError(payload.error ?? "Le checkout a echoue.");
        return;
      }

      if (payload.checkoutUrl) {
        window.location.href = payload.checkoutUrl;
        return;
      }

      setMessage(payload.message ?? "Plan mis a jour.");
      router.refresh();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Erreur inconnue");
    } finally {
      setLoadingKey(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-4">
        {BILLING_PLANS.map((plan) => {
          const isCurrent = currentPlan === plan.id;
          return (
            <Card className={isCurrent ? "border-accent" : undefined} key={plan.id}>
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle>{plan.label}</CardTitle>
                  {isCurrent ? <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accentForeground">Actuel</span> : null}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="font-mono text-3xl font-bold text-foreground">
                    {plan.priceEuro === null ? "Sur devis" : `${plan.priceEuro} EUR`}
                  </div>
                  <div className="text-sm text-muted">
                    {plan.priceXof === null ? "Contrat enterprise" : `${formatCurrency(plan.priceXof, "XOF")} / mois`}
                  </div>
                </div>
                <div className="space-y-2 text-sm text-muted">
                  {plan.features.map((feature) => (
                    <div key={feature}>- {feature}</div>
                  ))}
                </div>
                <div className="space-y-2">
                  <Button
                    className="w-full"
                    disabled={isCurrent || !hasStripe || plan.id === "enterprise" || loadingKey !== null}
                    onClick={() => startCheckout(plan.id, "stripe")}
                    type="button"
                  >
                    {loadingKey === `${plan.id}:stripe` ? "Redirection..." : "Payer avec Stripe"}
                  </Button>
                  <Button
                    className="w-full"
                    disabled={isCurrent || !hasPaydunya || plan.id === "enterprise" || loadingKey !== null}
                    onClick={() => startCheckout(plan.id, "paydunya")}
                    type="button"
                    variant="secondary"
                  >
                    {loadingKey === `${plan.id}:paydunya` ? "Redirection..." : "Payer avec PayDunya"}
                  </Button>
                  {plan.id === "enterprise" ? (
                    <Button
                      className="w-full"
                      disabled={loadingKey !== null}
                      onClick={() => startCheckout(plan.id, "stripe")}
                      type="button"
                      variant="ghost"
                    >
                      Demander un devis
                    </Button>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {message ? <div className="rounded-lg border border-success/40 bg-[#10301f] p-4 text-sm text-success">{message}</div> : null}
      {error ? <div className="rounded-lg border border-danger/40 bg-[#31161b] p-4 text-sm text-danger">{error}</div> : null}
    </div>
  );
}
