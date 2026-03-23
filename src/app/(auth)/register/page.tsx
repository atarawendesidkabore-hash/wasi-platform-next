"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
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
        <CardDescription>Organisation, abonnement free et comptes de base sont provisionnes automatiquement apres connexion.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form className="space-y-4" onSubmit={onSubmit}>
          <Input value={organizationName} onChange={(event) => setOrganizationName(event.target.value)} placeholder="Nom de l'organisation" />
          <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="email@entreprise.com" />
          <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Mot de passe" />
          <Button className="w-full" disabled={loading} type="submit">
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
