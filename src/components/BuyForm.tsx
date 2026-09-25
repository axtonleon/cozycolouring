"use client";

import { useState } from "react";
import { formatNaira, PRICE_NGN } from "@/lib/pricing";

interface Props {
  collectionSlug: string;
  bookSlug: string;
}

export function BuyForm({ collectionSlug, bookSlug }: Props) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collectionSlug, bookSlug, ...form }),
      });
      const data = (await res.json()) as { authorization_url?: string; error?: string };
      if (!res.ok || !data.authorization_url) {
        throw new Error(data.error || "Could not start payment");
      }
      window.location.href = data.authorization_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-pill bg-ink-strong px-7 py-3.5 text-base font-bold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-hover"
      >
        Buy now — {formatNaira(PRICE_NGN)}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-strong/50 p-4"
          onClick={() => !submitting && setOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-3xl border-2 border-ink-strong bg-white p-8 shadow-hover"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-muted">Delivery details</p>
                <h2 className="mt-1 text-2xl font-extrabold text-ink-strong">Where should we deliver?</h2>
              </div>
              <button
                type="button"
                onClick={() => !submitting && setOpen(false)}
                aria-label="Close"
                className="rounded-full border-2 border-ink-strong px-3 py-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="Full name">
                <input
                  required
                  value={form.name}
                  onChange={update("name")}
                  className={fieldClass}
                  placeholder="Lily Adeyemi"
                />
              </Field>
              <Field label="Phone">
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={update("phone")}
                  className={fieldClass}
                  placeholder="080..."
                />
              </Field>
              <Field label="Email">
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={update("email")}
                  className={fieldClass}
                  placeholder="you@example.com"
                />
              </Field>
              <Field label="Delivery address">
                <textarea
                  required
                  value={form.address}
                  onChange={update("address")}
                  rows={3}
                  className={fieldClass}
                  placeholder="House number, street, area, city"
                />
              </Field>

              {error && (
                <p className="rounded-lg border-2 border-ink-strong bg-[#FFE0E0] px-3 py-2 text-sm text-ink-strong">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-pill bg-ink-strong px-7 py-3.5 text-base font-bold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-hover disabled:opacity-60"
              >
                {submitting ? "Redirecting to Paystack…" : `Pay ${formatNaira(PRICE_NGN)}`}
              </button>
              <p className="text-center text-xs text-muted">Secure payment via Paystack. Hand-delivered after payment.</p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

const fieldClass =
  "w-full rounded-xl border-2 border-ink-strong bg-white px-4 py-2.5 text-base text-ink placeholder:text-subtle focus:outline-none focus:ring-4 focus:ring-[#C9B6FF]";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold text-ink-strong">{label}</span>
      {children}
    </label>
  );
}
