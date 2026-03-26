import { NextRequest, NextResponse } from "next/server";
import { withX402 } from "x402-next";
import { z } from "zod";
import { createAnthropicClient } from "@/lib/anthropic";
import { hasEnv } from "@/lib/env";
import { loadWasiIndices } from "@/lib/platform-data";
import { MARKETPLACE_ROUTES } from "@/lib/x402";

const bodySchema = z.object({
  query: z.string().min(3).max(500),
});

async function handler(request: NextRequest): Promise<NextResponse<unknown>> {
  if (!hasEnv("ANTHROPIC_API_KEY")) {
    return NextResponse.json({ error: "Intelligence service unavailable" }, { status: 503 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Provide { query: string } in request body" }, { status: 400 });
  }

  try {
    const snapshot = await loadWasiIndices();
    const indicesText = snapshot.rows
      .map((r) => `${r.country_code}:${r.composite}${r.is_coup ? " COUP" : ""}`)
      .join(", ");

    const client = createAnthropicClient();
    const startedAt = Date.now();

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 700,
      system:
        "You are WASI Intelligence, a West African financial analyst for banks and investment funds. " +
        "Answer in professional English, cite risks, trade corridors and investment implications. " +
        `WASI INDICES: ${indicesText}. REGIONAL COMPOSITE: ${snapshot.composite}/100.`,
      messages: [{ role: "user", content: parsed.data.query }],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    const text = textBlock?.type === "text" ? textBlock.text : "";

    return NextResponse.json({
      response: text,
      composite: snapshot.composite,
      tokens_used: response.usage.input_tokens + response.usage.output_tokens,
      latency_ms: Date.now() - startedAt,
      meta: {
        protocol: "x402",
        network: "base",
        provider: "WASI Platform",
        model: "claude-sonnet-4-20250514",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Intelligence query failed" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const wallet = process.env.X402_WALLET_ADDRESS;
  if (!wallet) {
    return NextResponse.json({ error: "X402_WALLET_ADDRESS not configured" }, { status: 503 });
  }
  return withX402(handler, wallet as `0x${string}`, MARKETPLACE_ROUTES["/api/marketplace/intelligence"])(request);
}
