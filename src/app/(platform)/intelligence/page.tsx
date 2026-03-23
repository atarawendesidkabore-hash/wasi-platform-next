import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CompositeGauge } from "@/components/wasi/CompositeGauge";
import { CountryPill } from "@/components/wasi/CountryPill";
import { IntelligenceChat } from "@/components/wasi/IntelligenceChat";
import { ensureUserWorkspace, getCurrentUser, loadWasiIndices } from "@/lib/platform-data";

export default async function IntelligencePage() {
  const user = await getCurrentUser();
  const workspace = await ensureUserWorkspace(user);
  const snapshot = await loadWasiIndices();

  return (
    <>
      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <CompositeGauge composite={snapshot.composite} source={snapshot.source} updatedAt={snapshot.rows[0]?.updated_at ?? null} />
        <Card>
          <CardHeader>
            <CardTitle>Contexte tenant</CardTitle>
            <CardDescription>Rattachement de l'assistant a Supabase pour quotas, logs et historique.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted">
            <div>Utilisateur: {user?.email ?? "non connecte"}</div>
            <div>Organisation: {workspace.organizationName ?? "non disponible"}</div>
            <div>Plan: {workspace.plan ?? "free"}.</div>
            <div>Roadmap active: live data, onboarding tenant, billing, KYC et migration production.</div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {snapshot.rows.map((row) => (
          <CountryPill
            code={row.country_code}
            composite={row.composite}
            isCoup={row.is_coup}
            political={row.political}
            shipping={row.shipping}
            key={row.country_code}
          />
        ))}
      </section>

      <IntelligenceChat defaultOrgId={workspace.organizationId} organizationName={workspace.organizationName} />
    </>
  );
}
