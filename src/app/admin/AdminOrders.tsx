"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ORDER_STATUSES, type Order, type OrderStatus } from "@/lib/orders";
import { formatNaira } from "@/lib/pricing";

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending payment",
  paid: "Paid — to pack",
  packed: "Packed",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-[#FFE27A]",
  paid: "bg-[#C9B6FF]",
  packed: "bg-[#B6E0FF]",
  out_for_delivery: "bg-[#FFB6C1]",
  delivered: "bg-[#B6F5C0]",
  cancelled: "bg-[#E5E5E5]",
};

export function AdminOrders({ initialOrders }: { initialOrders: Order[] }) {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const filtered = useMemo(
    () => (filter === "all" ? orders : orders.filter((o) => o.status === filter)),
    [orders, filter],
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: orders.length };
    for (const s of ORDER_STATUSES) c[s] = 0;
    for (const o of orders) c[o.status] = (c[o.status] ?? 0) + 1;
    return c;
  }, [orders]);

  async function updateStatus(id: number, status: OrderStatus) {
    setUpdatingId(id);
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const data = (await res.json()) as { order: Order };
      setOrders((prev) => prev.map((o) => (o.id === id ? data.order : o)));
    }
    setUpdatingId(null);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-bg-alt p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-ink-strong">Orders</h1>
            <p className="text-sm text-muted">Track payments and hand-delivery status.</p>
          </div>
          <button
            onClick={logout}
            className="rounded-pill border-2 border-ink-strong bg-white px-4 py-2 text-sm font-bold"
          >
            Sign out
          </button>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
            All ({counts.all})
          </FilterChip>
          {ORDER_STATUSES.map((s) => (
            <FilterChip key={s} active={filter === s} onClick={() => setFilter(s)}>
              {STATUS_LABELS[s]} ({counts[s]})
            </FilterChip>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-ink-strong bg-white p-10 text-center text-muted">
            No orders here yet.
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((o) => (
              <article
                key={o.id}
                className="rounded-2xl border-2 border-ink-strong bg-white p-5 shadow-card"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted">
                      {new Date(o.created_at).toLocaleString()}
                    </p>
                    <h2 className="mt-1 text-lg font-extrabold text-ink-strong">{o.book_title}</h2>
                    <p className="text-sm text-muted">{o.book_collection}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-extrabold text-ink-strong">
                      {formatNaira(o.amount_kobo / 100)}
                    </p>
                    <span
                      className={`mt-1 inline-block rounded-pill px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-ink-strong ${STATUS_COLORS[o.status]}`}
                    >
                      {STATUS_LABELS[o.status]}
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                  <div>
                    <p className="font-bold text-ink-strong">{o.buyer_name}</p>
                    <p className="text-ink">
                      <a href={`tel:${o.buyer_phone}`} className="underline">
                        {o.buyer_phone}
                      </a>
                      {" · "}
                      <a href={`mailto:${o.buyer_email}`} className="underline">
                        {o.buyer_email}
                      </a>
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-ink-strong">Delivery</p>
                    <p className="text-ink whitespace-pre-wrap">{o.delivery_address}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 border-t-2 border-dashed border-ink-strong/20 pt-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted">Update:</span>
                  {ORDER_STATUSES.filter((s) => s !== o.status).map((s) => (
                    <button
                      key={s}
                      disabled={updatingId === o.id}
                      onClick={() => updateStatus(o.id, s)}
                      className="rounded-pill border-2 border-ink-strong bg-white px-3 py-1 text-xs font-bold hover:bg-lavender disabled:opacity-50"
                    >
                      → {STATUS_LABELS[s]}
                    </button>
                  ))}
                  <span className="ml-auto text-xs text-muted">Ref: {o.reference}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-pill border-2 border-ink-strong px-4 py-1.5 text-xs font-bold ${
        active ? "bg-ink-strong text-white" : "bg-white text-ink-strong"
      }`}
    >
      {children}
    </button>
  );
}
