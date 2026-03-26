/**
 * x402 Protocol Configuration — WASI AI Marketplace
 * Agents pay in USDC on Base to access West African financial data.
 * https://x402.org
 */

export const X402_WALLET = process.env.X402_WALLET_ADDRESS ?? "";

export const X402_NETWORK = "base" as const;

/** Price per API call in USD (paid in USDC on Base) */
export const MARKETPLACE_PRICES = {
  /** WASI Indices — 16 West African country risk scores */
  indices: "$0.01",
  /** WASI Intelligence — AI-powered analysis (uses Claude) */
  intelligence: "$0.10",
  /** FX Rates — live UEMOA / XOF / USD / EUR rates */
  rates: "$0.005",
  /** AFEX — African Export Index Family (54 countries) */
  afex: "$0.02",
} as const;

export const MARKETPLACE_ROUTES = {
  "/api/marketplace/indices": {
    price: MARKETPLACE_PRICES.indices,
    network: X402_NETWORK,
    config: {
      description: "WASI Indices — Risk scores for 16 West African countries (UEMOA/CEDEAO)",
      mimeType: "application/json",
    },
  },
  "/api/marketplace/intelligence": {
    price: MARKETPLACE_PRICES.intelligence,
    network: X402_NETWORK,
    config: {
      description: "WASI Intelligence — AI analysis powered by Claude for West African markets",
      mimeType: "application/json",
    },
  },
  "/api/marketplace/rates": {
    price: MARKETPLACE_PRICES.rates,
    network: X402_NETWORK,
    config: {
      description: "WASI FX Rates — Live XOF/EUR/USD exchange rates for UEMOA zone",
      mimeType: "application/json",
    },
  },
  "/api/marketplace/afex": {
    price: MARKETPLACE_PRICES.afex,
    network: X402_NETWORK,
    config: {
      description: "AFEX — Africa Export Index Family, commodity profiles for 54 African nations",
      mimeType: "application/json",
    },
  },
} as const;
