"use client";

import { useEffect, useState } from "react";
import { SUPPORTED_COUNTRIES, statesFor } from "@/lib/delivery";
import { formatNaira, PRICE_NGN } from "@/lib/pricing";

interface Props {
  collectionSlug: string;
  bookSlug: string;
}

interface FormState {
  name: string;
  phone: string;
  email: string;
  country: string;
  state: string;
  city: string;
  street: string;
}

const INITIAL: FormState = {
  name: "",
  phone: "",
  email: "",
  country: SUPPORTED_COUNTRIES[0],
  state: "",
  city: "",
  street: "",
};

export function BuyForm({ collectionSlug, bookSlug }: Props) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [feeNgn, setFeeNgn] = useState<number | null>(null);
  const [feeLoading, setFeeLoading] = useState(false);

  useEffect(() => {
    if (!form.country || !form.state) {
      setFeeNgn(null);
      return;
    }
    const controller = new AbortController();
    setFeeLoading(true);
    fetch(
      `/api/delivery-fee?country=${encodeURIComponent(form.country)}&state=${encodeURIComponent(form.state)}`,
      { signal: controller.signal },
    )
      .then((r) => r.json() as Promise<{ feeNgn: number | null }>)
      .then((d) => setFeeNgn(d.feeNgn))
      .catch(() => {})
      .finally(() => setFeeLoading(false));
    return () => controller.abort();
  }, [form.country, form.state]);

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

  function update<K extends keyof FormState>(key: K) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = e.target.value;
      setForm((f) => {
        if (key === "country") return { ...f, country: value, state: "" };
        return { ...f, [key]: value };
      });
    };
  }

  const states = statesFor(form.country);
  const total = feeNgn !== null ? PRICE_NGN + feeNgn : null;

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
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border-2 border-ink-strong bg-white p-8 shadow-hover"
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
                <input required value={form.name} onChange={update("name")} className={fieldClass} placeholder="Lily Adeyemi" />
              </Field>
              <Field label="Phone">
                <input required type="tel" value={form.phone} onChange={update("phone")} className={fieldClass} placeholder="080..." />
              </Field>
              <Field label="Email">
                <input required type="email" value={form.email} onChange={update("email")} className={fieldClass} placeholder="you@example.com" />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Country">
                  <select required value={form.country} onChange={update("country")} className={fieldClass}>
                    {SUPPORTED_COUNTRIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </Field>
                <Field label="State">
                  <select required value={form.state} onChange={update("state")} className={fieldClass}>
                    <option value="">Choose a state</option>
                    {states.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="City">
                <input required value={form.city} onChange={update("city")} className={fieldClass} placeholder="Ikeja" />
              </Field>
              <Field label="Street address">
                <input required value={form.street} onChange={update("street")} className={fieldClass} placeholder="12 Allen Avenue, Flat 3B" />
              </Field>

              <div className="rounded-xl border-2 border-ink-strong bg-lavender p-3 text-sm">
                <div className="flex justify-between">
                  <span>Book</span>
                  <span className="font-bold">{formatNaira(PRICE_NGN)}</span>
                </div>
                <div className="mt-1 flex justify-between">
                  <span>Delivery {form.state && `(${form.state})`}</span>
                  <span className="font-bold">
                    {!form.state
                      ? "Pick a state"
                      : feeLoading
                        ? "…"
                        : feeNgn === null
                          ? "—"
                          : feeNgn === 0
                            ? "Free"
                            : formatNaira(feeNgn)}
                  </span>
                </div>
                <div className="mt-2 flex justify-between border-t-2 border-dashed border-ink-strong/30 pt-2 text-base font-extrabold text-ink-strong">
                  <span>Total</span>
                  <span>{total !== null ? formatNaira(total) : "—"}</span>
                </div>
              </div>

              {error && (
                <p className="rounded-lg border-2 border-ink-strong bg-[#FFE0E0] px-3 py-2 text-sm text-ink-strong">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting || !form.state}
                className="w-full rounded-pill bg-ink-strong px-7 py-3.5 text-base font-bold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-hover disabled:opacity-60"
              >
                {submitting ? "Redirecting to Paystack…" : total !== null ? `Pay ${formatNaira(total)}` : `Pay ${formatNaira(PRICE_NGN)}`}
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
