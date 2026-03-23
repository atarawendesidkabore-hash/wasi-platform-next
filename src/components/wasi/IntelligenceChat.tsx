"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type IntelligenceChatProps = {
  defaultOrgId?: string | null;
  organizationName?: string | null;
};

type ApiReply = {
  response?: { type: string; text?: string };
  remaining?: number;
  quotaRemaining?: number;
  error?: string;
};

export function IntelligenceChat({ defaultOrgId, organizationName }: IntelligenceChatProps) {
  const [orgId] = useState(defaultOrgId ?? "");
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [meta, setMeta] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMeta("");
    setResponse("");

    if (!orgId.trim()) {
      setError("Aucune organisation active n'est provisionnee pour cette session.");
      return;
    }

    if (!query.trim()) {
      setError("Saisissez une question WASI.");
      return;
    }

    setLoading(true);

    try {
      const result = await fetch("/api/intelligence", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          orgId,
          query
        })
      });

      const payload = (await result.json()) as ApiReply;

      if (!result.ok) {
        setError(payload.error ?? "La requete WASI a echoue.");
        return;
      }

      setResponse(payload.response?.text ?? "Aucune reponse textuelle retournee par Anthropic.");
      if (typeof payload.remaining === "number" || typeof payload.quotaRemaining === "number") {
        setMeta(`Rate limit restant: ${payload.remaining ?? "n/a"} - Quota mensuel restant: ${payload.quotaRemaining ?? "n/a"}`);
      }
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>WASI Intelligence</CardTitle>
        <CardDescription>Route API Anthropic + Supabase + Upstash, sans donnees locales simulees.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border border-border bg-[#081220] p-4 text-sm text-muted">
          Organisation connectee: <span className="font-medium text-foreground">{organizationName ?? "Tenant actif"}</span>
          <div className="mt-1 font-mono text-xs uppercase tracking-[0.18em] text-muted">{orgId || "Aucun org provisionne"}</div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="wasi-query">
              Question
            </label>
            <Textarea
              id="wasi-query"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Analysez le risque trade finance du corridor Abidjan-Bamako..."
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Analyse en cours..." : "Envoyer a Claude"}
          </Button>
        </form>

        {error ? <div className="rounded-lg border border-danger/40 bg-[#31161b] p-4 text-sm text-danger">{error}</div> : null}
        {meta ? <div className="text-xs uppercase tracking-[0.18em] text-muted">{meta}</div> : null}
        {response ? (
          <div className="rounded-lg border border-border bg-[#081220] p-4">
            <div className="mb-2 text-xs uppercase tracking-[0.18em] text-muted">Reponse</div>
            <div className="whitespace-pre-wrap text-sm leading-7 text-foreground">{response}</div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
