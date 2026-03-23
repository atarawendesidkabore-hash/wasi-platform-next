const PUBLIC_ENV_KEYS = [
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_STRIPE_KEY"
] as const;

export type PublicEnvKey = (typeof PUBLIC_ENV_KEYS)[number];

function readEnv(key: string) {
  const value = process.env[key];
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}

export function getEnv(key: string) {
  return readEnv(key);
}

export function requireEnv(key: string) {
  const value = readEnv(key);
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export function hasEnv(key: string) {
  return Boolean(readEnv(key));
}

export function getPublicEnv() {
  return Object.fromEntries(PUBLIC_ENV_KEYS.map((key) => [key, readEnv(key) ?? ""])) as Record<PublicEnvKey, string>;
}

export function getAppUrl() {
  return readEnv("NEXT_PUBLIC_APP_URL") ?? "http://localhost:3000";
}

export function assertSupabaseEnv() {
  return {
    url: requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    anonKey: requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
  };
}

export function assertSupabaseServiceEnv() {
  return {
    url: requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    serviceRoleKey: requireEnv("SUPABASE_SERVICE_ROLE_KEY")
  };
}

export function assertAnthropicEnv() {
  return {
    apiKey: requireEnv("ANTHROPIC_API_KEY")
  };
}

export function assertStripeEnv() {
  return {
    secretKey: requireEnv("STRIPE_SECRET_KEY")
  };
}

export function assertPaydunyaEnv() {
  return {
    masterKey: requireEnv("PAYDUNYA_MASTER_KEY"),
    privateKey: requireEnv("PAYDUNYA_PRIVATE_KEY"),
    token: requireEnv("PAYDUNYA_TOKEN"),
    mode: requireEnv("PAYDUNYA_MODE")
  };
}

export function assertUpstashEnv() {
  return {
    url: requireEnv("UPSTASH_REDIS_REST_URL"),
    token: requireEnv("UPSTASH_REDIS_REST_TOKEN")
  };
}
