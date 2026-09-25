const PAYSTACK_BASE = "https://api.paystack.co";

function getSecret(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY is not set");
  return key;
}

export interface InitializePaymentInput {
  email: string;
  amountKobo: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
}

export interface InitializePaymentResult {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export async function initializePayment(input: InitializePaymentInput): Promise<InitializePaymentResult> {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getSecret()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: input.email,
      amount: input.amountKobo,
      reference: input.reference,
      callback_url: input.callbackUrl,
      metadata: input.metadata,
      currency: "NGN",
    }),
  });
  const json = (await res.json()) as { status: boolean; message: string; data?: InitializePaymentResult };
  if (!res.ok || !json.status || !json.data) {
    throw new Error(`Paystack init failed: ${json.message || res.statusText}`);
  }
  return json.data;
}

export interface VerifyPaymentResult {
  status: "success" | "failed" | "abandoned" | string;
  reference: string;
  amount: number;
  currency: string;
  customer: { email: string };
}

export async function verifyPayment(reference: string): Promise<VerifyPaymentResult> {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${getSecret()}` },
  });
  const json = (await res.json()) as { status: boolean; message: string; data?: VerifyPaymentResult };
  if (!res.ok || !json.status || !json.data) {
    throw new Error(`Paystack verify failed: ${json.message || res.statusText}`);
  }
  return json.data;
}
