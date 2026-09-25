import { NextResponse } from "next/server";
import { getOrderByReference, markPaidByReference } from "@/lib/orders";
import { verifyPayment } from "@/lib/paystack";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const reference = url.searchParams.get("reference") || url.searchParams.get("trxref");
  if (!reference) {
    return NextResponse.redirect(new URL("/checkout/failed", url.origin));
  }

  const order = await getOrderByReference(reference);
  if (!order) {
    return NextResponse.redirect(new URL(`/checkout/failed?reason=unknown`, url.origin));
  }

  try {
    const result = await verifyPayment(reference);
    if (result.status === "success" && result.amount === order.amount_kobo) {
      await markPaidByReference(reference);
      return NextResponse.redirect(new URL(`/checkout/success?ref=${reference}`, url.origin));
    }
    return NextResponse.redirect(new URL(`/checkout/failed?ref=${reference}`, url.origin));
  } catch {
    return NextResponse.redirect(new URL(`/checkout/failed?ref=${reference}`, url.origin));
  }
}
