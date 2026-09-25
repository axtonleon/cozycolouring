import { NextResponse } from "next/server";
import { setAdminCookie } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { password?: string };
  if (!body.password || body.password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }
  await setAdminCookie();
  return NextResponse.json({ ok: true });
}
