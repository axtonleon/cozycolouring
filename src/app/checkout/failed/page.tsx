import Link from "next/link";
import { PageShell } from "@/components/PageShell";

export default async function FailedPage({ searchParams }: { searchParams: Promise<{ ref?: string; reason?: string }> }) {
  const { ref, reason } = await searchParams;
  return (
    <PageShell>
      <section className="mx-auto max-w-container px-6 py-20">
        <div className="mx-auto max-w-lg rounded-3xl border-2 border-ink-strong bg-white p-10 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-muted">Payment</p>
          <h1 className="mt-3 text-4xl font-extrabold text-ink-strong">Payment didn&apos;t go through</h1>
          <p className="mt-4 text-lg text-ink">
            {reason === "unknown"
              ? "We couldn't find that transaction. If you were charged, contact us."
              : "You can try again — no charge was made."}
          </p>
          {ref && <p className="mt-2 text-sm text-muted">Reference: {ref}</p>}
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
