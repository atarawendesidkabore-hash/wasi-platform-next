import { createClient } from "@supabase/supabase-js";
import { assertSupabaseServiceEnv } from "@/lib/env";

let adminClient: any = null;

export function createSupabaseAdminClient(): any {
  if (adminClient) {
    return adminClient;
  }

  const { url, serviceRoleKey } = assertSupabaseServiceEnv();
  adminClient = createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
  return adminClient;
}
