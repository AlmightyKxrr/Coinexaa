"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useCoinGecko } from "@/hooks/useCoinGecko";
import { containerVariants, popVariants } from "@/lib/animations";
import { formatCurrency, formatPrice } from "@/lib/format";

// ─── Component ─────────────────────────────────────────────────────────────────

export default function MarketTerminal() {
  const { coins, isLoading, error, lastUpdated } = useCoinGecko();
  const [searchQuery, setSearchQuery] = useState("");

  // Client-side search — filter the ALREADY-FETCHED array, no new API call
  const filteredCoins = useMemo(() => {
    if (!searchQuery.trim()) return coins;
    const q = searchQuery.toLowerCase();
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(q) ||
        coin.symbol.toLowerCase().includes(q) ||
        coin.id.toLowerCase().includes(q)
    );
  }, [coins, searchQuery]);

  // ── Derived hero stats from live data ─────────────────────────────────────

  const totalVolume = coins.reduce((sum, c) => sum + (c.total_volume ?? 0), 0);
  const btcDominance = useMemo(() => {
    const btc = coins.find((c) => c.id === "bitcoin");
    const totalMcap = coins.reduce((sum, c) => sum + (c.market_cap ?? 0), 0);
    if (!btc || totalMcap === 0) return 0;
    return ((btc.market_cap / totalMcap) * 100).toFixed(1);
  }, [coins]);

  return (
    <>
      <Navbar />

      <main className="flex-grow pt-24 pb-12 px-4 md:px-8 max-w-screen-2xl mx-auto w-full">
        {/* Market Overview Hero Section */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <motion.div variants={popVariants} className="col-span-1 md:col-span-2 relative overflow-hidden rounded-xl p-8 glass-panel">
            <div className="relative z-10">
              <h1 className="text-4xl md:text-5xl font-black font-headline tracking-tighter text-on-surface mb-2 uppercase">Live Terminal</h1>
              <p className="text-on-surface-variant max-w-lg mb-6">Real-time market data powered by CoinGecko. Tracking the top 100 assets by market capitalization.</p>
              <div className="flex gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 font-label">24h Vol</span>
                  <span className="text-xl font-headline font-bold text-on-surface">
                    {coins.length > 0 ? formatCurrency(totalVolume) : "—"}
                  </span>
                </div>
                <div className="w-px h-10 bg-outline-variant/30"></div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 font-label">BTC Dom</span>
                  <span className="text-xl font-headline font-bold text-on-surface">
                    {coins.length > 0 ? `${btcDominance}%` : "—"}
                  </span>
                </div>
                <div className="w-px h-10 bg-outline-variant/30"></div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 font-label">Status</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
                    <span className="text-sm font-headline font-bold text-secondary">
                      {lastUpdated ? "LIVE" : "CONNECTING"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 opacity-10">
              <span className="material-symbols-outlined text-[200px]">monitoring</span>
            </div>
          </motion.div>

          <motion.div variants={popVariants} className="rounded-xl overflow-hidden glass-panel relative group">
            <div className="w-full h-full min-h-[200px] bg-gradient-to-br from-primary/20 via-surface-container to-secondary/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-dim to-transparent p-6 flex flex-col justify-end">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(105,246,184,0.6)]"></span>
                <span className="text-[10px] font-bold uppercase tracking-tighter text-secondary font-label">
                  {lastUpdated
                    ? `Last sync: ${lastUpdated.toLocaleTimeString()}`
                    : "Syncing…"}
                </span>
              </div>
              <h3 className="text-xl font-bold font-headline leading-tight">
                {coins.length > 0
                  ? `Tracking ${coins.length} assets in real-time`
                  : "Initializing data feed…"}
              </h3>
            </div>
          </motion.div>
        </motion.div>

        {/* Professional Data Table */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant/10"
        >
          {/* Table Controls */}
          <div className="p-4 border-b border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-4 bg-surface-container">
            <div className="flex items-center gap-2">
              <div className="flex bg-surface-container-highest rounded-lg p-1">
                <button className="px-4 py-1 rounded text-xs font-bold bg-surface-bright text-on-surface">All Assets</button>
              </div>
            </div>
            <div className="relative w-full md:w-80">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg" aria-hidden="true">search</span>
              <input
                id="market-search"
                className="w-full bg-surface-container-highest outline-none border-outline-variant/30 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 rounded-xl py-2 pl-10 text-sm transition-all"
                placeholder="Search for coins, symbols, or pairs..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search coins"
              />
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="px-6 py-3 bg-error/10 border-b border-error/20 text-error text-xs font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-sm" aria-hidden="true">warning</span>
              {error}
            </div>
          )}

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-high/50 text-on-surface-variant text-[11px] uppercase tracking-widest font-label border-b border-outline-variant/10">
                <tr>
                  <th className="px-6 py-4 font-semibold">#</th>
                  <th className="px-6 py-4 font-semibold">Asset</th>
                  <th className="px-6 py-4 font-semibold">Price</th>
                  <th className="px-6 py-4 font-semibold">24h Change</th>
                  <th className="px-6 py-4 font-semibold">Market Cap</th>
                  <th className="px-6 py-4 font-semibold">Volume (24h)</th>
                  <th className="px-6 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {/* Loading skeleton */}
                {isLoading && coins.length === 0 && (
                  <>
                    {Array.from({ length: 8 }).map((_, i) => (
                      <tr key={`skeleton-${i}`} className="animate-pulse">
                        <td className="px-6 py-4"><div className="h-3 w-4 bg-surface-bright rounded"></div></td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-surface-bright rounded-full"></div>
                            <div className="space-y-1">
                              <div className="h-3 w-16 bg-surface-bright rounded"></div>
                              <div className="h-2 w-8 bg-surface-bright/50 rounded"></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4"><div className="h-4 w-20 bg-surface-bright rounded"></div></td>
                        <td className="px-6 py-4"><div className="h-4 w-12 bg-surface-bright rounded"></div></td>
                        <td className="px-6 py-4"><div className="h-3 w-16 bg-surface-bright rounded"></div></td>
                        <td className="px-6 py-4"><div className="h-3 w-16 bg-surface-bright rounded"></div></td>
                        <td className="px-6 py-4 text-right"><div className="h-7 w-16 bg-surface-bright rounded ml-auto"></div></td>
                      </tr>
                    ))}
                  </>
                )}

                {/* Empty search result */}
                {!isLoading && filteredCoins.length === 0 && searchQuery && (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <span className="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-2 block" aria-hidden="true">search_off</span>
                      <p className="text-on-surface-variant text-sm">No assets match &ldquo;{searchQuery}&rdquo;</p>
                    </td>
                  </tr>
                )}

                {/* Live data rows */}
                {filteredCoins.map((coin) => {
                  const isPositive = (coin.price_change_percentage_24h ?? 0) >= 0;
                  return (
                    <tr key={coin.id} className="hover:bg-surface-bright transition-colors group">
                      <td className="px-6 py-4 text-sm font-label text-on-surface-variant">{coin.market_cap_rank}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={coin.image}
                            alt={coin.name}
                            className="w-8 h-8 rounded-full group-hover:scale-110 transition-transform"
                            loading="lazy"
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{coin.name}</span>
                            <span className="text-[11px] text-on-surface-variant font-medium uppercase">{coin.symbol}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-headline font-bold text-on-surface">{formatPrice(coin.current_price)}</td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-bold flex items-center gap-1 ${isPositive ? "text-secondary" : "text-error"}`}>
                          <span className="material-symbols-outlined text-xs" aria-hidden="true">
                            {isPositive ? "arrow_upward" : "arrow_downward"}
                          </span>
                          {Math.abs(coin.price_change_percentage_24h ?? 0).toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-on-surface-variant">{formatCurrency(coin.market_cap)}</td>
                      <td className="px-6 py-4 text-sm font-medium text-on-surface-variant">{formatCurrency(coin.total_volume)}</td>
                      <td className="px-6 py-4 text-right">
                        <Link href="/dashboard">
                          <button className="bg-secondary text-on-secondary px-4 py-1.5 rounded text-xs font-black uppercase tracking-tight active:scale-95 transition-transform">Trade</button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination/Footer of Table */}
          <div className="p-4 bg-surface-container-lowest flex justify-between items-center text-xs text-on-surface-variant font-label uppercase tracking-widest">
            <span>
              {searchQuery
                ? `Showing ${filteredCoins.length} of ${coins.length} assets`
                : `Showing ${coins.length} assets`}
            </span>
            <div className="flex items-center gap-3">
              {lastUpdated && (
                <span className="text-[10px] text-on-surface-variant/50 normal-case">
                  Updated {lastUpdated.toLocaleTimeString()}
                </span>
              )}
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></div>
                <span className="text-secondary text-[10px]">LIVE</span>
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      <Footer />
    </>
  );
}
