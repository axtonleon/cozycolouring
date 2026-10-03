import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { listDeliveryRates, NIGERIAN_STATES } from "@/lib/delivery";
import { DeliveryRatesEditor } from "./DeliveryRatesEditor";

export const dynamic = "force-dynamic";

export default async function DeliveryRatesPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const rates = await listDeliveryRates("Nigeria");
  return <DeliveryRatesEditor country="Nigeria" states={[...NIGERIAN_STATES]} initialRates={rates} />;
}
