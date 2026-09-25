import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let _sql: NeonQueryFunction<false, false> | null = null;
let _initPromise: Promise<void> | null = null;

export function getSql(): NeonQueryFunction<false, false> {
  if (!_sql) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    _sql = neon(url);
  }
  return _sql;
}

export async function ensureSchema(): Promise<void> {
  if (_initPromise) return _initPromise;
  const sql = getSql();
  _initPromise = (async () => {
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id BIGSERIAL PRIMARY KEY,
        reference TEXT UNIQUE NOT NULL,
        book_id TEXT NOT NULL,
        book_title TEXT NOT NULL,
        book_collection TEXT NOT NULL,
        buyer_name TEXT NOT NULL,
        buyer_phone TEXT NOT NULL,
        buyer_email TEXT NOT NULL,
        delivery_address TEXT NOT NULL,
        amount_kobo INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        notes TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status)`;
    await sql`CREATE INDEX IF NOT EXISTS orders_created_idx ON orders(created_at DESC)`;
  })();
  return _initPromise;
}
