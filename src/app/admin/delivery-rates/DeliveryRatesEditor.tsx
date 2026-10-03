"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatNaira } from "@/lib/pricing";

interface Props {
  country: string;
  states: string[];
  initialRates: Record<string, number>;
}

type Status = "idle" | "saving" | "saved" | "error";

export function DeliveryRatesEditor({ country, states, initialRates }: Props) {
  const [rates, setRates] = useState<Record<string, number>>(initialRates);
  const [drafts, setDrafts] = useState<Record<string, string>>(() =>
    Object.fromEntries(states.map((s) => [s, (initialRates[s] ?? 0).toString()])),
  );
  const [status, setStatus] = useState<Record<string, Status>>({});
  const [filter, setFilter] = useState("");

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return states;
    return states.filter((s) => s.toLowerCase().includes(q));
  }, [states, filter]);

  const totalConfigured = Object.values(rates).filter((v) => v > 0).length;

  async function save(state: string) {
    const raw = drafts[state] ?? "0";
    const feeNgn = Number(raw.replace(/[,\s]/g, ""));
    if (!Number.isFinite(feeNgn) || feeNgn < 0) {
      setStatus((s) => ({ ...s, [state]: "error" }));
      return;
    }
    setStatus((s) => ({ ...s, [state]: "saving" }));
    const res = await fetch("/api/admin/delivery-rates", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country, state, feeNgn: Math.round(feeNgn) }),
    });
    if (res.ok) {
      setRates((r) => ({ ...r, [state]: Math.round(feeNgn) }));
      setStatus((s) => ({ ...s, [state]: "saved" }));
      setTimeout(() => setStatus((s) => ({ ...s, [state]: "idle" })), 1500);
    } else {
      setStatus((s) => ({ ...s, [state]: "error" }));
    }
  }

  async function saveAll() {
    for (const state of states) {
      if ((drafts[state] ?? "") !== (rates[state] ?? 0).toString()) {
        await save(state);
      }
    }
  }

  return (
    <main className="min-h-screen bg-bg-alt p-6 md:p-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link href="/admin" className="text-sm font-bold text-ink-strong underline">
              ← Orders
            </Link>
            <h1 className="mt-2 text-3xl font-extrabold text-ink-strong">Delivery rates</h1>
            <p className="text-sm text-muted">
              Set the delivery fee for each state in {country}. Leave at ₦0 for free delivery.
            </p>
          </div>
          <button
            onClick={saveAll}
            className="rounded-pill border-2 border-ink-strong bg-ink-strong px-4 py-2 text-sm font-bold text-white"
          >
            Save all changed
          </button>
        </div>

        <div className="mb-4 flex items-center gap-3">
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter states…"
            className="w-full rounded-xl border-2 border-ink-strong bg-white px-4 py-2.5 focus:outline-none focus:ring-4 focus:ring-[#C9B6FF]"
          />
          <span className="whitespace-nowrap text-sm text-muted">
            {totalConfigured} of {states.length} set
          </span>
        </div>

        <div className="divide-y-2 divide-ink-strong/10 overflow-hidden rounded-2xl border-2 border-ink-strong bg-white shadow-card">
          {filtered.map((state) => {
            const s = status[state] ?? "idle";
            const currentFee = rates[state] ?? 0;
            const dirty = (drafts[state] ?? "") !== currentFee.toString();
            return (
              <div key={state} className="flex flex-wrap items-center gap-3 p-3">
                <div className="min-w-[160px] flex-1 font-bold text-ink-strong">{state}</div>
                <div className="flex items-center gap-2">
                  <span className="text-ink-strong">₦</span>
                  <input
                    inputMode="numeric"
                    value={drafts[state] ?? ""}
                    onChange={(e) =>
                      setDrafts((d) => ({ ...d, [state]: e.target.value.replace(/[^0-9]/g, "") }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") save(state);
                    }}
                    className="w-32 rounded-lg border-2 border-ink-strong bg-white px-3 py-1.5 text-right focus:outline-none focus:ring-4 focus:ring-[#C9B6FF]"
                  />
                  <button
                    onClick={() => save(state)}
                    disabled={!dirty || s === "saving"}
                    className="rounded-pill border-2 border-ink-strong bg-white px-3 py-1 text-xs font-bold disabled:opacity-40"
                  >
                    {s === "saving" ? "Saving…" : s === "saved" ? "Saved ✓" : "Save"}
                  </button>
                </div>
                <div className="min-w-[90px] text-right text-xs text-muted">
                  Current: {currentFee > 0 ? formatNaira(currentFee) : "Free"}
                </div>
                {s === "error" && (
                  <span className="w-full text-right text-xs text-sale">Could not save</span>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="p-6 text-center text-muted">No states match that filter.</div>
          )}
        </div>
      </div>
    </main>
  );
}
