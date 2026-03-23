import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const WASI_COUNTRIES = [
  { code: "NG", name: "Nigeria", iso3: "NGA", weight: 0.28 },
  { code: "CI", name: "Cote d'Ivoire", iso3: "CIV", weight: 0.22 },
  { code: "GH", name: "Ghana", iso3: "GHA", weight: 0.15 },
  { code: "SN", name: "Senegal", iso3: "SEN", weight: 0.1 },
  { code: "BF", name: "Burkina Faso", iso3: "BFA", weight: 0.04 },
  { code: "ML", name: "Mali", iso3: "MLI", weight: 0.04 },
  { code: "GN", name: "Guinea", iso3: "GIN", weight: 0.03 },
  { code: "BJ", name: "Benin", iso3: "BEN", weight: 0.04 },
  { code: "TG", name: "Togo", iso3: "TGO", weight: 0.03 },
  { code: "NE", name: "Niger", iso3: "NER", weight: 0.02 },
  { code: "MR", name: "Mauritania", iso3: "MRT", weight: 0.01 },
  { code: "SL", name: "Sierra Leone", iso3: "SLE", weight: 0.01 },
  { code: "LR", name: "Liberia", iso3: "LBR", weight: 0.01 },
  { code: "GW", name: "Guinea-Bissau", iso3: "GNB", weight: 0.005 },
  { code: "GM", name: "Gambia", iso3: "GMB", weight: 0.005 },
  { code: "CV", name: "Cape Verde", iso3: "CPV", weight: 0.005 }
] as const;

const COUP_COUNTRIES = new Set(["BF", "ML", "NE", "GN"]);

type OpenErApiResponse = {
  result: string;
  base_code: string;
  rates: Record<string, number>;
};

type CoinGeckoResponse = Record<
  string,
  {
    usd?: number;
    usd_24h_change?: number;
    usd_market_cap?: number;
  }
>;

type WasiIndexRow = {
  country_code: string;
  composite: number;
  gdp_growth: number | null;
  trade_score: number | null;
  political: number;
  shipping: number;
  is_coup: boolean;
  source: string;
  updated_at: string;
};

export async function fetchLiveRates() {
  const response = await fetch("https://open.er-api.com/v6/latest/XOF", {
    next: {
      revalidate: 60
    }
  });

  if (!response.ok) {
    throw new Error(`ExchangeRate API failed: ${response.status}`);
  }

  const data = (await response.json()) as OpenErApiResponse;

  if (data.result !== "success") {
    throw new Error("ExchangeRate API returned non-success result");
  }

  return {
    base: data.base_code,
    updatedAt: new Date().toISOString(),
    rates: {
      EUR: data.rates.EUR,
      USD: data.rates.USD,
      GHS: data.rates.GHS,
      NGN: data.rates.NGN
    }
  };
}

