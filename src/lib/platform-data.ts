import { createHash, randomBytes } from "crypto";
import { hasEnv } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { computeRegionalComposite, fetchWorldBankIndices } from "@/lib/wasi-indices";

type IndexRow = {
  country_code: string;
  composite: number;
  political: number | null;
  shipping: number | null;
  is_coup: boolean;
  updated_at: string;
  source: string | null;
};

export type BankAccountRecord = {
  id: string;
  account_number: string | null;
  type: string | null;
  balance: number | string | null;
  currency: string | null;
  country: string | null;
  status: string | null;
  created_at: string;
};

export type TransactionRecord = {
  id: string;
  type: string | null;
  amount: number | string | null;
  fee: number | string | null;
  currency: string | null;
  reference: string | null;
  status: string | null;
  created_at: string;
  from_account: string | null;
  to_account: string | null;
};

export type DexOrderRecord = {
  id: string;
  ticker: string;
  side: string | null;
  order_type: string | null;
  quantity: number | string | null;
  price: number | string | null;
  status: string | null;
  filled_qty: number | string | null;
  commission: number | string | null;
  created_at: string;
};

export type KycApplicationRecord = {
  id: string;
  tier_requested: number | null;
  tier_granted: number | null;
  status: string;
  aml_cleared: boolean;
  ppe_declared: boolean;
  submitted_at: string;
  reviewed_at: string | null;
  documents?: Record<string, unknown> | null;
};

export type WasiIndexSnapshot = {
  rows: IndexRow[];
  composite: number;
  source: string;
};

export type OrganizationRecord = {
  id: string;
  name: string;
  plan: string | null;
  quota_monthly: number | null;
  quota_used: number | null;
  country: string | null;
  stripe_customer_id?: string | null;
  paydunya_customer_id?: string | null;
  created_at: string;
};

export type SubscriptionRecord = {
  id: string;
  plan: string;
  status: string | null;
  amount: number | string | null;
  currency: string | null;
  stripe_sub_id: string | null;
  paydunya_ref: string | null;
  period_start: string | null;
  period_end: string | null;
  created_at: string;
};

export type ApiKeyRecord = {
  id: string;
  key_prefix: string;
  name: string | null;
  tier: string | null;
  active: boolean | null;
  created_at: string;
  last_used: string | null;
};

export type WorkspaceBootstrapResult = {
  organizationId: string | null;
  organizationName: string | null;
  created: boolean;
  plan: string | null;
  quotaMonthly: number | null;
};

type AppUser = {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown> | null;
};

