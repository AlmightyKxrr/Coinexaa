import { supabase } from "@/lib/supabase";
import { usePortfolioStore } from "@/store/usePortfolioStore";

// ─── Trade Execution Service ───────────────────────────────────────────────────

interface TradeParams {
  userId: string;
  assetSymbol: string;   // CoinGecko id, e.g. "bitcoin"
  amount: number;        // Quantity of the asset
  currentPrice: number;  // Live price at moment of execution
}

/**
 * Execute a BUY order.
 *
 * 1. Validates sufficient USD balance.
 * 2. Deducts `total_cost` from `profiles.virtual_balance`.
 * 3. Upserts (increment) the `portfolio` row.
 * 4. Inserts a `transactions` record.
 * 5. Refreshes the Zustand store.
 */
export async function executeBuy({ userId, assetSymbol, amount, currentPrice }: TradeParams): Promise<void> {
  const totalCost = amount * currentPrice;

  // ── 1. Validate balance ───────────────────────────────────────────────────
  const { usdBalance } = usePortfolioStore.getState();
  if (usdBalance < totalCost) {
    throw new Error(
      `Insufficient balance. You need $${totalCost.toFixed(2)} but only have $${usdBalance.toFixed(2)}.`
    );
  }

  // ── 2. Deduct from profiles ───────────────────────────────────────────────
  const { error: balanceError } = await supabase.rpc("deduct_balance", {
    p_user_id: userId,
    p_amount: totalCost,
  });

  // Fallback if the RPC doesn't exist: use a direct update
  if (balanceError?.message?.includes("function") || balanceError?.code === "42883") {
    const newBalance = usdBalance - totalCost;
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ virtual_balance: newBalance })
      .eq("id", userId);
    if (updateError) throw updateError;
  } else if (balanceError) {
    throw balanceError;
  }

  // ── 3. Upsert portfolio (increment amount) ────────────────────────────────
  // Check if holding exists
  const { data: existing } = await supabase
    .from("portfolio")
    .select("id, total_amount")
    .eq("user_id", userId)
    .eq("asset_symbol", assetSymbol)
    .maybeSingle();

  if (existing) {
    const newAmount = Number(existing.total_amount) + amount;
    const { error: updateError } = await supabase
      .from("portfolio")
      .update({ total_amount: newAmount })
      .eq("id", existing.id);
    if (updateError) throw updateError;
  } else {
    const { error: insertError } = await supabase
      .from("portfolio")
      .insert({ user_id: userId, asset_symbol: assetSymbol, total_amount: amount });
    if (insertError) throw insertError;
  }

  // ── 4. Record transaction ─────────────────────────────────────────────────
  const { error: txError } = await supabase.from("transactions").insert({
    user_id: userId,
    type: "BUY",
    asset_symbol: assetSymbol,
    amount,
    execution_price: currentPrice,
    total_cost: totalCost,
  });
  if (txError) throw txError;

  // ── 5. Refresh store ──────────────────────────────────────────────────────
  await usePortfolioStore.getState().fetchUserPortfolio(userId);
}

/**
 * Execute a SELL order.
 *
 * 1. Validates the user holds enough of the asset.
 * 2. Subtracts from the `portfolio` row (or deletes it if fully sold).
 * 3. Credits `profiles.virtual_balance` with the proceeds.
 * 4. Inserts a `transactions` record.
 * 5. Refreshes the Zustand store.
 */
export async function executeSell({ userId, assetSymbol, amount, currentPrice }: TradeParams): Promise<void> {
  const totalProceeds = amount * currentPrice;

  // ── 1. Validate holdings ──────────────────────────────────────────────────
  const { assets } = usePortfolioStore.getState();
  const holding = assets.find((a) => a.asset_symbol === assetSymbol);
  const heldAmount = holding ? holding.total_amount : 0;

  if (heldAmount < amount) {
    throw new Error(
      `Insufficient holdings. You hold ${heldAmount.toFixed(6)} ${assetSymbol} but tried to sell ${amount.toFixed(6)}.`
    );
  }

  // ── 2. Update portfolio ───────────────────────────────────────────────────
  const remainingAmount = heldAmount - amount;

  if (remainingAmount <= 0) {
    // Fully sold — remove row
    const { error: deleteError } = await supabase
      .from("portfolio")
      .delete()
      .eq("user_id", userId)
      .eq("asset_symbol", assetSymbol);
    if (deleteError) throw deleteError;
  } else {
    const { error: updateError } = await supabase
      .from("portfolio")
      .update({ total_amount: remainingAmount })
      .eq("user_id", userId)
      .eq("asset_symbol", assetSymbol);
    if (updateError) throw updateError;
  }

  // ── 3. Credit balance ─────────────────────────────────────────────────────
  const { usdBalance } = usePortfolioStore.getState();
  const newBalance = usdBalance + totalProceeds;

  const { error: balanceError } = await supabase
    .from("profiles")
    .update({ virtual_balance: newBalance })
    .eq("id", userId);
  if (balanceError) throw balanceError;

  // ── 4. Record transaction ─────────────────────────────────────────────────
  const { error: txError } = await supabase.from("transactions").insert({
    user_id: userId,
    type: "SELL",
    asset_symbol: assetSymbol,
    amount,
    execution_price: currentPrice,
    total_cost: totalProceeds,
  });
  if (txError) throw txError;

  // ── 5. Refresh store ──────────────────────────────────────────────────────
  await usePortfolioStore.getState().fetchUserPortfolio(userId);
}
