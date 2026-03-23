import { NextResponse } from "next/server";
import { loadWasiIndices } from "@/lib/platform-data";

export async function GET() {
  try {
    const snapshot = await loadWasiIndices();
    return NextResponse.json(snapshot);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load WASI indices" }, { status: 500 });
  }
}
