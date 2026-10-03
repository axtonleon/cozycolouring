import { NextResponse } from "next/server";
import { getDeliveryFeeNaira, isSupportedCountry, isValidState } from "@/lib/delivery";
import { PRICE_NGN } from "@/lib/pricing";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const country = url.searchParams.get("country") || "";
  const state = url.searchParams.get("state") || "";

  if (!isSupportedCountry(country) || !isValidState(country, state)) {
    return NextResponse.json({ feeNgn: null, bookNgn: PRICE_NGN, totalNgn: null });
  }
  const feeNgn = await getDeliveryFeeNaira(country, state);
  return NextResponse.json({ feeNgn, bookNgn: PRICE_NGN, totalNgn: PRICE_NGN + feeNgn });
}
