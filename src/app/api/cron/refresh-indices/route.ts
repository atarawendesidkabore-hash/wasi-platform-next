import { NextResponse } from "next/server";
import { hasEnv } from "@/lib/env";
import { refreshAndPersistWasiIndices } from "@/lib/wasi-indices";

export async function GET() {
  if (!hasEnv("SUPABASE_SERVICE_ROLE_KEY")) {
    return NextResponse.json({ error: "Supabase service role manquant" }, { status: 503 });
  }

  try {
    return NextResponse.json(await refreshAndPersistWasiIndices());
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to refresh indices" }, { status: 500 });
  }
}
