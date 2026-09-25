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

type ViewMode = "cards" | "table";

export function AdminOrders({ initialOrders }: { initialOrders: Order[] }) {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [view, setView] = useState<ViewMode>("cards");
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

  async function updateStatus(order: Order, next: OrderStatus) {
    const ok = window.confirm(
      `Change status for ${order.buyer_name} (${order.book_title})\n\nFrom:  ${STATUS_LABELS[order.status]}\nTo:    ${STATUS_LABELS[next]}\n\nProceed?`,
    );
    if (!ok) return;
    setUpdatingId(order.id);
    const res = await fetch(`/api/admin/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    if (res.ok) {
      const data = (await res.json()) as { order: Order };
      setOrders((prev) => prev.map((o) => (o.id === order.id ? data.order : o)));
    } else {
      window.alert("Update failed. Try again.");
    }
    setUpdatingId(null);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  function exportCsv() {
    const rows = ordersToCsv(filtered);
    const blob = new Blob([rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);
    const scope = filter === "all" ? "all" : filter;
    a.href = url;
    a.download = `cozycolouring-orders-${scope}-${stamp}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-bg-alt p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-ink-strong">Orders</h1>
            <p className="text-sm text-muted">Track payments and hand-delivery status.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportCsv}
              disabled={filtered.length === 0}
              className="rounded-pill border-2 border-ink-strong bg-white px-4 py-2 text-sm font-bold disabled:opacity-50"
              title="Download the current view as a CSV file (opens in Excel)"
            >
              Export CSV
            </button>
            <div className="flex overflow-hidden rounded-pill border-2 border-ink-strong">
              <ViewToggle active={view === "cards"} onClick={() => setView("cards")}>
                Cards
              </ViewToggle>
              <ViewToggle active={view === "table"} onClick={() => setView("table")}>
                Table
              </ViewToggle>
            </div>
            <button
              onClick={logout}
              className="rounded-pill border-2 border-ink-strong bg-white px-4 py-2 text-sm font-bold"
            >
              Sign out
            </button>
          </div>
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
        ) : view === "cards" ? (
          <CardsView orders={filtered} updatingId={updatingId} onUpdate={updateStatus} />
        ) : (
          <TableView orders={filtered} updatingId={updatingId} onUpdate={updateStatus} />
        )}
      </div>
    </main>
  );
}

function CardsView({
  orders,
  updatingId,
  onUpdate,
}: {
  orders: Order[];
  updatingId: number | null;
  onUpdate: (order: Order, next: OrderStatus) => void;
}) {
  return (
    <div className="space-y-4">
      {orders.map((o) => (
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
                onClick={() => onUpdate(o, s)}
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
  );
}

function TableView({
  orders,
  updatingId,
  onUpdate,
}: {
  orders: Order[];
  updatingId: number | null;
  onUpdate: (order: Order, next: OrderStatus) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border-2 border-ink-strong bg-white shadow-card">
      <table className="w-full min-w-[1100px] border-collapse text-sm">
        <thead className="bg-lavender text-ink-strong">
          <tr>
            <Th>Date</Th>
            <Th>Book</Th>
            <Th>Buyer</Th>
            <Th>Phone</Th>
            <Th>Email</Th>
            <Th>Delivery address</Th>
            <Th>Amount</Th>
            <Th>Status</Th>
            <Th>Reference</Th>
            <Th>Change status</Th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o, i) => (
            <tr key={o.id} className={i % 2 === 0 ? "bg-white" : "bg-bg-alt"}>
              <Td>{new Date(o.created_at).toLocaleString()}</Td>
              <Td>
                <div className="font-bold text-ink-strong">{o.book_title}</div>
                <div className="text-xs text-muted">{o.book_collection}</div>
              </Td>
              <Td className="font-bold text-ink-strong">{o.buyer_name}</Td>
              <Td>
                <a href={`tel:${o.buyer_phone}`} className="underline">
                  {o.buyer_phone}
                </a>
              </Td>
              <Td>
                <a href={`mailto:${o.buyer_email}`} className="underline">
                  {o.buyer_email}
                </a>
              </Td>
              <Td className="max-w-xs whitespace-pre-wrap">{o.delivery_address}</Td>
              <Td className="font-bold">{formatNaira(o.amount_kobo / 100)}</Td>
              <Td>
                <span
                  className={`inline-block rounded-pill px-2 py-0.5 text-xs font-extrabold uppercase tracking-wider text-ink-strong ${STATUS_COLORS[o.status]}`}
                >
                  {STATUS_LABELS[o.status]}
                </span>
              </Td>
              <Td className="text-xs text-muted">{o.reference}</Td>
              <Td>
                <select
                  value={o.status}
                  disabled={updatingId === o.id}
                  onChange={(e) => {
                    const next = e.target.value as OrderStatus;
                    if (next !== o.status) onUpdate(o, next);
                  }}
                  className="rounded-lg border-2 border-ink-strong bg-white px-2 py-1 text-xs font-bold disabled:opacity-50"
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="border-b-2 border-ink-strong px-3 py-2 text-left text-xs font-extrabold uppercase tracking-widest">
      {children}
    </th>
  );
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={`border-b border-ink-strong/10 px-3 py-2 align-top ${className}`}>{children}</td>
  );
}

function ViewToggle({
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
      className={`px-4 py-2 text-sm font-bold ${active ? "bg-ink-strong text-white" : "bg-white text-ink-strong"}`}
    >
      {children}
    </button>
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

function ordersToCsv(orders: Order[]): string {
  const headers = [
    "Date",
    "Book",
    "Collection",
    "Buyer name",
    "Phone",
    "Email",
    "Delivery address",
    "Amount (NGN)",
    "Status",
    "Reference",
  ];
  const rows = orders.map((o) => [
    new Date(o.created_at).toLocaleString(),
    o.book_title,
    o.book_collection,
    o.buyer_name,
    o.buyer_phone,
    o.buyer_email,
    o.delivery_address,
    (o.amount_kobo / 100).toString(),
    STATUS_LABELS[o.status],
    o.reference,
  ]);
  return [headers, ...rows].map((r) => r.map(csvCell).join(",")).join("\r\n");
}

function csvCell(value: string): string {
  const needsQuoting = /[",\r\n]/.test(value);
  const escaped = value.replace(/"/g, '""');
  return needsQuoting ? `"${escaped}"` : escaped;
}
