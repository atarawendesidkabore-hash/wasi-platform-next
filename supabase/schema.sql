create extension if not exists "pgcrypto";

create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_user_id uuid references auth.users(id) on delete set null,
  plan text default 'free' check (plan in ('free', 'analyst', 'pro', 'enterprise')),
  quota_monthly integer default 3,
  quota_used integer default 0,
  quota_reset date default (current_date + interval '1 month'),
  stripe_customer_id text,
  paydunya_customer_id text,
  country text default 'BF',
  created_at timestamptz default now()
);

create table if not exists api_keys (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(id) on delete cascade,
  key_hash text not null unique,
  key_prefix text not null,
  name text,
  tier text default 'basic',
  active boolean default true,
  last_used timestamptz,
  created_at timestamptz default now()
);

create table if not exists intelligence_queries (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(id) on delete set null,
  query text not null,
  response text,
  countries text[],
  composite integer,
  tokens_used integer,
  latency_ms integer,
  created_at timestamptz default now()
);

create table if not exists wasi_indices (
  id bigint generated always as identity primary key,
  country_code text not null unique,
  composite numeric(5,2),
  gdp_growth numeric(5,2),
  trade_score numeric(5,2),
  political numeric(5,2),
  shipping numeric(5,2),
  is_coup boolean default false,
  source text,
  updated_at timestamptz default now()
);

create table if not exists bank_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  account_number text unique,
  type text check (type in ('courant', 'epargne', 'investissement')),
  balance numeric(15,2) default 0,
  currency text default 'XOF',
  country text default 'BF',
  status text default 'active',
  created_at timestamptz default now()
);

create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  from_account uuid references bank_accounts(id) on delete set null,
  to_account uuid references bank_accounts(id) on delete set null,
  type text check (type in ('virement', 'depot', 'retrait', 'mobile_money', 'credit', 'debit')),
  amount numeric(15,2) not null,
  fee numeric(10,2) default 0,
  currency text default 'XOF',
  reference text,
  status text default 'pending' check (status in ('pending', 'completed', 'failed', 'reversed')),
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists dex_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  ticker text not null,
  side text check (side in ('buy', 'sell')),
  order_type text check (order_type in ('market', 'limit', 'stop', 'stop_limit')),
  quantity numeric(15,4),
  price numeric(15,2),
  status text default 'pending',
  filled_qty numeric(15,4) default 0,
  commission numeric(10,2) default 0,
  created_at timestamptz default now()
);

create table if not exists kyc_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  tier_requested integer check (tier_requested between 1 and 4),
  tier_granted integer,
  status text default 'pending' check (status in ('pending', 'review', 'approved', 'rejected')),
  documents jsonb default '{}'::jsonb,
  aml_cleared boolean default false,
  ppe_declared boolean default false,
  reviewer_id uuid,
  submitted_at timestamptz default now(),
  reviewed_at timestamptz
);

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(id) on delete cascade,
  plan text not null,
  status text default 'active',
  stripe_sub_id text,
  paydunya_ref text,
  amount numeric(10,2),
  currency text default 'XOF',
  period_start date,
  period_end date,
  created_at timestamptz default now()
);

create index if not exists idx_intelligence_queries_org_created_at on intelligence_queries (org_id, created_at desc);
create index if not exists idx_transactions_accounts_created_at on transactions (from_account, to_account, created_at desc);
create index if not exists idx_dex_orders_user_created_at on dex_orders (user_id, created_at desc);
create index if not exists idx_organizations_owner_user_id on organizations (owner_user_id);
create unique index if not exists idx_organizations_owner_user_unique on organizations (owner_user_id) where owner_user_id is not null;

alter table bank_accounts enable row level security;
alter table transactions enable row level security;
alter table dex_orders enable row level security;
alter table kyc_applications enable row level security;

drop policy if exists own_accounts on bank_accounts;
create policy own_accounts on bank_accounts
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists own_transactions on transactions;
create policy own_transactions on transactions
  for select
  using (
    from_account in (select id from bank_accounts where user_id = auth.uid())
    or to_account in (select id from bank_accounts where user_id = auth.uid())
  );

drop policy if exists own_dex_orders on dex_orders;
create policy own_dex_orders on dex_orders
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists own_kyc_applications on kyc_applications;
create policy own_kyc_applications on kyc_applications
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
