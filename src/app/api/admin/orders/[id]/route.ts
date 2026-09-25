import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { ORDER_STATUSES, updateOrderStatus, type OrderStatus } from "@/lib/orders";

export const runtime = "nodejs";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) return NextResponse.json({ error: "Bad id" }, { status: 400 });

  const body = (await req.json().catch(() => ({}))) as { status?: OrderStatus; notes?: string };
  if (!body.status || !ORDER_STATUSES.includes(body.status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const order = await updateOrderStatus(numericId, body.status, body.notes);
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ order });
}
