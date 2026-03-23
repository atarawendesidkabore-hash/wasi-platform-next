"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function enterDemo() {
    window.location.href = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/intelligence`;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    if (!SUPABASE_URL) {
      window.location.href = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/intelligence`;
      return;
    }

    try {
      const { createSupabaseBrowserClient } = await import("@/lib/supabase/client");
      const supabase = createSupabaseBrowserClient();
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            organization_name: organizationName
          }
        }
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      setOrganizationName("");
      setEmail("");
      setPassword("");
      setMessage("Compte cree. Verifiez votre email puis connectez-vous: le tenant WASI sera provisionne automatiquement au premier acces.");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Erreur d'inscription");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Creation de compte</CardTitle>
        <CardDescription>
          {SUPABASE_URL
            ? "Organisation, abonnement free et comptes de base sont provisionnes automatiquement apres connexion."
            : "Mode demo — acces libre a toute la plateforme sans inscription."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!SUPABASE_URL && (
          <Button className="w-full" onClick={enterDemo}>
            Entrer en mode demo
          </Button>
        )}
        <form className="space-y-4" onSubmit={onSubmit}>
          <Input value={organizationName} onChange={(event) => setOrganizationName(event.target.value)} placeholder="Nom de l'organisation" />
          <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="email@entreprise.com" />
          <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Mot de passe" />
          <Button className="w-full" disabled={loading} type="submit" variant={SUPABASE_URL ? "default" : "secondary"}>
            {loading ? "Creation..." : "Creer mon acces"}
          </Button>
        </form>
        {message ? <div className="rounded-lg border border-success/40 bg-[#10301f] p-4 text-sm text-success">{message}</div> : null}
        {error ? <div className="rounded-lg border border-danger/40 bg-[#31161b] p-4 text-sm text-danger">{error}</div> : null}
        <p className="text-sm text-muted">
          Deja inscrit?{" "}
          <Link className="text-accent hover:underline" href="/login">
            Se connecter
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
