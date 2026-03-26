import { NextRequest, NextResponse } from "next/server";
import { withX402 } from "x402-next";
import { AFEX_INSTRUMENTS, getAfexStats } from "@/lib/afex-instruments";
import { MARKETPLACE_ROUTES } from "@/lib/x402";

async function handler(request: NextRequest): Promise<NextResponse<unknown>> {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country")?.toUpperCase();

  const instruments = country
    ? AFEX_INSTRUMENTS.filter((i) => i.country === country)
    : AFEX_INSTRUMENTS;

  const stats = getAfexStats();

  return NextResponse.json({
    stats,
    instruments,
    meta: {
      protocol: "x402",
      network: "base",
      provider: "WASI Platform",
      coverage: "54 African sovereign nations — commodity export indices",
      usage: country ? `Filtered by country: ${country}` : "All countries",
    },
  });
}

export async function GET(request: NextRequest) {
  const wallet = process.env.X402_WALLET_ADDRESS;
  if (!wallet) {
    return NextResponse.json({ error: "X402_WALLET_ADDRESS not configured" }, { status: 503 });
  }
  return withX402(handler, wallet as `0x${string}`, MARKETPLACE_ROUTES["/api/marketplace/afex"])(request);
}