function getUserMetadataValue(user: AppUser | null | undefined, key: string) {
  const value = user?.user_metadata?.[key];
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function inferOrganizationName(user: AppUser) {
  const fromMetadata = getUserMetadataValue(user, "organization_name");
  if (fromMetadata) {
    return fromMetadata;
  }

  if (user.email) {
    const emailPrefix = user.email.split("@")[0]?.replace(/[._-]+/g, " ").trim();
    if (emailPrefix) {
      return emailPrefix
        .split(" ")
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
    }
  }

  return "WASI Organisation";
}

function inferCountryCode(user: AppUser) {
  const fromMetadata = getUserMetadataValue(user, "country");
  return (fromMetadata ?? "BF").slice(0, 2).toUpperCase();
}

function buildAccountNumber(userId: string, type: "courant" | "epargne", countryCode: string, slot: number) {
  const compact = userId.replace(/-/g, "").slice(0, 10).toUpperCase();
  const typeCode = type === "courant" ? "CUR" : "SAV";
  return `WASI-${countryCode}-${typeCode}-${slot}${compact}`;
}

function buildApiKeyPrefix() {
  return `WASI-${randomBytes(3).toString("hex").toUpperCase()}`;
}

function hashApiKey(rawKey: string) {
  return createHash("sha256").update(rawKey).digest("hex");
}

function addDays(date: Date, days: number) {
  const value = new Date(date);
  value.setDate(value.getDate() + days);
  return value.toISOString().slice(0, 10);
}

function getServerClientIfAvailable() {
  if (!hasEnv("NEXT_PUBLIC_SUPABASE_URL") || !hasEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY")) {
    return null;
  }

  try {
    return createSupabaseServerClient();
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const supabase = getServerClientIfAvailable();
  if (!supabase) {
    return null;
  }

  try {
    const {
      data: { user }
    } = await supabase.auth.getUser();
    return user as AppUser | null;
  } catch {
    return null;
  }
}

export async function ensureUserWorkspace(user?: AppUser | null): Promise<WorkspaceBootstrapResult> {
  if (!user?.id || !hasEnv("SUPABASE_SERVICE_ROLE_KEY")) {
    return {
      organizationId: null,
      organizationName: null,
      created: false,
      plan: null,
      quotaMonthly: null
    };
  }

  const supabase = createSupabaseAdminClient();
  let created = false;

  const { data: existingOrganization } = await supabase
    .from("organizations")
    .select("id, name, plan, quota_monthly, quota_used, country, stripe_customer_id, paydunya_customer_id, created_at")
    .eq("owner_user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  let organization = existingOrganization as OrganizationRecord | null;
  if (!organization) {
    const now = new Date();
    const organizationName = inferOrganizationName(user);
    const countryCode = inferCountryCode(user);
    const { data: insertedOrganization } = await supabase
      .from("organizations")
      .insert({
        owner_user_id: user.id,
        name: organizationName,
        plan: "free",
        quota_monthly: 3,
        quota_used: 0,
        quota_reset: addDays(now, 30),
        country: countryCode
      })
      .select("id, name, plan, quota_monthly, quota_used, country, stripe_customer_id, paydunya_customer_id, created_at")
      .single();

    organization = (insertedOrganization as OrganizationRecord | null) ?? null;
    created = Boolean(organization);
  }

  if (!organization) {
    return {
      organizationId: null,
      organizationName: null,
      created: false,
      plan: null,
      quotaMonthly: null
    };
  }

  const { data: existingKeys } = await supabase.from("api_keys").select("id").eq("org_id", organization.id).limit(1);
  if (!existingKeys || existingKeys.length === 0) {
    const prefix = buildApiKeyPrefix();
    const rawKey = `${prefix}-${randomBytes(6).toString("hex").toUpperCase()}`;
    await supabase.from("api_keys").insert({
      org_id: organization.id,
      key_hash: hashApiKey(rawKey),
      key_prefix: prefix,
      name: "Primary key",
      tier: organization.plan ?? "free",
      active: true
    });
  }

  const { data: existingSubscriptions } = await supabase.from("subscriptions").select("id").eq("org_id", organization.id).limit(1);
  if (!existingSubscriptions || existingSubscriptions.length === 0) {
    const now = new Date();
    await supabase.from("subscriptions").insert({
      org_id: organization.id,
      plan: organization.plan ?? "free",
      status: "active",
      amount: 0,
      currency: "XOF",
      period_start: now.toISOString().slice(0, 10),
      period_end: addDays(now, 30)
    });
  }

  const { data: existingAccounts } = await supabase.from("bank_accounts").select("id").eq("user_id", user.id).limit(1);
  if (!existingAccounts || existingAccounts.length === 0) {
    const countryCode = organization.country ?? inferCountryCode(user);
    await supabase.from("bank_accounts").insert([
      {
        user_id: user.id,
        account_number: buildAccountNumber(user.id, "courant", countryCode, 1),
        type: "courant",
        balance: 0,
        currency: "XOF",
        country: countryCode,
        status: "active"
      },
      {
        user_id: user.id,
        account_number: buildAccountNumber(user.id, "epargne", countryCode, 2),
        type: "epargne",
        balance: 0,
        currency: "XOF",
        country: countryCode,
        status: "active"
      }
    ]);
  }

  return {
    organizationId: organization.id,
    organizationName: organization.name,
    created,
    plan: organization.plan,
    quotaMonthly: organization.quota_monthly
  };
}

export async function getCurrentOrganizationId(userId?: string | null) {
  if (!userId || !hasEnv("SUPABASE_SERVICE_ROLE_KEY")) {
    return null;
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { data } = await supabase
      .from("organizations")
      .select("id")
      .eq("owner_user_id", userId)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    return data?.id ?? null;
  } catch {
    return null;
  }
}

export async function loadOrganizationRecord(userId?: string | null): Promise<OrganizationRecord | null> {
  if (!userId || !hasEnv("SUPABASE_SERVICE_ROLE_KEY")) {
    return null;
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { data } = await supabase
      .from("organizations")
      .select("id, name, plan, quota_monthly, quota_used, country, stripe_customer_id, paydunya_customer_id, created_at")
      .eq("owner_user_id", userId)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    return (data as OrganizationRecord | null) ?? null;
  } catch {
    return null;
  }
}

export async function loadOrganizationSubscriptions(orgId?: string | null): Promise<SubscriptionRecord[]> {
  if (!orgId || !hasEnv("SUPABASE_SERVICE_ROLE_KEY")) {
    return [];
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { data } = await supabase
      .from("subscriptions")
      .select("id, plan, status, amount, currency, stripe_sub_id, paydunya_ref, period_start, period_end, created_at")
      .eq("org_id", orgId)
      .order("created_at", { ascending: false });

    return (data ?? []) as SubscriptionRecord[];
  } catch {
    return [];
  }
}

export async function loadOrganizationApiKeys(orgId?: string | null): Promise<ApiKeyRecord[]> {
  if (!orgId || !hasEnv("SUPABASE_SERVICE_ROLE_KEY")) {
    return [];
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { data } = await supabase
      .from("api_keys")
      .select("id, key_prefix, name, tier, active, created_at, last_used")
      .eq("org_id", orgId)
      .order("created_at", { ascending: true });

    return (data ?? []) as ApiKeyRecord[];
  } catch {
    return [];
  }
}

export async function loadWasiIndices(): Promise<WasiIndexSnapshot> {
  if (hasEnv("SUPABASE_SERVICE_ROLE_KEY")) {
    try {
      const supabase = createSupabaseAdminClient();
      const { data, error } = await supabase
        .from("wasi_indices")
        .select("country_code, composite, political, shipping, is_coup, updated_at, source")
        .order("composite", { ascending: false });

      if (!error && data && data.length > 0) {
        const composite = Math.round(
          computeRegionalComposite(
            data.map((row: { country_code: string; composite: number | string | null }) => ({
              country_code: row.country_code,
              composite: Number(row.composite ?? 0)
            }))
          )
        );

        return {
          rows: data.map((row: IndexRow & { composite: number | string | null }) => ({
            ...row,
            composite: Number(row.composite ?? 0),
            political: row.political === null ? null : Number(row.political),
            shipping: row.shipping === null ? null : Number(row.shipping)
          })) as IndexRow[],
          composite,
          source: "Supabase"
        };
      }
    } catch {
      // Fallback below.
    }
  }

  const rows = await fetchWorldBankIndices();
  return {
    rows: rows.map((row) => ({
      country_code: row.country_code,
      composite: row.composite,
      political: row.political,
      shipping: row.shipping,
      is_coup: row.is_coup,
      updated_at: row.updated_at,
      source: row.source
    })),
    composite: Math.round(computeRegionalComposite(rows)),
    source: "World Bank API"
  };
}

export async function loadUserBankAccounts(userId?: string | null): Promise<BankAccountRecord[]> {
  if (!userId) {
    return [];
  }

  if (hasEnv("SUPABASE_SERVICE_ROLE_KEY")) {
    try {
      const supabase = createSupabaseAdminClient();
      const { data } = await supabase
        .from("bank_accounts")
        .select("id, account_number, type, balance, currency, country, status, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });

      return (data ?? []) as BankAccountRecord[];
    } catch {
      // Fallback to user-scoped client below.
    }
  }

  const supabase = getServerClientIfAvailable();
  if (!supabase) {
    return [];
  }

  try {
    const { data } = await supabase
      .from("bank_accounts")
      .select("id, account_number, type, balance, currency, country, status, created_at")
      .order("created_at", { ascending: true });

    return (data ?? []) as BankAccountRecord[];
  } catch {
    return [];
  }
}

export async function loadUserTransactions(userId?: string | null): Promise<TransactionRecord[]> {
  if (!userId) {
    return [];
  }

  if (hasEnv("SUPABASE_SERVICE_ROLE_KEY")) {
    try {
      const supabase = createSupabaseAdminClient();
      const { data: accounts } = await supabase.from("bank_accounts").select("id").eq("user_id", userId);
      const accountIds = ((accounts ?? []) as Array<{ id: string }>).map((account: { id: string }) => account.id);
      if (accountIds.length === 0) {
        return [];
      }

      const { data } = await supabase
        .from("transactions")
        .select("id, type, amount, fee, currency, reference, status, created_at, from_account, to_account")
        .or(`from_account.in.(${accountIds.join(",")}),to_account.in.(${accountIds.join(",")})`)
        .order("created_at", { ascending: false })
        .limit(20);

      return (data ?? []) as TransactionRecord[];
    } catch {
      // Fallback to user-scoped client below.
    }
  }

  const supabase = getServerClientIfAvailable();
  if (!supabase) {
    return [];
  }

  try {
    const { data } = await supabase
      .from("transactions")
      .select("id, type, amount, fee, currency, reference, status, created_at, from_account, to_account")
      .order("created_at", { ascending: false })
      .limit(20);

    return (data ?? []) as TransactionRecord[];
  } catch {
    return [];
  }
}

export async function loadUserDexOrders(userId?: string | null): Promise<DexOrderRecord[]> {
  if (!userId) {
    return [];
  }

  if (hasEnv("SUPABASE_SERVICE_ROLE_KEY")) {
    try {
      const supabase = createSupabaseAdminClient();
      const { data } = await supabase
        .from("dex_orders")
        .select("id, ticker, side, order_type, quantity, price, status, filled_qty, commission, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20);

      return (data ?? []) as DexOrderRecord[];
    } catch {
      // Fallback to user-scoped client below.
    }
  }

  const supabase = getServerClientIfAvailable();
  if (!supabase) {
    return [];
  }

  try {
    const { data } = await supabase
      .from("dex_orders")
      .select("id, ticker, side, order_type, quantity, price, status, filled_qty, commission, created_at")
      .order("created_at", { ascending: false })
      .limit(20);

    return (data ?? []) as DexOrderRecord[];
  } catch {
    return [];
  }
}

export async function loadUserKycApplications(userId?: string | null): Promise<KycApplicationRecord[]> {
  if (!userId) {
    return [];
  }

  if (hasEnv("SUPABASE_SERVICE_ROLE_KEY")) {
    try {
      const supabase = createSupabaseAdminClient();
      const { data } = await supabase
        .from("kyc_applications")
        .select("id, tier_requested, tier_granted, status, aml_cleared, ppe_declared, submitted_at, reviewed_at, documents")
        .eq("user_id", userId)
        .order("submitted_at", { ascending: false });

      return (data ?? []) as KycApplicationRecord[];
    } catch {
      // Fallback to user-scoped client below.
    }
  }

  const supabase = getServerClientIfAvailable();
  if (!supabase) {
    return [];
  }

  try {
    const { data } = await supabase
      .from("kyc_applications")
      .select("id, tier_requested, tier_granted, status, aml_cleared, ppe_declared, submitted_at, reviewed_at, documents")
      .order("submitted_at", { ascending: false });

    return (data ?? []) as KycApplicationRecord[];
  } catch {
    return [];
  }
}
