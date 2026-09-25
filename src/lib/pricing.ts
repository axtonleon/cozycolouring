export const PRICE_NGN = 10000;

export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`;
}
