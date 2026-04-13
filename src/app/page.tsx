"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

// ─── Live Ticker (fetches from /api/coins, loops infinitely) ────────────────

interface TickerCoin {
  id: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number | null;
}

function LiveTicker() {
  const [coins, setCoins] = useState<TickerCoin[]>([]);

  useEffect(() => {
    async function fetch_coins() {
      try {
        const res = await fetch("/api/coins");
        if (!res.ok) return;
        const data: TickerCoin[] = await res.json();
        setCoins(data.slice(0, 20));
      } catch { /* silent fail on landing — ticker is decorative */ }
    }
    fetch_coins();
    const interval = setInterval(fetch_coins, 60_000);
    return () => clearInterval(interval);
  }, []);

  function formatPrice(p: number) {
    return p >= 1 
      ? `$${p.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : `$${p.toFixed(4)}`;
  }

  if (coins.length === 0) {
    return <div className="mt-16 w-full h-8 bg-surface-container-lowest border-b border-outline-variant/10" />;
  }

  const tickerItems = coins.map((c) => {
    const pct = c.price_change_percentage_24h ?? 0;
    const isPositive = pct >= 0;
    return (
      <div key={c.id} className="flex items-center gap-2 shrink-0">
        <span className="text-xs font-bold text-on-surface-variant uppercase">{c.symbol}/USD</span>
        <span className={`text-xs font-medium ${isPositive ? "text-secondary" : "text-error"}`}>{formatPrice(c.current_price)}</span>
        <span className={`text-[10px] ${isPositive ? "text-secondary/70" : "text-error/70"}`}>{isPositive ? "+" : ""}{pct.toFixed(1)}%</span>
      </div>
    );
  });

  return (
    <div className="mt-16 w-full overflow-hidden bg-surface-container-lowest py-2 border-b border-outline-variant/10">
      <div className="flex whitespace-nowrap animate-marquee items-center gap-12 px-4">
        {tickerItems}
        {/* Duplicate for seamless loop */}
        {tickerItems}
      </div>
    </div>
  );
}

export default function Home() {
  const { user } = useAuth();
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const bentoVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }
  };

  return (
    <>
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/60 backdrop-blur-xl shadow-[0_4px_24px_rgba(133,173,255,0.04)]">
        <div className="flex justify-between items-center h-16 px-8 w-full max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-black tracking-tighter text-slate-100 uppercase font-headline">COINEXA</Link>
            <nav className="hidden md:flex gap-6 items-center">
              <Link className="text-slate-400 hover:text-slate-200 transition-colors font-headline tracking-tight" href="/market">Market</Link>
              <Link className="text-slate-400 hover:text-slate-200 transition-colors font-headline tracking-tight" href="/dashboard">Dashboard</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <Link href="/dashboard" className="bg-primary-container text-on-primary-container px-5 py-2 rounded-lg font-bold transition-transform active:scale-95 text-sm">Dashboard</Link>
            ) : (
              <>
                <Link href="/login" className="text-slate-400 hover:text-slate-200 transition-colors font-headline tracking-tight text-sm px-4 py-2">Login</Link>
                <Link href="/register" className="bg-primary-container text-on-primary-container px-5 py-2 rounded-lg font-bold transition-transform active:scale-95 text-sm">Get Started</Link>
              </>
            )}
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-500/10 to-transparent h-[1px] w-full absolute bottom-0"></div>
      </nav>

      {/* Live Ticker */}
      <LiveTicker />

      <main className="relative">
        {/* Hero Section */}
        <section className="relative min-h-[calc(100vh-5rem)] flex items-center px-6 md:px-8 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-6xl pointer-events-none opacity-20">
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute top-20 left-10 w-96 h-96 bg-primary blur-[120px] rounded-full"
            ></motion.div>
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
              className="absolute bottom-20 right-10 w-96 h-96 bg-secondary blur-[120px] rounded-full"
            ></motion.div>
          </div>
          <div className="max-w-screen-xl mx-auto flex flex-col items-center text-center relative z-10 py-16 md:py-20">
            
            <motion.div 
              variants={containerVariants} 
              initial="hidden" 
              animate="show" 
              className="flex flex-col items-center"
            >
              <motion.span variants={itemVariants} className="px-4 py-1.5 rounded-full bg-surface-container-high border border-outline-variant/30 text-[10px] uppercase tracking-widest text-primary-fixed mb-6 font-label">The Future of Simulated Trading</motion.span>
              <motion.h1 variants={itemVariants} className="font-headline text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-[0.95] text-on-surface mb-6">
                Master the Market <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">with Zero Risk</span>
              </motion.h1>
              <motion.p variants={itemVariants} className="max-w-2xl text-on-surface-variant text-base md:text-lg font-body mb-8 leading-relaxed">
                Execute high-velocity crypto trades in a professional-grade terminal using real-time market data. No capital required, just raw strategy.
              </motion.p>
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4">
                <Link href="/register" className="bg-secondary text-on-secondary px-8 py-3.5 rounded-lg font-bold font-headline text-base hover:brightness-110 transition-all shadow-xl shadow-secondary/10 active:scale-95">Get Started</Link>
                <Link href="/market" className="bg-surface-container-high text-on-surface border border-outline-variant px-8 py-3.5 rounded-lg font-bold font-headline text-base hover:bg-surface-bright transition-all active:scale-95">View Market</Link>
              </motion.div>
            </motion.div>
            
            {/* Subtle Divider */}
            <motion.div 
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 1 }}
              className="w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent my-16 origin-center"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="text-center max-w-3xl mx-auto mb-10"
            >
              <h2 className="font-headline text-3xl md:text-4xl font-extrabold tracking-tight text-on-surface mb-3">
                Real Markets. Virtual Capital.
              </h2>
              <p className="text-on-surface-variant text-base md:text-lg font-body">
                Step into a high-fidelity institutional trading environment. Experience zero-latency data and deep liquidity without risking your actual portfolio.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 50, rotateX: 20 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 6 }}
              viewport={{ once: true }}
              transition={{ duration: 1, type: "spring", bounce: 0.3 }}
              className="w-full max-w-5xl rounded-xl overflow-hidden glass-panel p-2 transform perspective-1000 shadow-[0_0_50px_rgba(133,173,255,0.2)] hover:shadow-[0_0_60px_rgba(133,173,255,0.3)] transition-shadow duration-700 ease-out flex justify-center mb-8"
            >
              <img 
                alt="Coinexa Terminal Interface" 
                className="w-full rounded-lg shadow-2xl border border-outline-variant/20 max-w-450" 
                src="/dashboard-screen.png" 
              />
            </motion.div>
          </div>
        </section>

        {/* Bento Grid Features */}
        <section className="py-20 md:py-28 px-6 md:px-8 bg-surface-container-low">
          <div className="max-w-screen-xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16 text-center"
            >
              <h2 className="font-headline text-4xl font-bold tracking-tight text-on-surface mb-4">Engineered for Precision</h2>
              <p className="text-on-surface-variant">Professional tools for the modern digital asset trader.</p>
            </motion.div>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-6 auto-rows-auto gap-4"
            >
              
              {/* Large Feature: Real-time Data */}
              <motion.div 
                variants={bentoVariants}
                whileHover={{ scale: 1.02 }}
                className="md:col-span-4 md:row-span-1 glass-panel rounded-xl p-8 flex flex-col justify-between kinetic-gradient hover:bg-surface-bright transition-colors cursor-default relative overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary mb-6">
                    <span className="material-symbols-outlined">bolt</span>
                  </div>
                  <h3 className="font-headline text-2xl font-bold text-on-surface mb-3">Real-time Data (CoinGecko)</h3>
                  <p className="text-on-surface-variant max-w-md">Streaming sub-second latency data for thousands of pairs. Never miss a pivot point with institutional-grade feeds.</p>
                </div>
                <div className="mt-8 flex items-center gap-2 overflow-hidden relative z-10">
                  <div className="h-1 w-full bg-outline-variant/20 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: "0%" }}
                      whileInView={{ width: "66%" }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-primary"
                    ></motion.div>
                  </div>
                  <span className="text-[10px] font-label text-primary">LIVE SYNC</span>
                </div>
              </motion.div>

              {/* Small Feature: Zero Risk */}
              <motion.div 
                variants={bentoVariants}
                whileHover={{ scale: 1.05 }}
                className="md:col-span-2 md:row-span-1 bg-surface-container-high rounded-xl p-8 border border-outline-variant/20 flex flex-col justify-between hover:border-secondary/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary mb-4">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
                </div>
                <div>
                  <h3 className="font-headline text-xl font-bold text-on-surface mb-2">Zero Risk</h3>
                  <p className="text-on-surface-variant text-sm">Experience the thrill of the market with virtual liquidity. Perfect your edge before risking capital.</p>
                </div>
              </motion.div>

              {/* Medium Feature: Dynamic Portfolio */}
              <motion.div 
                variants={bentoVariants}
                whileHover={{ scale: 1.03 }}
                className="md:col-span-3 md:row-span-1 bg-surface-container-high rounded-xl p-8 border border-outline-variant/20 flex items-center gap-6 hover:border-primary/50 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-headline text-xl font-bold text-on-surface mb-2">Dynamic Portfolio</h3>
                  <p className="text-on-surface-variant text-sm">Automated tracking of your simulated performance across all assets. Visualized via heatmaps and risk-adjusted metrics.</p>
                </div>
                <div className="hidden sm:block w-32 h-32 opacity-60">
                  <img 
                    alt="Performance graph" 
                    className="w-full h-full object-cover rounded-lg" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDh6-PVXxFLHO50wUNLJTryZzNGexgT_HSPxhc2RdQQAks1Aa538NzMdW32crJupxOvfjL52JVm0e0JmYStGcToq7Ebz-sDV3t9UFtaFIWYrUxu_YYduzNyk6a3HQzXRPPp01GbQX72Mtt3x6fAGb9pi1uNzh5RGSujAU4Sh3H36_j1GpCo8lN7WansIUtAtMYbhvXxH35yfpjFSdgTgd0dIhcnKajr94AwyvNbW6kJs0asGgCSifnG-D-nA36Lro-m1OirbZIxEdA"
                  />
                </div>
              </motion.div>

              {/* Small Feature: Terminal Mode */}
              <motion.div 
                variants={bentoVariants}
                whileHover={{ scale: 1.03 }}
                className="md:col-span-3 md:row-span-1 glass-panel rounded-xl p-8 flex flex-col justify-center kinetic-gradient border border-outline-variant/30"
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="material-symbols-outlined text-primary text-3xl">terminal</span>
                  <h3 className="font-headline text-xl font-bold text-on-surface">Terminal Mode</h3>
                </div>
                <p className="text-on-surface-variant text-sm">Advanced order types, hotkey execution, and multi-asset layout support designed for high-frequency traders.</p>
                <div className="mt-4 flex gap-2">
                  <span className="px-2 py-1 rounded bg-surface-container-highest text-[10px] text-primary border border-primary/20">LIMIT</span>
                  <span className="px-2 py-1 rounded bg-surface-container-highest text-[10px] text-primary border border-primary/20">MARKET</span>
                  <span className="px-2 py-1 rounded bg-surface-container-highest text-[10px] text-primary border border-primary/20">STOP-LOSS</span>
                </div>
              </motion.div>

            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-28 px-6 md:px-8 relative overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-screen-xl mx-auto rounded-2xl bg-gradient-to-br from-surface-container-highest to-surface-container-lowest p-10 md:p-16 lg:p-20 border border-outline-variant/20 text-center relative z-10 overflow-hidden"
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-secondary/10 blur-[80px] rounded-full"></div>
            <h2 className="font-headline text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 tracking-tight">Ready to Command the Terminal?</h2>
            <p className="text-on-surface-variant text-base md:text-lg mb-10 max-w-xl mx-auto font-body">Join over 50,000 traders refining their strategies daily. Zero commitments, infinite possibilities.</p>
            <Link href="/register" className="inline-block bg-primary text-on-primary px-10 py-4 rounded-lg font-bold font-headline text-lg hover:scale-105 transition-all shadow-xl shadow-primary/20 active:scale-95">Open Free Account</Link>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-5 border-t border-slate-800/30 bg-black">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-6 md:px-8 w-full max-w-screen-2xl mx-auto">
          <div className="text-sm font-bold text-slate-500 font-['Inter']">COINEXA TERMINAL</div>
          <div className="flex gap-6">
            <a className="text-slate-600 hover:text-slate-300 font-['Inter'] text-[10px] uppercase tracking-widest transition-colors" href="#">Terms</a>
            <a className="text-slate-600 hover:text-slate-300 font-['Inter'] text-[10px] uppercase tracking-widest transition-colors" href="#">Privacy</a>
            <a className="text-slate-600 hover:text-slate-300 font-['Inter'] text-[10px] uppercase tracking-widest transition-colors" href="#">API Docs</a>
            <a className="text-slate-600 hover:text-slate-300 font-['Inter'] text-[10px] uppercase tracking-widest transition-colors" href="#">Support</a>
          </div>
          <div className="text-emerald-400 font-['Inter'] text-[10px] uppercase tracking-widest flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
            © 2024 COINEXA TERMINAL. MARKET STATUS: OPERATIONAL
          </div>
        </div>
      </footer>
    </>
  );
}