export async function fetchLiveCrypto() {
  const ids = "bitcoin,ethereum,usd-coin,matic-network,binancecoin";
  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`,
    {
      next: {
        revalidate: 30
      },
      headers: {
        accept: "application/json"
      }
    }
  );

  if (!response.ok) {
    throw new Error(`CoinGecko API failed: ${response.status}`);
  }

  const data = (await response.json()) as CoinGeckoResponse;
  return {
    updatedAt: new Date().toISOString(),
    assets: {
      BTC: data.bitcoin,
      ETH: data.ethereum,
      USDC: data["usd-coin"],
      MATIC: data["matic-network"],
      BNB: data.binancecoin
    }
  };
}

function normalizeGrowthScore(value: number | null) {
  if (value === null || Number.isNaN(value)) {
    return 55;
  }
  return Math.min(100, Math.max(0, 50 + value * 5));
}

function normalizeTradeScore(value: number | null) {
  if (value === null || Number.isNaN(value)) {
    return 55;
  }
  return Math.min(100, Math.max(0, value * 0.8));
}

function normalizeInflationScore(value: number | null) {
  if (value === null || Number.isNaN(value)) {
    return 60;
  }
  return Math.min(100, Math.max(0, 100 - value * 3));
}

export async function fetchWorldBankIndices() {
  const batchCodes = WASI_COUNTRIES.map((country) => country.iso3).join(";");
  const indicators = [
    { id: "NY.GDP.MKTP.KD.ZG", name: "gdp_growth" },
    { id: "NE.TRD.GNFS.ZS", name: "trade_score" },
    { id: "FP.CPI.TOTL.ZG", name: "inflation" }
  ] as const;

  const responses = await Promise.all(
    indicators.map(async (indicator) => {
      const response = await fetch(
        `https://api.worldbank.org/v2/country/${batchCodes}/indicator/${indicator.id}?format=json&mrv=1&per_page=100`,
        {
          next: {
            revalidate: 3600
          }
        }
      );

      if (!response.ok) {
        throw new Error(`World Bank API failed for ${indicator.id}: ${response.status}`);
      }

      return {
        indicator: indicator.name,
        payload: (await response.json()) as [unknown, Array<Record<string, unknown>>]
      };
    })
  );

  const raw = new Map<
    string,
    {
      gdp_growth: number | null;
      trade_score: number | null;
      inflation: number | null;
    }
  >();

  responses.forEach(({ indicator, payload }) => {
    const rows = payload[1] ?? [];
    rows.forEach((row) => {
      const iso3 = typeof row.countryiso3code === "string" ? row.countryiso3code : "";
      const country = WASI_COUNTRIES.find((entry) => entry.iso3 === iso3);
      if (!country) {
        return;
      }

      const current = raw.get(country.code) ?? {
        gdp_growth: null,
        trade_score: null,
        inflation: null
      };

      const numericValue = typeof row.value === "number" ? row.value : null;
      raw.set(country.code, {
        ...current,
        [indicator]: numericValue
      });
    });
  });

  const timestamp = new Date().toISOString();

  const indices = WASI_COUNTRIES.map<WasiIndexRow>((country) => {
    const values = raw.get(country.code) ?? {
      gdp_growth: null,
      trade_score: null,
      inflation: null
    };

    const gdpScore = normalizeGrowthScore(values.gdp_growth);
    const tradeScore = normalizeTradeScore(values.trade_score);
    const inflationScore = normalizeInflationScore(values.inflation);
    const coupPenalty = COUP_COUNTRIES.has(country.code) ? 0.6 : 1;
    const political = COUP_COUNTRIES.has(country.code) ? 30 : 70;
    const shipping = Math.min(95, Math.max(25, Math.round(40 + country.weight * 180)));
    const composite = Math.round(
      Math.max(
        20,
        Math.min(
          95,
          (gdpScore * 0.35 + tradeScore * 0.4 + inflationScore * 0.25) * coupPenalty
        )
      )
    );

    return {
      country_code: country.code,
      composite,
      gdp_growth: values.gdp_growth,
      trade_score: values.trade_score,
      political,
      shipping,
      is_coup: COUP_COUNTRIES.has(country.code),
      source: "World Bank API",
      updated_at: timestamp
    };
  });

  return indices;
}

export function computeRegionalComposite(rows: Array<Pick<WasiIndexRow, "country_code" | "composite">>) {
  return rows.reduce((sum, row) => {
    const country = WASI_COUNTRIES.find((entry) => entry.code === row.country_code);
    return sum + row.composite * (country?.weight ?? 0);
  }, 0);
}

export async function refreshAndPersistWasiIndices() {
  const supabase = createSupabaseAdminClient();
  const indices = await fetchWorldBankIndices();

  const { error } = await supabase.from("wasi_indices").upsert(indices, {
    onConflict: "country_code"
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    count: indices.length,
    composite: Math.round(computeRegionalComposite(indices))
  };
}
