import { ensureSchema, getSql } from "./db";

export const SUPPORTED_COUNTRIES = ["Nigeria"] as const;
export type SupportedCountry = (typeof SUPPORTED_COUNTRIES)[number];

export const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT (Abuja)",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
] as const;

export type NigerianState = (typeof NIGERIAN_STATES)[number];

export function statesFor(country: string): readonly string[] {
  if (country === "Nigeria") return NIGERIAN_STATES;
  return [];
}

export function isSupportedCountry(country: string): country is SupportedCountry {
  return (SUPPORTED_COUNTRIES as readonly string[]).includes(country);
}

export function isValidState(country: string, state: string): boolean {
  return statesFor(country).includes(state);
}

export function composeAddress(parts: {
  street: string;
  city: string;
  state: string;
  country: string;
}): string {
  return [parts.street, parts.city, parts.state, parts.country]
    .map((p) => p.trim())
    .filter(Boolean)
    .join(", ");
}

export interface DeliveryRate {
  country: string;
  state: string;
  fee_ngn: number;
  updated_at: string;
}

export async function getDeliveryFeeNaira(country: string, state: string): Promise<number> {
  await ensureSchema();
  const sql = getSql();
  const rows = (await sql`
    SELECT fee_ngn FROM delivery_rates WHERE country = ${country} AND state = ${state} LIMIT 1
  `) as unknown as { fee_ngn: number }[];
  return rows[0]?.fee_ngn ?? 0;
}

export async function listDeliveryRates(country: string): Promise<Record<string, number>> {
  await ensureSchema();
  const sql = getSql();
  const rows = (await sql`
    SELECT state, fee_ngn FROM delivery_rates WHERE country = ${country}
  `) as unknown as { state: string; fee_ngn: number }[];
  const map: Record<string, number> = {};
  for (const r of rows) map[r.state] = r.fee_ngn;
  return map;
}

export async function upsertDeliveryRate(
  country: string,
  state: string,
  feeNgn: number,
): Promise<void> {
  await ensureSchema();
  const sql = getSql();
  await sql`
    INSERT INTO delivery_rates (country, state, fee_ngn, updated_at)
    VALUES (${country}, ${state}, ${feeNgn}, NOW())
    ON CONFLICT (country, state)
    DO UPDATE SET fee_ngn = EXCLUDED.fee_ngn, updated_at = NOW()
  `;
}
