import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { hasEnv } from "@/lib/env";

const checks = [
  { label: "Supabase URL", ok: hasEnv("NEXT_PUBLIC_SUPABASE_URL") },
  { label: "Supabase anon", ok: hasEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY") },
  { label: "Supabase service", ok: hasEnv("SUPABASE_SERVICE_ROLE_KEY") },
  { label: "Anthropic", ok: hasEnv("ANTHROPIC_API_KEY") },
  { label: "Stripe", ok: hasEnv("STRIPE_SECRET_KEY") },
  { label: "PayDunya", ok: hasEnv("PAYDUNYA_MASTER_KEY") && hasEnv("PAYDUNYA_PRIVATE_KEY") && hasEnv("PAYDUNYA_TOKEN") },
  { label: "Upstash", ok: hasEnv("UPSTASH_REDIS_REST_URL") && hasEnv("UPSTASH_REDIS_REST_TOKEN") },
  { label: "Twilio", ok: hasEnv("TWILIO_ACCOUNT_SID") && hasEnv("TWILIO_AUTH_TOKEN") && hasEnv("TWILIO_PHONE_NUMBER") }
];

const roadmap = [
  { phase: "P1", title: "APIs live", description: "ExchangeRate, CoinGecko, World Bank, ACLED, AIS." },
  { phase: "P2", title: "OHADA-Compta", description: "Plan comptable SYSCOHADA, journal, bilan, CPC, fiscalite." },
  { phase: "P3", title: "Commercialisation", description: "Demo kit, prospection Ecobank, Coris, Capgemini, ESG." },
  { phase: "P4", title: "Migration production", description: "Next.js, Supabase, paiements, cron, monitoring." }
];

export default function AdminPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Etat de configuration</CardTitle>
          <CardDescription>Lecture reelle des variables d'environnement cote serveur.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {checks.map((check) => (
            <div className="flex items-center justify-between rounded-lg border border-border bg-[#081220] px-4 py-3" key={check.label}>
              <span className="text-sm text-foreground">{check.label}</span>
              <Badge variant={check.ok ? "success" : "warning"}>{check.ok ? "Configure" : "Manquant"}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Roadmap P1 a P4</CardTitle>
          <CardDescription>Synchronisee avec le document de cadrage fourni pour la migration.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {roadmap.map((item) => (
            <div className="rounded-lg border border-border bg-[#081220] p-4" key={item.phase}>
              <div className="flex items-center gap-3">
                <Badge variant="default">{item.phase}</Badge>
                <div className="text-base font-semibold text-foreground">{item.title}</div>
              </div>
              <div className="mt-2 text-sm text-muted">{item.description}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
