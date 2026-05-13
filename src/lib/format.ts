// ─── Centralized Formatting Helpers ─────────────────────────────────────────

/**
 * Format a number as a compact currency string (e.g. $1.23T, $4.56B).
 */
export function formatCurrency(value: number): string {
  if (value >= 1_000_000_000_000) return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Format a coin price with dynamic precision.
 * Prices >= $1 get 2 decimals, sub-dollar prices get 6.
 */
export function formatPrice(price: number): string {
  if (price >= 1) return `$${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return `$${price.toFixed(6)}`;
}

/**
 * Format a number as full USD currency (e.g. $1,234.56).
 */
export function formatUSD(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
}
