"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      window.location.href = "/intelligence";
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connexion</CardTitle>
        <CardDescription>Supabase Auth, session SSR et routes serverless Next.js.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form className="space-y-4" onSubmit={onSubmit}>
          <Input onChange={(event) => setEmail(event.target.value)} placeholder="email@entreprise.com" type="email" value={email} />
          <Input onChange={(event) => setPassword(event.target.value)} placeholder="Mot de passe" type="password" value={password} />
          <Button className="w-full" disabled={loading} type="submit">
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
