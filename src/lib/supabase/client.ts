"use client";

import { createBrowserClient } from "@supabase/ssr";
import { assertSupabaseEnv } from "@/lib/env";

let browserClient: any = null;

export function createSupabaseBrowserClient(): any {
  if (browserClient) {
    return browserClient;
  }

  const { url, anonKey } = assertSupabaseEnv();
  browserClient = createBrowserClient(url, anonKey);
  return browserClient;
}
