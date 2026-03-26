"use client";
import Link from "next/link";
import { useState } from "react";
import { BILLING_PLANS } from "@/lib/billing";

const T = {
  fr: {
    badge: "WASI Platform",
    h1: "Intelligence financière, banking UEMOA et marchés africains — en une seule plateforme.",
    sub: "Terminal Bloomberg-grade pour 16 pays d'Afrique de l'Ouest. Données de marché en temps réel, banking régional, conformité KYC/BCEAO et analyse géopolitique.",
    cta_enter: "Entrer dans la plateforme",
    cta_login: "Se connecter",
    cta_dex: "DEX / Marchés",
    cta_demo: "Demander une démo",
    modules_title: "Modules actifs",
    modules: [
      "WASI Intelligence — indices de stabilité, 54 pays",
      "Banking UEMOA — comptes, transferts, score crédit",
      "KYC BCEAO — soumission et suivi de dossier",
      "DEX — 29 bourses africaines + ETF + Crypto",
    ],
    on_quote: "Sur devis",
    demo_title: "Demander une démo entreprise",
    demo_sub: "Banques, fonds et PME — notre équipe vous répond sous 24h.",
    demo_name: "Nom complet",
    demo_org: "Organisation / Banque",
    demo_email: "Email professionnel",
    demo_country: "Pays",
    demo_submit: "Envoyer la demande",
    demo_sent: "✓ Demande envoyée. Nous vous contactons sous 24h.",
  },
  en: {
    badge: "WASI Platform",
    h1: "Financial intelligence, UEMOA banking and African markets — one platform.",
    sub: "Bloomberg-grade terminal for 16 West African countries. Real-time market data, regional banking, KYC/BCEAO compliance and geopolitical analysis.",
    cta_enter: "Enter platform",
    cta_login: "Log in",
    cta_dex: "DEX / Markets",
    cta_demo: "Request a demo",
    modules_title: "Active modules",
    modules: [
      "WASI Intelligence — stability indices, 54 countries",
      "UEMOA Banking — accounts, transfers, credit score",
      "KYC BCEAO — file submission and tracking",
      "DEX — 29 African exchanges + ETF + Crypto",
    ],
    on_quote: "On request",
    demo_title: "Request an enterprise demo",
    demo_sub: "Banks, funds and SMEs — our team responds within 24h.",
    demo_name: "Full name",
    demo_org: "Organization / Bank",
    demo_email: "Professional email",
    demo_country: "Country",
    demo_submit: "Send request",
    demo_sent: "✓ Request sent. We'll be in touch within 24h.",
  },
};

const COUNTRIES = [
  "Burkina Faso","Côte d'Ivoire","Sénégal","Mali","Niger","Guinée","Togo","Bénin",
  "Nigeria","Ghana","Cameroun","RDC","Kenya","Maroc","France","Autre / Other",
];

export default function HomePage() {
  const [lang, setLang] = useState<"fr" | "en">("fr");
  const [demoOpen, setDemoOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", org: "", email: "", country: "" });
  const t = T[lang];

  function handleDemo(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`WASI Demo Request — ${form.org}`);
    const body = encodeURIComponent(`Name: ${form.name}\nOrg: ${form.org}\nEmail: ${form.email}\nCountry: ${form.country}`);
    window.location.href = `mailto:tarawendesida.kabore@gmail.com?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <main className="min-h-screen bg-[#030b15] text-foreground">

      {/* Demo modal */}
      {demoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-[#0d1a2d] p-8 shadow-2xl">
            <button onClick={() => { setDemoOpen(false); setSent(false); }} className="absolute right-4 top-4 text-xl text-muted hover:text-foreground">×</button>
            <div className="mb-1 font-mono text-sm font-bold tracking-widest text-accent">WASI</div>
            <div className="mb-1 text-lg font-semibold text-foreground">{t.demo_title}</div>
            <div className="mb-6 text-sm text-muted">{t.demo_sub}</div>
            {sent ? (
              <div className="py-6 text-center text-sm text-[#00e676]">{t.demo_sent}</div>
            ) : (
              <form onSubmit={handleDemo} className="flex flex-col gap-3">
                <input required placeholder={t.demo_name} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full rounded-md border border-border bg-[#0a1628] px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none" />
                <input required placeholder={t.demo_org} value={form.org} onChange={e => setForm(f => ({ ...f, org: e.target.value }))} className="w-full rounded-md border border-border bg-[#0a1628] px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none" />
                <input required type="email" placeholder={t.demo_email} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full rounded-md border border-border bg-[#0a1628] px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none" />
                <select value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} className="w-full rounded-md border border-border bg-[#0a1628] px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none">
                  <option value="">— {t.demo_country} —</option>
                  {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                </select>
                <button type="submit" className="mt-1 rounded-md bg-accent px-5 py-3 font-mono text-sm font-bold tracking-wider text-black transition hover:bg-[#d89d2d]">{t.demo_submit}</button>
              </form>
            )}
          </div>
        </div>
      )}

      <section className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-20">

        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="font-mono text-sm uppercase tracking-[0.28em] text-accent">{t.badge}</div>
          <button onClick={() => setLang(l => l === "fr" ? "en" : "fr")} className="rounded border border-border px-3 py-1 font-mono text-xs text-muted transition hover:border-accent hover:text-accent">
            {lang === "fr" ? "EN" : "FR"}
          </button>
        </div>

        {/* Hero */}
        <div className="grid gap-10 xl:grid-cols-[1.2fr_0.8fr] xl:items-end">
          <div className="space-y-6">
            <h1 className="max-w-4xl text-5xl font-semibold leading-tight text-foreground">
              {t.h1}
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-muted">{t.sub}</p>
            <div className="flex flex-wrap gap-3">
              <Link className="rounded-md bg-accent px-5 py-3 font-medium text-black transition hover:bg-[#d89d2d]" href="/intelligence">
                {t.cta_enter}
              </Link>
              <Link className="rounded-md border border-border px-5 py-3 font-medium text-foreground transition hover:bg-[#122033]" href="/login">
                {t.cta_login}
              </Link>
              <Link className="rounded-md border border-border px-5 py-3 font-medium text-foreground transition hover:bg-[#122033]" href="/dex">
                {t.cta_dex}
              </Link>
              <button onClick={() => setDemoOpen(true)} className="rounded-md border border-accent px-5 py-3 font-medium text-accent transition hover:bg-accent/10">
                {t.cta_demo}
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-[#081220] p-6 shadow-terminal">
            <div className="text-sm uppercase tracking-[0.22em] text-muted">{t.modules_title}</div>
            <div className="mt-6 grid gap-4">
              {t.modules.map((item) => (
                <div className="rounded-xl border border-border bg-[#0c1727] px-4 py-4 text-sm text-foreground" key={item}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing */}
        <section className="grid gap-4 xl:grid-cols-4">
          {BILLING_PLANS.map((plan) => (
            <div className="rounded-2xl border border-border bg-[#081220] p-5" key={plan.id}>
              <div className="text-sm uppercase tracking-[0.18em] text-accent">{plan.label}</div>
              <div className="mt-3 text-3xl font-semibold text-foreground">
                {plan.priceEuro === null ? t.on_quote : `${plan.priceEuro} EUR`}
              </div>
              <div className="mt-2 text-sm leading-7 text-muted">{plan.description}</div>
            </div>
          ))}
        </section>
      </section>
    </main>
  );
}
