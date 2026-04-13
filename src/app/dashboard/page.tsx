"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { motion, Variants } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { usePortfolioStore } from "@/store/usePortfolioStore";
import { useCoinGecko } from "@/hooks/useCoinGecko";
import { executeBuy, executeSell, TRADING_FEE_RATE } from "@/lib/tradeService";
import type { Transaction } from "@/types";

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatUSD(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  // ── Auth state (from global context) ───────────────────────────────────────
  const { user, signOut } = useAuth();
  const userId = user?.id ?? null;

  // ── Zustand store ─────────────────────────────────────────────────────────
  const { usdBalance, assets, livePrices, totalNetAssetValue, isLoading: portfolioLoading, fetchUserPortfolio } = usePortfolioStore();

  // ── CoinGecko prices ──────────────────────────────────────────────────────
  const { coins } = useCoinGecko();

  // ── Trade terminal state ──────────────────────────────────────────────────
  const [tradeType, setTradeType] = useState<"BUY" | "SELL">("BUY");
  const [selectedAsset, setSelectedAsset] = useState("bitcoin");
  const [tradeAmount, setTradeAmount] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [showAssetDropdown, setShowAssetDropdown] = useState(false);
  const [sliderPct, setSliderPct] = useState(0);

  // ── Transaction history ───────────────────────────────────────────────────
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // ── Derived values ────────────────────────────────────────────────────────
  const currentPrice = livePrices[selectedAsset] ?? 0;
  const parsedAmount = parseFloat(tradeAmount) || 0;
  const estimatedTotal = parsedAmount * currentPrice;
  const estimatedFee = estimatedTotal * TRADING_FEE_RATE;
  const estimatedTotalWithFee = tradeType === "BUY" ? estimatedTotal + estimatedFee : estimatedTotal - estimatedFee;
  const selectedCoin = coins.find((c) => c.id === selectedAsset);

  // How much of the selected asset the user currently holds
  const heldAmount = useMemo(() => {
    const holding = assets.find((a) => a.asset_symbol === selectedAsset);
    return holding ? holding.total_amount : 0;
  }, [assets, selectedAsset]);

  // ── Slider handler (auto-fills amount) ────────────────────────────────────
  function handleSliderChange(pct: number) {
    setSliderPct(pct);
    if (tradeType === "BUY") {
      // pct% of USD balance → how many coins can you buy
      if (currentPrice > 0) {
        const usdToSpend = (pct / 100) * usdBalance;
        const coinAmount = usdToSpend / currentPrice;
        setTradeAmount(coinAmount > 0 ? coinAmount.toFixed(6).replace(/\.?0+$/, "") : "");
      }
    } else {
      // pct% of held coins → how many coins to sell
      const coinAmount = (pct / 100) * heldAmount;
      setTradeAmount(coinAmount > 0 ? coinAmount.toFixed(6).replace(/\.?0+$/, "") : "");
    }
  }

  // Portfolio allocation for pie chart
  const allocations = useMemo(() => {
    if (assets.length === 0 || totalNetAssetValue === 0) return [];
    return assets
      .map((a) => {
        const price = livePrices[a.asset_symbol] ?? 0;
        const value = a.total_amount * price;
        const pct = (value / totalNetAssetValue) * 100;
        const coin = coins.find((c) => c.id === a.asset_symbol);
        return { symbol: a.asset_symbol, name: coin?.name ?? a.asset_symbol, image: coin?.image ?? "", value, pct };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [assets, livePrices, totalNetAssetValue, coins]);

  const cashPct = totalNetAssetValue > 0 ? (usdBalance / totalNetAssetValue) * 100 : 100;

  // ── P&L Calculations ──────────────────────────────────────────────────────
  const INITIAL_BALANCE = 10_000;

  const pnlMetrics = useMemo(() => {
    // Cost basis: total spent on BUYs for assets we still hold
    const costBasisByAsset: Record<string, number> = {};
    const totalBoughtByAsset: Record<string, number> = {};

    // Sum up all buys to get average cost per asset
    for (const tx of transactions) {
      if (tx.type === "BUY") {
        costBasisByAsset[tx.asset_symbol] = (costBasisByAsset[tx.asset_symbol] ?? 0) + tx.total_cost;
        totalBoughtByAsset[tx.asset_symbol] = (totalBoughtByAsset[tx.asset_symbol] ?? 0) + tx.amount;
      }
    }

    // Average buy price per asset
    const avgBuyPrice: Record<string, number> = {};
    for (const sym of Object.keys(totalBoughtByAsset)) {
      avgBuyPrice[sym] = totalBoughtByAsset[sym] > 0 ? costBasisByAsset[sym] / totalBoughtByAsset[sym] : 0;
    }

    // Unrealized P&L: (current_price - avg_buy_price) × held_amount
    let unrealizedPnL = 0;
    let totalCostBasis = 0;
    for (const asset of assets) {
      const currentP = livePrices[asset.asset_symbol] ?? 0;
      const avgP = avgBuyPrice[asset.asset_symbol] ?? currentP;
      const costBasis = avgP * asset.total_amount;
      totalCostBasis += costBasis;
      unrealizedPnL += (currentP - avgP) * asset.total_amount;
    }

    // Realized P&L: for sells, (sell_price - avg_buy_price) × amount
    let realizedPnL = 0;
    for (const tx of transactions) {
      if (tx.type === "SELL") {
        const avgP = avgBuyPrice[tx.asset_symbol] ?? 0;
        realizedPnL += (tx.execution_price - avgP) * tx.amount;
      }
    }

    // Total P&L = current NAV - initial balance
    const totalPnL = totalNetAssetValue - INITIAL_BALANCE;
    const totalPnLPct = INITIAL_BALANCE > 0 ? (totalPnL / INITIAL_BALANCE) * 100 : 0;

    // Current holdings value
    const holdingsValue = totalNetAssetValue - usdBalance;

    return { unrealizedPnL, realizedPnL, totalPnL, totalPnLPct, holdingsValue, totalCostBasis };
  }, [transactions, assets, livePrices, totalNetAssetValue, usdBalance]);

  // ── Auth check + initial fetch ────────────────────────────────────────────
  useEffect(() => {
    async function init() {
      if (!userId) return;
      await fetchUserPortfolio(userId);
      // Fetch ALL transactions (needed for P&L calculation)
      const { data: txns } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (txns) setTransactions(txns as Transaction[]);
    }
    init();
  }, [userId, fetchUserPortfolio]);

  // ── Trade execution handler ───────────────────────────────────────────────
  async function handleTrade() {
    if (!userId) {
      toast.error("Please log in to execute trades.");
      return;
    }
    if (parsedAmount <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }
    if (currentPrice <= 0) {
      toast.error("Price data not available. Please wait for sync.");
      return;
    }

    setIsExecuting(true);
    try {
      if (tradeType === "BUY") {
        await executeBuy({ userId, assetSymbol: selectedAsset, amount: parsedAmount, currentPrice });
        toast.success(`Bought ${parsedAmount} ${selectedCoin?.symbol?.toUpperCase() ?? selectedAsset} at ${formatUSD(currentPrice)}`);
      } else {
        await executeSell({ userId, assetSymbol: selectedAsset, amount: parsedAmount, currentPrice });
        toast.success(`Sold ${parsedAmount} ${selectedCoin?.symbol?.toUpperCase() ?? selectedAsset} at ${formatUSD(currentPrice)}`);
      }
      setTradeAmount("");

      // Refresh transactions
      const { data: txns } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10);
      if (txns) setTransactions(txns as Transaction[]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Trade execution failed.";
      toast.error(message);
    } finally {
      setIsExecuting(false);
    }
  }

  // ── Animation variants ────────────────────────────────────────────────────
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };
  const slideRightVariants: Variants = {
    hidden: { opacity: 0, x: -30 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 200, damping: 20 } },
  };
  const slideLeftVariants: Variants = {
    hidden: { opacity: 0, x: 30 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 200, damping: 20 } },
  };

  // ── NAV display ───────────────────────────────────────────────────────────
  const navWhole = Math.floor(totalNetAssetValue).toLocaleString("en-US");
  const navDecimal = (totalNetAssetValue % 1).toFixed(2).slice(1);

  // ── Rendering ─────────────────────────────────────────────────────────────
  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-slate-950/60 backdrop-blur-xl shadow-[0_4px_24px_rgba(133,173,255,0.04)]">
        <div className="flex justify-between items-center h-16 px-8 w-full max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-black tracking-tighter text-slate-100 uppercase font-headline">COINEXA</Link>
            <nav className="hidden md:flex gap-6 items-center">
              <Link className="text-slate-400 hover:text-slate-200 transition-colors font-headline tracking-tight" href="/market">Market</Link>
              <Link className="text-blue-400 font-bold border-b-2 border-blue-400 pb-1 font-headline tracking-tight" href="/dashboard">Dashboard</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {userId ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-on-surface-variant font-label uppercase tracking-widest">Balance:</span>
                <span className="text-sm font-bold text-secondary">{formatUSD(usdBalance)}</span>
                <button onClick={signOut} className="ml-2 text-xs text-slate-400 hover:text-error transition-colors uppercase tracking-widest font-label">Logout</button>
              </div>
            ) : (
              <>
                <Link href="/login" className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors active:scale-95">Login</Link>
                <Link href="/register" className="px-6 py-2 bg-primary text-on-primary-container font-bold rounded-lg hover:bg-primary-fixed transition-all active:scale-95">Get Started</Link>
              </>
            )}
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-500/10 to-transparent h-[1px] w-full absolute bottom-0"></div>
      </nav>

      <main className="pt-24 pb-12 px-8 max-w-screen-2xl mx-auto space-y-6 flex-grow w-full overflow-hidden">
        <motion.section
          initial="hidden"
          animate="show"
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
        >

          {/* ── Total Net Asset Value ────────────────────────────────────── */}
          <motion.div variants={itemVariants} className="lg:col-span-12 glass-panel rounded-xl kinetic-gradient p-12 text-center flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA4xhzbo6GhTKpUj715OwmRTWb1SxsJNqfHd62cDP1JhIHdfV8_NscRzVUAI5RhDkmBQAm3r7ZCX1fI7Y2qsKjqCJZv8Ow5XebF8Tmw69j-G_2aPIUSGIENspu2zciTzOLVDU3pi3Y3JQR-bQ_Y8Tl9PQewbuv09ARyJrrIKdg1ZNL_kxcJb5kInhROccjDDSqdB0U8cgkynpN53aTpFDxGRZi2NoWMJZM0v_0F6JUnkL5ahBntVibkETMHvW6nCz9CLMxcItny9Dg')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
            <span className="text-on-surface-variant font-label text-xs uppercase tracking-[0.2em] mb-4">Total Net Asset Value</span>
            {userId ? (
              <h1 className="font-headline text-6xl md:text-8xl font-extrabold tracking-tighter text-on-surface mb-4">
                ${navWhole}<span className="text-primary-dim">{navDecimal}</span>
              </h1>
            ) : (
              <div className="mb-4">
                <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tighter text-on-surface mb-2">Sign in to view</h1>
                <p className="text-on-surface-variant text-sm">Connect your account to start trading with $10,000 virtual capital.</p>
              </div>
            )}
            {userId && (
              <div className="flex items-center gap-3 bg-secondary/10 px-4 py-2 rounded-full border border-secondary/20">
                <span className="material-symbols-outlined text-secondary text-sm">trending_up</span>
                <span className="text-secondary font-bold text-lg">{assets.length} assets</span>
                <span className="text-on-surface-variant text-sm font-medium">in portfolio</span>
              </div>
            )}
          </motion.div>

          {/* ── Portfolio + Metrics (left) ────────────────────────────────── */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Portfolio Allocation */}
            <motion.div variants={slideRightVariants} className="bg-surface-container-high rounded-xl p-6 border border-outline-variant/10">
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-headline text-lg font-bold tracking-tight">Portfolio Allocation</h2>
                <span className="material-symbols-outlined text-on-surface-variant">pie_chart</span>
              </div>
              {allocations.length > 0 ? (
                <div className="space-y-4">
                  {allocations.map((a) => (
                    <div key={a.symbol} className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        {a.image ? (
                          <img src={a.image} alt={a.name} className="w-6 h-6 rounded-full" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-outline-variant"></div>
                        )}
                        <span className="text-sm font-medium capitalize">{a.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-on-surface-variant">{formatUSD(a.value)}</span>
                        <span className="text-sm font-bold">{a.pct.toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-surface-bright border border-outline-variant flex items-center justify-center">
                        <span className="text-[10px] font-bold text-on-surface-variant">$</span>
                      </div>
                      <span className="text-sm font-medium">Cash (USD)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-on-surface-variant">{formatUSD(usdBalance)}</span>
                      <span className="text-sm font-bold">{cashPct.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-on-surface-variant text-sm">
                  {userId ? "No holdings yet. Execute your first trade!" : "Sign in to view allocations."}
                </div>
              )}
            </motion.div>

            {/* P&L Metrics */}
            <motion.div variants={slideRightVariants} className="bg-surface-container-high rounded-xl p-6 border border-outline-variant/10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-headline text-lg font-bold tracking-tight">Profit & Loss</h2>
                <span className="material-symbols-outlined text-on-surface-variant">analytics</span>
              </div>
              <div className="space-y-5">
                {/* Total P&L */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-on-surface-variant uppercase tracking-widest font-label">Total P&L</span>
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl font-headline font-bold ${pnlMetrics.totalPnL >= 0 ? "text-secondary" : "text-error"}`}>
                      {pnlMetrics.totalPnL >= 0 ? "+" : ""}{formatUSD(pnlMetrics.totalPnL)}
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${pnlMetrics.totalPnLPct >= 0 ? "bg-secondary/10 text-secondary" : "bg-error/10 text-error"}`}>
                      {pnlMetrics.totalPnLPct >= 0 ? "+" : ""}{pnlMetrics.totalPnLPct.toFixed(2)}%
                    </span>
                  </div>
                </div>

                <div className="h-[1px] bg-outline-variant/10"></div>

                {/* Unrealized P&L */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-on-surface-variant uppercase tracking-widest font-label">Unrealized P&L</span>
                  <span className={`text-lg font-headline font-bold ${pnlMetrics.unrealizedPnL >= 0 ? "text-secondary" : "text-error"}`}>
                    {pnlMetrics.unrealizedPnL >= 0 ? "+" : ""}{formatUSD(pnlMetrics.unrealizedPnL)}
                  </span>
                  <span className="text-[10px] text-on-surface-variant">Open positions vs avg cost</span>
                </div>

                {/* Realized P&L */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-on-surface-variant uppercase tracking-widest font-label">Realized P&L</span>
                  <span className={`text-lg font-headline font-bold ${pnlMetrics.realizedPnL >= 0 ? "text-secondary" : "text-error"}`}>
                    {pnlMetrics.realizedPnL >= 0 ? "+" : ""}{formatUSD(pnlMetrics.realizedPnL)}
                  </span>
                  <span className="text-[10px] text-on-surface-variant">Closed trade gains/losses</span>
                </div>

                <div className="h-[1px] bg-outline-variant/10"></div>

                {/* Summary row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-on-surface-variant uppercase tracking-widest font-label">Holdings Value</span>
                    <span className="text-sm font-headline font-bold">{formatUSD(pnlMetrics.holdingsValue)}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-on-surface-variant uppercase tracking-widest font-label">Cost Basis</span>
                    <span className="text-sm font-headline font-bold">{formatUSD(pnlMetrics.totalCostBasis)}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-on-surface-variant uppercase tracking-widest font-label">Cash</span>
                    <span className="text-sm font-headline font-bold">{formatUSD(usdBalance)}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-on-surface-variant uppercase tracking-widest font-label">Trades</span>
                    <span className="text-sm font-headline font-bold">{transactions.length}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── Interactive Terminal (right) ──────────────────────────────── */}
          <motion.div variants={slideLeftVariants} className="lg:col-span-4">
            <div className="bg-surface-container-highest rounded-xl p-6 border border-outline-variant/20 shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="material-symbols-outlined text-6xl">account_balance_wallet</span>
              </div>
              <h2 className="font-headline text-lg font-bold tracking-tight mb-6">Interactive Terminal</h2>

              {/* BUY / SELL Toggle */}
              <div className="flex bg-surface-container-low p-1 rounded-lg mb-6">
                <button
                  onClick={() => { setTradeType("BUY"); setSliderPct(0); setTradeAmount(""); }}
                  className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${tradeType === "BUY" ? "bg-secondary text-on-secondary shadow-lg" : "text-on-surface-variant hover:text-on-surface"}`}
                >BUY</button>
                <button
                  onClick={() => { setTradeType("SELL"); setSliderPct(0); setTradeAmount(""); }}
                  className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${tradeType === "SELL" ? "bg-error text-white shadow-lg" : "text-on-surface-variant hover:text-on-surface"}`}
                >SELL</button>
              </div>

              <div className="space-y-4">
                {/* Asset Pair Selector */}
                <div className="space-y-1.5 relative">
                  <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-label ml-1">Asset Pair</label>
                  <div
                    onClick={() => setShowAssetDropdown(!showAssetDropdown)}
                    className="bg-surface-bright p-3 rounded-lg flex items-center justify-between cursor-pointer hover:bg-surface-container-high transition-colors border border-outline-variant/10"
                  >
                    <div className="flex items-center gap-3">
                      {selectedCoin && (
                        <img src={selectedCoin.image} alt={selectedCoin.name} className="w-6 h-6 rounded-full" />
                      )}
                      <span className="font-bold">{selectedCoin?.symbol?.toUpperCase() ?? selectedAsset.toUpperCase()} / USD</span>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant">expand_more</span>
                  </div>

                  {/* Dropdown */}
                  {showAssetDropdown && (
                    <div className="absolute top-full left-0 w-full mt-1 bg-surface-container-highest border border-outline-variant/20 rounded-lg shadow-xl z-20 max-h-48 overflow-y-auto">
                      {coins.slice(0, 20).map((coin) => (
                        <button
                          key={coin.id}
                          onClick={() => { setSelectedAsset(coin.id); setShowAssetDropdown(false); setSliderPct(0); setTradeAmount(""); }}
                          className="w-full px-3 py-2 flex items-center gap-3 hover:bg-surface-bright transition-colors text-left"
                        >
                          <img src={coin.image} alt={coin.name} className="w-5 h-5 rounded-full" />
                          <span className="text-sm font-medium">{coin.name}</span>
                          <span className="text-[10px] text-on-surface-variant uppercase ml-auto">{coin.symbol}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Amount + Slider */}
                <div className="space-y-3">
                  {/* Available balance / holdings indicator */}
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-label ml-1">Amount</label>
                    <span className="text-[10px] text-on-surface-variant font-label">
                      {tradeType === "BUY" ? (
                        <>Available: <span className="text-secondary font-bold">{formatUSD(usdBalance)}</span></>
                      ) : (
                        <>Holding: <span className="text-primary font-bold">{heldAmount.toFixed(6)} {selectedCoin?.symbol?.toUpperCase() ?? "—"}</span></>
                      )}
                    </span>
                  </div>

                  {/* Amount input */}
                  <div className="bg-surface-bright p-3 rounded-lg flex items-center border border-outline-variant/10 focus-within:border-primary/50 transition-all">
                    <input
                      className="outline-none bg-transparent border-none focus:ring-0 w-full p-0 font-headline font-bold text-xl placeholder:text-on-surface-variant/30"
                      placeholder="0.00"
                      type="number"
                      step="any"
                      min="0"
                      value={tradeAmount}
                      onChange={(e) => {
                        setTradeAmount(e.target.value);
                        // Sync slider from manual input
                        const val = parseFloat(e.target.value) || 0;
                        if (tradeType === "BUY" && currentPrice > 0) {
                          const usdUsed = val * currentPrice;
                          setSliderPct(usdBalance > 0 ? Math.min(100, (usdUsed / usdBalance) * 100) : 0);
                        } else if (tradeType === "SELL" && heldAmount > 0) {
                          setSliderPct(Math.min(100, (val / heldAmount) * 100));
                        }
                      }}
                    />
                    <span className="text-xs font-bold text-on-surface-variant ml-2 uppercase">{selectedCoin?.symbol ?? "—"}</span>
                  </div>

                  {/* Percentage quick buttons */}
                  <div className="flex gap-2">
                    {[25, 50, 75, 100].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => handleSliderChange(pct)}
                        className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md border transition-all ${
                          Math.round(sliderPct) === pct
                            ? tradeType === "BUY"
                              ? "bg-secondary/20 text-secondary border-secondary/40"
                              : "bg-error/20 text-error border-error/40"
                            : "bg-surface-container-low text-on-surface-variant border-outline-variant/10 hover:border-outline-variant/30"
                        }`}
                      >
                        {pct === 100 ? "MAX" : `${pct}%`}
                      </button>
                    ))}
                  </div>

                  {/* Range slider */}
                  <div className="relative pt-1 pb-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="0.5"
                      value={sliderPct}
                      onChange={(e) => handleSliderChange(parseFloat(e.target.value))}
                      className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, ${tradeType === "BUY" ? "var(--color-secondary)" : "var(--color-error)"} ${sliderPct}%, var(--color-surface-container-low) ${sliderPct}%)`,
                      }}
                    />
                    <div className="flex justify-between mt-1">
                      <span className="text-[9px] text-on-surface-variant/50">0%</span>
                      <span className={`text-[10px] font-bold ${tradeType === "BUY" ? "text-secondary" : "text-error"}`}>
                        {sliderPct.toFixed(0)}%
                      </span>
                      <span className="text-[9px] text-on-surface-variant/50">100%</span>
                    </div>
                  </div>
                </div>

                {/* Cost breakdown */}
                <div className="bg-surface-container-low p-4 rounded-lg space-y-2 border border-outline-variant/5">
                  <div className="flex justify-between text-[10px] uppercase tracking-widest text-on-surface-variant font-label">
                    <span>Estimated Price</span>
                    <span className="text-on-surface">{currentPrice > 0 ? formatUSD(currentPrice) : "—"}</span>
                  </div>
                  <div className="flex justify-between text-[10px] uppercase tracking-widest text-on-surface-variant font-label">
                    <span>Subtotal</span>
                    <span className="text-on-surface">{formatUSD(estimatedTotal)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] uppercase tracking-widest text-on-surface-variant font-label">
                    <span>Trading Fee ({(TRADING_FEE_RATE * 100).toFixed(2)}%)</span>
                    <span className="text-tertiary">{estimatedFee > 0 ? `-${formatUSD(estimatedFee)}` : "—"}</span>
                  </div>
                  <div className="h-[1px] bg-outline-variant/10 my-1"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase">{tradeType === "BUY" ? "Total Cost" : "You Receive"}</span>
                    <span className={`text-lg font-headline font-extrabold ${tradeType === "BUY" ? "text-secondary" : "text-error"}`}>
                      {formatUSD(estimatedTotalWithFee)}
                    </span>
                  </div>
                </div>

                {/* Execute Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isExecuting || !userId}
                  onClick={handleTrade}
                  className={`w-full py-4 font-bold rounded-lg transition-all uppercase tracking-widest text-xs disabled:opacity-50 disabled:cursor-not-allowed ${
                    tradeType === "BUY"
                      ? "bg-secondary text-on-secondary shadow-[0_0_20px_rgba(105,246,184,0.3)]"
                      : "bg-error text-white shadow-[0_0_20px_rgba(255,100,100,0.3)]"
                  }`}
                >
                  {isExecuting
                    ? "Executing…"
                    : !userId
                    ? "Sign in to Trade"
                    : `Execute ${tradeType} Order`}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* ── Recent Execution History ──────────────────────────────────── */}
          <motion.div variants={itemVariants} className="lg:col-span-12">
            <div className="bg-surface-container-high rounded-xl overflow-hidden border border-outline-variant/10">
              <div className="px-6 py-4 bg-surface-bright flex justify-between items-center">
                <h2 className="font-headline font-bold tracking-tight">Recent Execution History</h2>
                <div className="flex gap-4">
                  <button className="text-[10px] uppercase tracking-widest font-label text-primary font-bold">Export CSV</button>
                  <button className="text-[10px] uppercase tracking-widest font-label text-on-surface-variant">View All</button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant border-b border-outline-variant/5">
                      <th className="px-6 py-4 font-label">Timestamp</th>
                      <th className="px-6 py-4 font-label">Type</th>
                      <th className="px-6 py-4 font-label">Asset</th>
                      <th className="px-6 py-4 font-label text-right">Size</th>
                      <th className="px-6 py-4 font-label text-right">Execution Price</th>
                      <th className="px-6 py-4 font-label text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/5">
                    {transactions.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant text-sm">
                          {userId ? "No trades yet. Execute your first order!" : "Sign in to view your trade history."}
                        </td>
                      </tr>
                    )}
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-surface-bright transition-colors group">
                        <td className="px-6 py-4 text-xs font-medium text-on-surface-variant">
                          {new Date(tx.created_at).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                            tx.type === "BUY"
                              ? "bg-secondary/10 text-secondary border-secondary/20"
                              : "bg-tertiary-container/10 text-tertiary border-tertiary-container/20"
                          }`}>{tx.type}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-sm capitalize">{tx.asset_symbol}</span>
                        </td>
                        <td className="px-6 py-4 text-right font-headline font-bold text-sm">{tx.amount.toFixed(4)}</td>
                        <td className="px-6 py-4 text-right font-headline font-bold text-sm">{formatUSD(tx.execution_price)}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></div>
                            <span className="text-[10px] font-bold text-secondary uppercase">Filled</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </motion.section>
      </main>

      <footer className="w-full py-4 border-t border-slate-800/30 bg-black mt-auto">
        <div className="flex justify-between items-center px-8 w-full max-w-screen-2xl mx-auto">
          <div className="text-sm font-bold text-slate-500 font-['Inter'] uppercase">COINEXA TERMINAL</div>
          <div className="flex gap-6">
            <a className="text-slate-600 hover:text-slate-300 transition-colors text-[10px] uppercase tracking-widest font-['Inter']" href="#">Terms</a>
            <a className="text-slate-600 hover:text-slate-300 transition-colors text-[10px] uppercase tracking-widest font-['Inter']" href="#">Privacy</a>
            <a className="text-slate-600 hover:text-slate-300 transition-colors text-[10px] uppercase tracking-widest font-['Inter']" href="#">API Docs</a>
            <a className="text-slate-600 hover:text-slate-300 transition-colors text-[10px] uppercase tracking-widest font-['Inter']" href="#">Support</a>
          </div>
          <div className="text-emerald-400 text-[10px] uppercase tracking-widest font-['Inter'] flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
            © 2024 COINEXA TERMINAL. MARKET STATUS: OPERATIONAL
          </div>
        </div>
      </footer>
    </>
  );
}
