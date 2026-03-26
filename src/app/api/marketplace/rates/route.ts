import { NextRequest, NextResponse } from "next/server";
import { withX402 } from "x402-next";
import { fetchLiveRates } from "@/lib/wasi-indices";
import { MARKETPLACE_ROUTES } from "@/lib/x402";

async function handler(_request: NextRequest): Promise<NextResponse<unknown>> {
  try {
    const result = await fetchLiveRates();
    return NextResponse.json({
      ...result,
      meta: {
        protocol: "x402",
        network: "base",
        provider: "WASI Platform",
        coverage: "XOF · EUR · USD · GHS · NGN · XAF",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load FX rates" },
      { status: 502 }
    );
  }
}

export async function GET(request: NextRequest) {
  const wallet = process.env.X402_WALLET_ADDRESS;
  if (!wallet) {
    return NextResponse.json({ error: "X402_WALLET_ADDRESS not configured" }, { status: 503 });
  }
  return withX402(handler, wallet as `0x${string}`, MARKETPLACE_ROUTES["/api/marketplace/rates"])(request);
}
