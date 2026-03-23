export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-12">
      <div className="grid w-full gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-border bg-[#091321]/90 p-8 shadow-terminal">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-accent">WASI Platform v3.0</div>
          <h1 className="mt-4 text-4xl font-bold text-foreground">Stack production Afrique de l&apos;Ouest</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-muted">
            Authentification Supabase, paiements Stripe et PayDunya, analytics WASI, banking UEMOA et serverless Next.js.
          </p>
        </section>
        <section>{children}</section>
      </div>
    </main>
  );
}
