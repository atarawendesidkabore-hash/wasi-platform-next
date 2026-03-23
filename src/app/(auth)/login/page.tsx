"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    // Demo mode — no Supabase configured
    if (!SUPABASE_URL) {
      window.location.href = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/intelligence`;
      return;
    }

    try {
      const { createSupabaseBrowserClient } = await import("@/lib/supabase/client");
      const supabase = createSupabaseBrowserClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      window.location.href = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/intelligence`;
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  }

  function enterDemo() {
    window.location.href = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/intelligence`;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connexion</CardTitle>
        <CardDescription>
          {SUPABASE_URL
            ? "Supabase Auth, session SSR et routes serverless Next.js."
            : "Mode demo — acces libre a toute la plateforme."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!SUPABASE_URL && (
          <Button className="w-full" onClick={enterDemo}>
            Entrer en mode demo
          </Button>
        )}
        <form className="space-y-4" onSubmit={onSubmit}>
          <Input onChange={(event) => setEmail(event.target.value)} placeholder="email@entreprise.com" type="email" value={email} />
          <Input onChange={(event) => setPassword(event.target.value)} placeholder="Mot de passe" type="password" value={password} />
          <Button className="w-full" disabled={loading} type="submit" variant={SUPABASE_URL ? "default" : "secondary"}>
            {loading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>
        {error ? <div className="rounded-lg border border-danger/40 bg-[#31161b] p-4 text-sm text-danger">{error}</div> : null}
        <p className="text-sm text-muted">
          Pas encore de compte?{" "}
          <Link className="text-accent hover:underline" href="/register">
            Creer un acces
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
