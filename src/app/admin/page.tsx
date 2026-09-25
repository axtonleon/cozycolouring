import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { listOrders } from "@/lib/orders";
import { AdminOrders } from "./AdminOrders";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const orders = await listOrders();
  return <AdminOrders initialOrders={orders} />;
}
