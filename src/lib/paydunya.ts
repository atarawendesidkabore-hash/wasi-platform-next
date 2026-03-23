import { assertPaydunyaEnv, getAppUrl } from "@/lib/env";

export type PaydunyaCheckoutInput = {
  amount: number;
  currency?: string;
  description: string;
  callbackUrl?: string;
  returnUrl?: string;
  cancelUrl?: string;
  orgId: string;
  plan: string;
};

export async function createPaydunyaCheckout(input: PaydunyaCheckoutInput) {
  const env = assertPaydunyaEnv();
  const callbackUrl = input.callbackUrl ?? `${getAppUrl()}/api/webhook/paydunya`;
  const returnUrl = input.returnUrl ?? `${getAppUrl()}/billing?success=true&provider=paydunya`;
  const cancelUrl = input.cancelUrl ?? `${getAppUrl()}/billing?cancelled=true&provider=paydunya`;

  const response = await fetch("https://app.paydunya.com/api/v1/checkout-invoice/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "PAYDUNYA-MASTER-KEY": env.masterKey,
      "PAYDUNYA-PRIVATE-KEY": env.privateKey,
      "PAYDUNYA-TOKEN": env.token,
      "PAYDUNYA-MODE": env.mode
    },
    body: JSON.stringify({
      invoice: {
        total_amount: input.amount,
        description: input.description
      },
      store: {
        name: "WASI Platform",
        tagline: "Intelligence Economique Afrique de l'Ouest",
        phone: "+22600000000",
        postal_address: "Ouagadougou, Burkina Faso",
        website_url: "https://wasiecosystem.com",
        logo_url: `${getAppUrl()}/logo.svg`
      },
      actions: {
        callback_url: callbackUrl,
        return_url: returnUrl,
        cancel_url: cancelUrl
      },
      custom_data: {
        org_id: input.orgId,
        plan: input.plan,
        currency: input.currency ?? "XOF"
      }
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`PayDunya checkout failed: ${response.status} ${text}`);
  }

  const data = await response.json();

  return {
    invoiceUrl: data.response_text as string,
    token: data.token as string
  };
}
