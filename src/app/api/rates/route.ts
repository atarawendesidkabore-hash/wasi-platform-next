import { NextResponse } from "next/server";
import { fetchLiveRates } from "@/lib/wasi-indices";

export async function GET() {
  try {
    return NextResponse.json(await fetchLiveRates());
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load FX rates" }, { status: 502 });
  }
}
