import { NextRequest, NextResponse } from "next/server";
import { withX402 } from "x402-next";
import { loadWasiIndices } from "@/lib/platform-data";
import { MARKETPLACE_ROUTES } from "@/lib/x402";

async function handler(_request: NextRequest): Promise<NextResponse<unknown>> {
  try {
    const snapshot = await loadWasiIndices();
    return NextResponse.json({
      composite: snapshot.composite,
      source: snapshot.source,
      countries: snapshot.rows.map((row) => ({
        code: row.country_code,
        composite: row.composite,
        political: row.political,
        shipping: row.shipping,
        is_coup: row.is_coup,
        updated_at: row.updated_at,
      })),
      meta: {
        protocol: "x402",
        network: "base",
        provider: "WASI Platform",
        coverage: "16 West African countries — UEMOA/CEDEAO",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load indices" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const wallet = process.env.X402_WALLET_ADDRESS;
  if (!wallet) {
    return NextResponse.json({ error: "X402_WALLET_ADDRESS not configured" }, { status: 503 });
  }
  return withX402(handler, wallet as `0x${string}`, MARKETPLACE_ROUTES["/api/marketplace/indices"])(request);
}
