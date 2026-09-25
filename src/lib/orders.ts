import { ensureSchema, getSql } from "./db";

export type OrderStatus =
  | "pending"
  | "paid"
  | "packed"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "paid",
  "packed",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

export interface Order {
  id: number;
  reference: string;
  book_id: string;
  book_title: string;
  book_collection: string;
  buyer_name: string;
  buyer_phone: string;
  buyer_email: string;
  delivery_address: string;
  amount_kobo: number;
  status: OrderStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderInput {
  reference: string;
  bookId: string;
  bookTitle: string;
  bookCollection: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  deliveryAddress: string;
  amountKobo: number;
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  await ensureSchema();
  const sql = getSql();
  const rows = (await sql`
    INSERT INTO orders (
      reference, book_id, book_title, book_collection,
      buyer_name, buyer_phone, buyer_email, delivery_address, amount_kobo
    ) VALUES (
      ${input.reference}, ${input.bookId}, ${input.bookTitle}, ${input.bookCollection},
      ${input.buyerName}, ${input.buyerPhone}, ${input.buyerEmail}, ${input.deliveryAddress}, ${input.amountKobo}
    )
    RETURNING *
  `) as unknown as Order[];
  return rows[0];
}

export async function getOrderByReference(reference: string): Promise<Order | null> {
  await ensureSchema();
  const sql = getSql();
  const rows = (await sql`SELECT * FROM orders WHERE reference = ${reference} LIMIT 1`) as unknown as Order[];
  return rows[0] ?? null;
}

export async function updateOrderStatus(
  id: number,
  status: OrderStatus,
  notes?: string,
): Promise<Order | null> {
  await ensureSchema();
  const sql = getSql();
  const rows = (await sql`
    UPDATE orders
    SET status = ${status},
        notes = COALESCE(${notes ?? null}, notes),
        updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `) as unknown as Order[];
  return rows[0] ?? null;
}

export async function markPaidByReference(reference: string): Promise<Order | null> {
  await ensureSchema();
  const sql = getSql();
  const rows = (await sql`
    UPDATE orders
    SET status = 'paid', updated_at = NOW()
    WHERE reference = ${reference} AND status = 'pending'
    RETURNING *
  `) as unknown as Order[];
  return rows[0] ?? null;
}

export async function listOrders(): Promise<Order[]> {
  await ensureSchema();
  const sql = getSql();
  return (await sql`SELECT * FROM orders ORDER BY created_at DESC LIMIT 500`) as unknown as Order[];
}
