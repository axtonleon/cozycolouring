import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import {
  isSupportedCountry,
  isValidState,
  listDeliveryRates,
  upsertDeliveryRate,
} from "@/lib/delivery";

export const runtime = "nodejs";

export async function GET(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const url = new URL(req.url);
  const country = url.searchParams.get("country") || "Nigeria";
  if (!isSupportedCountry(country)) {
    return NextResponse.json({ error: "Unsupported country" }, { status: 400 });
  }
  const rates = await listDeliveryRates(country);
  return NextResponse.json({ country, rates });
}

export async function PUT(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await req.json().catch(() => ({}))) as {
    country?: string;
    state?: string;
    feeNgn?: number;
  };
  const { country, state, feeNgn } = body;
  if (!country || !state || typeof feeNgn !== "number" || !Number.isFinite(feeNgn) || feeNgn < 0) {
    return NextResponse.json({ error: "Bad input" }, { status: 400 });
  }
  if (!isSupportedCountry(country) || !isValidState(country, state)) {
    return NextResponse.json({ error: "Invalid country/state" }, { status: 400 });
  }
  await upsertDeliveryRate(country, state, Math.round(feeNgn));
  return NextResponse.json({ ok: true });
}
