"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { motion, Variants } from "framer-motion";
import { useCoinGecko } from "@/hooks/useCoinGecko";
import { useAuth } from "@/context/AuthContext";
import type { CoinMarketData } from "@/types";

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatCurrency(value: number): string {
  if (value >= 1_000_000_000_000) return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatPrice(price: number): string {
  if (price >= 1) return `$${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return `$${price.toFixed(6)}`;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function MarketTerminal() {
  const { coins, isLoading, error, lastUpdated } = useCoinGecko();
  const { user } = useAuth();
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

  // ── Animation variants ────────────────────────────────────────────────────

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const rowVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  const popVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

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
      {/* Top Navigation Bar */}
      <header className="fixed top-0 w-full z-50 bg-slate-950/60 backdrop-blur-xl shadow-[0_4px_24px_rgba(133,173,255,0.04)]">
        <div className="flex justify-between items-center h-16 px-8 w-full max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-black tracking-tighter text-slate-100 uppercase font-headline">COINEXA</Link>
            <nav className="md:flex gap-6 items-center">
              <Link className="text-blue-400 font-bold border-b-2 border-blue-400 pb-1 font-headline tracking-tight transition-all" href="/market">Market</Link>
              <Link className="text-slate-400 hover:text-slate-200 transition-colors font-headline tracking-tight" href="/dashboard">Dashboard</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-surface-container-highest px-3 py-1.5 rounded-lg border border-outline-variant/20">
              <span className="material-symbols-outlined text-on-surface-variant text-sm mr-2">search</span>
              <input
                className="bg-transparent border-none focus:ring-0 text-sm p-0 w-48 text-on-surface placeholder:text-on-surface-variant/50 outline-none"
                placeholder="Quick search..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="text-[10px] text-outline px-1.5 py-0.5 rounded border border-outline/30 ml-2">⌘K</span>
            </div>
            {user ? (
              <Link href="/dashboard" className="bg-blue-400 text-on-primary-container px-5 py-2 rounded-xl text-sm font-bold active:scale-95 transition-transform">Dashboard</Link>
            ) : (
              <>
                <Link href="/login" className="text-slate-400 hover:text-slate-200 text-sm font-medium transition-colors">Login</Link>
                <Link href="/register" className="bg-blue-400 text-on-primary-container px-5 py-2 rounded-xl text-sm font-bold active:scale-95 transition-transform">Get Started</Link>
              </>
            )}
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-500/10 to-transparent h-[1px] w-full absolute bottom-0"></div>
      </header>

      <main className="flex-grow pt-24 pb-12 px-4 md:px-8 max-w-screen-2xl mx-auto w-full">
        {/* Market Overview Hero Section */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <motion.div variants={popVariants} className="col-span-1 md:col-span-2 relative overflow-hidden rounded-xl p-8 glass-panel terminal-header-sheen">
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
            <img className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" alt="abstract digital artwork representing cryptographic data" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpAHoD2mSaU_B5eXwGPzrOonnKJfoekO_ew_xMqkEU3IAdR88C-YGIiR3Sj5jkAHnDqQZUus0UgTs__C7Tx4uIn7z5pRICEOWPjH_fG9mw6iie-j-xJ8qtSULbvAxCCxuwu9EPuUQrpJDq1V0qu8nETlYgDx3hbLHf8FnHVLZ9GHmAyTVTY27GFeUaRPpo4MQWNzOLBhuDSMAXqab962E7xlmkA02jsxOyi3MN7opnjoaVDHKQbjd7tMOjdYSQo-g752M5Wk9U-uo" />
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
              <button className="bg-surface-bright text-primary px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 relative overflow-hidden group">
                <span className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform"></span>
                <span className="material-symbols-outlined text-sm relative z-10">filter_alt</span>
                <span className="relative z-10">Filters</span>
              </button>
              <div className="flex bg-surface-container-highest rounded-lg p-1">
                <button className="px-4 py-1 rounded text-xs font-bold bg-surface-bright text-on-surface">All Assets</button>
                <button className="px-4 py-1 rounded text-xs font-bold text-on-surface-variant hover:text-on-surface">Spot</button>
                <button className="px-4 py-1 rounded text-xs font-bold text-on-surface-variant hover:text-on-surface">Futures</button>
              </div>
            </div>
            <div className="relative w-full md:w-80">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
              <input
                className="w-full bg-surface-container-highest outline-none border-outline-variant/30 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 rounded-xl py-2 pl-10 text-sm transition-all"
                placeholder="Search for coins, symbols, or pairs..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="px-6 py-3 bg-error/10 border-b border-error/20 text-error text-xs font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">warning</span>
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
                      <span className="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-2 block">search_off</span>
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
                          <span className="material-symbols-outlined text-xs">
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

      {/* Global Footer */}
      <footer className="w-full py-4 border-t border-slate-800/30 bg-black mt-auto">
        <div className="flex justify-between items-center px-8 w-full">
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-widest font-body">COINEXA</span>
            <span className="text-emerald-400 font-['Inter'] text-[10px] uppercase tracking-widest">© 2024 COINEXA TERMINAL. MARKET STATUS: OPERATIONAL</span>
          </div>
          <div className="flex gap-6">
            <a className="font-['Inter'] text-[10px] uppercase tracking-widest text-slate-600 hover:text-slate-300 transition-all" href="#">Terms</a>
            <a className="font-['Inter'] text-[10px] uppercase tracking-widest text-slate-600 hover:text-slate-300 transition-all" href="#">Privacy</a>
            <a className="font-['Inter'] text-[10px] uppercase tracking-widest text-slate-600 hover:text-slate-300 transition-all" href="#">API Docs</a>
            <a className="font-['Inter'] text-[10px] uppercase tracking-widest text-slate-600 hover:text-slate-300 transition-all" href="#">Support</a>
          </div>
        </div>
      </footer>

      {/* Bottom Mobile Nav */}
      <div className="md:hidden fixed bottom-0 w-full bg-slate-950/90 backdrop-blur-xl border-t border-slate-800 flex justify-around py-3 px-4 z-50">
        <button className="flex flex-col items-center gap-1 text-blue-400">
          <span className="material-symbols-outlined">monitoring</span>
          <span className="text-[10px] uppercase font-bold">Market</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-500">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[10px] uppercase font-bold">Dash</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-500">
          <span className="material-symbols-outlined">account_balance_wallet</span>
          <span className="text-[10px] uppercase font-bold">Wallet</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-500">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] uppercase font-bold">Profile</span>
        </button>
      </div>
    </>
  );
}
