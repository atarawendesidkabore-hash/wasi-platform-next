import { BillingCheckoutPanel } from "@/components/billing/BillingCheckoutPanel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getBillingPlan } from "@/lib/billing";
import { hasEnv } from "@/lib/env";
import {
  ensureUserWorkspace,
  getCurrentUser,
  loadOrganizationApiKeys,
  loadOrganizationRecord,
  loadOrganizationSubscriptions
} from "@/lib/platform-data";
import { formatCurrency } from "@/lib/utils";

export default async function BillingPage() {
  const user = await getCurrentUser();
  const workspace = await ensureUserWorkspace(user);
  const organization = await loadOrganizationRecord(user?.id);
  const subscriptions = await loadOrganizationSubscriptions(workspace.organizationId);
  const apiKeys = await loadOrganizationApiKeys(workspace.organizationId);
  const plan = getBillingPlan(organization?.plan ?? workspace.plan);
  const hasStripe = hasEnv("STRIPE_SECRET_KEY");
  const hasPaydunya = hasEnv("PAYDUNYA_MASTER_KEY") && hasEnv("PAYDUNYA_PRIVATE_KEY") && hasEnv("PAYDUNYA_TOKEN");

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Abonnement actif</CardTitle>
            <CardDescription>Etat commercial de votre tenant WASI.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge variant="success">{plan.label}</Badge>
              <span className="text-sm text-muted">{organization?.name ?? workspace.organizationName ?? "Organisation WASI"}</span>
            </div>
            <div className="font-mono text-4xl font-bold text-foreground">{plan.priceXof === null ? "Custom" : formatCurrency(plan.priceXof, "XOF")}</div>
            <div className="text-sm text-muted">
              Quota mensuel: {organization?.quota_monthly ?? workspace.quotaMonthly ?? plan.quotaMonthly ?? "illimite"} - utilise: {organization?.quota_used ?? 0}
            </div>
            <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em] text-muted">
              <span>Stripe {hasStripe ? "configure" : "absent"}</span>
              <span>PayDunya {hasPaydunya ? "configure" : "absent"}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API keys et acces</CardTitle>
            <CardDescription>Clés provisionnees automatiquement pour votre tenant.</CardDescription>
          </CardHeader>
          <CardContent>
            {apiKeys.length === 0 ? (
              <EmptyState title="Aucune cle" description="Une cle sera creee automatiquement au provisioning du tenant." />
            ) : (
              <div className="space-y-3">
                {apiKeys.map((apiKey) => (
                  <div className="rounded-lg border border-border bg-[#081220] p-4" key={apiKey.id}>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="font-mono text-sm text-foreground">{apiKey.key_prefix}</div>
                        <div className="text-sm text-muted">{apiKey.name ?? "Primary key"} - {apiKey.tier ?? "basic"}</div>
                      </div>
                      <Badge variant={apiKey.active ? "success" : "warning"}>{apiKey.active ? "Active" : "Inactive"}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <BillingCheckoutPanel currentPlan={organization?.plan ?? workspace.plan} hasPaydunya={hasPaydunya} hasStripe={hasStripe} />

      <Card>
        <CardHeader>
          <CardTitle>Historique des abonnements</CardTitle>
          <CardDescription>Journal des activations et paiements remonte depuis Supabase.</CardDescription>
        </CardHeader>
        <CardContent>
          {subscriptions.length === 0 ? (
            <EmptyState title="Aucun abonnement" description="Activez une offre pour demarrer la monetisation du tenant." />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plan</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Periode</TableHead>
                    <TableHead>Reference</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.map((subscription) => (
                    <TableRow key={subscription.id}>
                      <TableCell>{subscription.plan}</TableCell>
                      <TableCell>{subscription.status ?? "-"}</TableCell>
                      <TableCell>
                        {subscription.amount === null ? "-" : formatCurrency(Number(subscription.amount ?? 0), subscription.currency ?? "XOF")}
                      </TableCell>
                      <TableCell>
                        {subscription.period_start ?? "-"} / {subscription.period_end ?? "-"}
                      </TableCell>
                      <TableCell className="font-mono text-xs">{subscription.stripe_sub_id ?? subscription.paydunya_ref ?? "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
