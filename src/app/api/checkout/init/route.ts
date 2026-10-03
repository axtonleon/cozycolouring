import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { getBook } from "@/lib/books";
import { composeAddress, getDeliveryFeeNaira, isSupportedCountry, isValidState } from "@/lib/delivery";
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
  country?: string;
  state?: string;
  city?: string;
  street?: string;
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Body;
  const { collectionSlug, bookSlug, name, phone, email, country, state, city, street } = body;

  if (!collectionSlug || !bookSlug || !name || !phone || !email || !country || !state || !city || !street) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  if (!isSupportedCountry(country)) {
    return NextResponse.json({ error: "We don't deliver to that country yet" }, { status: 400 });
  }
  if (!isValidState(country, state)) {
    return NextResponse.json({ error: "Pick a valid state" }, { status: 400 });
  }

  const book = getBook(collectionSlug, bookSlug);
  if (!book) return NextResponse.json({ error: "Book not found" }, { status: 404 });

  const bookPriceKobo = PRICE_NGN * 100;
  const deliveryFeeKobo = (await getDeliveryFeeNaira(country, state)) * 100;
  const amountKobo = bookPriceKobo + deliveryFeeKobo;

  const reference = `cc_${Date.now()}_${randomBytes(4).toString("hex")}`;
  const origin = new URL(req.url).origin;
  const callbackUrl = `${origin}/api/paystack/callback`;

  const deliveryAddress = composeAddress({ street, city, state, country });

  await createOrder({
    reference,
    bookId: book.id,
    bookTitle: book.title,
    bookCollection: book.collection,
    buyerName: name.trim(),
    buyerPhone: phone.trim(),
    buyerEmail: email.trim().toLowerCase(),
    deliveryStreet: street.trim(),
    deliveryCity: city.trim(),
    deliveryState: state,
    deliveryCountry: country,
    deliveryAddress,
    bookPriceKobo,
    deliveryFeeKobo,
    amountKobo,
  });

  const paystack = await initializePayment({
    email: email.trim().toLowerCase(),
    amountKobo,
    reference,
    callbackUrl,
    metadata: { bookId: book.id, bookTitle: book.title, deliveryState: state },
  });

  return NextResponse.json({ authorization_url: paystack.authorization_url, reference });
}
