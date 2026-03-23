import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createAnthropicClient } from "@/lib/anthropic";
import { hasEnv } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { ensureUserWorkspace, getCurrentUser, loadWasiIndices } from "@/lib/platform-data";

const bodySchema = z.object({
  query: z.string().min(3),
  orgId: z.string().uuid().optional().nullable()
});

function getRatelimit() {
  if (!hasEnv("UPSTASH_REDIS_REST_URL") || !hasEnv("UPSTASH_REDIS_REST_TOKEN")) {
    return null;
  }

  return new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(10, "1 m")
  });
}

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().formErrors.join(", ") || "Payload invalide" }, { status: 400 });
  }

  if (!hasEnv("ANTHROPIC_API_KEY")) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY manquant" }, { status: 503 });
  }

  const user = await getCurrentUser();
  const workspace = await ensureUserWorkspace(user);
  const resolvedOrgId = parsed.data.orgId ?? workspace.organizationId;
  const ratelimit = getRatelimit();

  let remaining: number | null = null;
  if (ratelimit && resolvedOrgId) {
    const rateResult = await ratelimit.limit(resolvedOrgId);
    if (!rateResult.success) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }
    remaining = rateResult.remaining;
  }

  let quotaRemaining: number | null = null;
  let quotaUsed = 0;
  let organization:
    | {
        quota_monthly: number | null;
        quota_used: number | null;
        plan: string | null;
      }
    | null = null;

  if (resolvedOrgId && hasEnv("SUPABASE_SERVICE_ROLE_KEY")) {
    const supabase = createSupabaseAdminClient();
    const { data } = await supabase.from("organizations").select("plan, quota_monthly, quota_used").eq("id", resolvedOrgId).maybeSingle();
    organization = data;
    quotaUsed = Number(data?.quota_used ?? 0);
    quotaRemaining = data ? Number(data.quota_monthly ?? 0) - quotaUsed : null;

    if (data && data.plan !== "enterprise" && quotaRemaining !== null && quotaRemaining <= 0) {
      return NextResponse.json({ error: "Monthly quota exceeded" }, { status: 402 });
    }
  }

  const snapshot = await loadWasiIndices();
  const indicesText = snapshot.rows.map((item) => `${item.country_code}:${item.composite}${item.is_coup ? " COUP" : ""}`).join(", ");
  const client = createAnthropicClient();
  const startedAt = Date.now();

  const anthropicResponse = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 900,
    system:
      "Tu es WASI Intelligence, analyste Afrique de l'Ouest pour institutions bancaires et fonds. Reponds en francais professionnel, cite les risques, corridors et implications d'investissement quand ils existent. " +
      `INDICES WASI: ${indicesText}. COMPOSITE REGIONAL: ${snapshot.composite}/100.`,
    messages: [
      {
        role: "user",
        content: parsed.data.query
      }
    ]
  });

  const textBlock = anthropicResponse.content.find((block) => block.type === "text");
  const responseText = textBlock?.type === "text" ? textBlock.text : "";

  if (resolvedOrgId && hasEnv("SUPABASE_SERVICE_ROLE_KEY")) {
    const supabase = createSupabaseAdminClient();
    await supabase.from("intelligence_queries").insert({
      org_id: resolvedOrgId,
      query: parsed.data.query,
      response: responseText,
      countries: snapshot.rows.map((row) => row.country_code),
      composite: Math.round(snapshot.composite),
      tokens_used: anthropicResponse.usage.input_tokens + anthropicResponse.usage.output_tokens,
      latency_ms: Date.now() - startedAt
    });

    if (organization && organization.plan !== "enterprise") {
      await supabase
        .from("organizations")
        .update({
          quota_used: quotaUsed + 1
        })
        .eq("id", resolvedOrgId);
      quotaRemaining = Number(organization.quota_monthly ?? 0) - quotaUsed - 1;
    }
  }

  return NextResponse.json({
    response: {
      type: "text",
      text: responseText
    },
    remaining,
    quotaRemaining
  });
}
