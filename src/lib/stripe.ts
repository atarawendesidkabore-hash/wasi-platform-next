import Stripe from "stripe";
import { assertStripeEnv } from "@/lib/env";

let stripe: Stripe | null = null;

export function createStripeServerClient() {
  if (stripe) {
    return stripe;
  }

  stripe = new Stripe(assertStripeEnv().secretKey, {
    apiVersion: "2026-02-25.clover"
  });

  return stripe;
}
