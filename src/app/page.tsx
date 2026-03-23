import Link from "next/link";
import { BILLING_PLANS } from "@/lib/billing";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#030b15] text-foreground">
      <section className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-20">
        <div className="grid gap-10 xl:grid-cols-[1.2fr_0.8fr] xl:items-end">
          <div className="space-y-6">
            <div className="font-mono text-sm uppercase tracking-[0.28em] text-accent">WASI Platform</div>
            <h1 className="max-w-4xl text-5xl font-semibold leading-tight text-foreground">
              Intelligence financiere, banking UEMOA et execution SaaS pour l'Afrique de l'Ouest.
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-muted">
              Produit full-stack Next.js 14, Supabase, Stripe et PayDunya pour operer WASI Intelligence, le banking regional et les workflows
              KYC/BCEAO depuis une seule plateforme.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link className="rounded-md bg-accent px-5 py-3 font-medium text-accentForeground transition hover:bg-[#d89d2d]" href="/intelligence">
                Entrer dans la plateforme
              </Link>
              <Link className="rounded-md border border-border px-5 py-3 font-medium text-foreground transition hover:bg-[#122033]" href="/login">
                Se connecter
              </Link>
              <Link className="rounded-md border border-border px-5 py-3 font-medium text-foreground transition hover:bg-[#122033]" href="/dex">
                DEX / AFEX
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-[#081220] p-6 shadow-terminal">
            <div className="text-sm uppercase tracking-[0.22em] text-muted">Modules actifs</div>
            <div className="mt-6 grid gap-4">
              {[
                "WASI Intelligence avec quotas et journalisation",
                "Banking UEMOA avec comptes, transferts et score credit",
                "KYC BCEAO avec soumission de dossier",
                "Billing Stripe + PayDunya + webhooks"
              ].map((item) => (
                <div className="rounded-xl border border-border bg-[#0c1727] px-4 py-4 text-sm text-foreground" key={item}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className="grid gap-4 xl:grid-cols-4">
          {BILLING_PLANS.map((plan) => (
            <div className="rounded-2xl border border-border bg-[#081220] p-5" key={plan.id}>
              <div className="text-sm uppercase tracking-[0.18em] text-accent">{plan.label}</div>
              <div className="mt-3 text-3xl font-semibold text-foreground">{plan.priceEuro === null ? "Sur devis" : `${plan.priceEuro} EUR`}</div>
              <div className="mt-2 text-sm leading-7 text-muted">{plan.description}</div>
            </div>
          ))}
        </section>
      </section>
    </main>
  );
}
