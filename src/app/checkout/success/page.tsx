import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { getOrderByReference } from "@/lib/orders";

export const dynamic = "force-dynamic";

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const { ref } = await searchParams;
  const order = ref ? await getOrderByReference(ref) : null;

  return (
    <PageShell>
      <section className="mx-auto max-w-container px-6 py-20">
        <div className="mx-auto max-w-lg rounded-3xl border-2 border-ink-strong bg-lavender p-10 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-muted">Payment received</p>
          <h1 className="mt-3 text-4xl font-extrabold text-ink-strong">Thank you!</h1>
          {order ? (
            <>
              <p className="mt-4 text-lg text-ink">
                Your order for <strong>{order.book_title}</strong> is confirmed. We&apos;ll hand-deliver it to{" "}
                <strong>{order.delivery_address}</strong>.
              </p>
              <p className="mt-2 text-sm text-muted">Reference: {order.reference}</p>
              <p className="mt-1 text-sm text-muted">We&apos;ll reach out on {order.buyer_phone} to arrange delivery.</p>
            </>
          ) : (
            <p className="mt-4 text-lg text-ink">Your payment went through.</p>
          )}
          <Link
            href="/books"
            className="mt-8 inline-block rounded-pill bg-ink-strong px-6 py-3 text-sm font-bold text-white"
          >
            Back to books
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
