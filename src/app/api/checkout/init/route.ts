import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { getBook } from "@/lib/books";
import { createOrder } from "@/lib/orders";
import { initializePayment } from "@/lib/paystack";
import { PRICE_NGN } from "@/lib/pricing";

export const runtime = "nodejs";

interface Body {
  collectionSlug?: string;
  bookSlug?: string;
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Body;
  const { collectionSlug, bookSlug, name, phone, email, address } = body;

  if (!collectionSlug || !bookSlug || !name || !phone || !email || !address) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const book = getBook(collectionSlug, bookSlug);
  if (!book) return NextResponse.json({ error: "Book not found" }, { status: 404 });

  const reference = `cc_${Date.now()}_${randomBytes(4).toString("hex")}`;
  const amountKobo = PRICE_NGN * 100;

  const origin = new URL(req.url).origin;
  const callbackUrl = `${origin}/api/paystack/callback`;

  await createOrder({
    reference,
    bookId: book.id,
    bookTitle: book.title,
    bookCollection: book.collection,
    buyerName: name.trim(),
    buyerPhone: phone.trim(),
    buyerEmail: email.trim().toLowerCase(),
    deliveryAddress: address.trim(),
    amountKobo,
  });

  const paystack = await initializePayment({
    email: email.trim().toLowerCase(),
    amountKobo,
    reference,
    callbackUrl,
    metadata: { bookId: book.id, bookTitle: book.title },
  });

  return NextResponse.json({ authorization_url: paystack.authorization_url, reference });
}
