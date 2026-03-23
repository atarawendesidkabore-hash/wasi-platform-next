import { NextResponse } from "next/server";
import { fetchLiveCrypto } from "@/lib/wasi-indices";

export async function GET() {
  try {
    return NextResponse.json(await fetchLiveCrypto());
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load crypto prices" }, { status: 502 });
  }
}
