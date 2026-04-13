// ─── Coinexa Shared TypeScript Interfaces ─────────────────────────────────────

/**
 * CoinGecko `/coins/markets` response shape (subset of fields we use).
 */
export interface CoinMarketData {
  id: string;                        // e.g. "bitcoin"
  symbol: string;                    // e.g. "btc"
  name: string;                      // e.g. "Bitcoin"
  image: string;                     // URL to coin icon
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number | null;
  circulating_supply: number;
  ath: number;
  ath_change_percentage: number;
}

/**
 * A single asset in the user's simulated portfolio.
 * Maps 1:1 to a row in the Supabase `portfolio` table.
 */
export interface PortfolioAsset {
  id: string;
  user_id: string;
  asset_symbol: string;              // CoinGecko `id`, e.g. "bitcoin"
  total_amount: number;
}

/**
 * Trade execution record.
 * Maps 1:1 to a row in the Supabase `transactions` table.
 */
export interface Transaction {
  id: string;
  user_id: string;
  type: "BUY" | "SELL";
  asset_symbol: string;
  amount: number;
  execution_price: number;
  total_cost: number;
  fee?: number;
  created_at: string;
}

/**
 * User profile from the Supabase `profiles` table.
 */
export interface Profile {
  id: string;
  virtual_balance: number;
}
