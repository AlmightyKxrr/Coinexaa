"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import dynamic from "next/dynamic";
import TrueFocus from "@/components/effects/TrueFocus";

const LiquidEther = dynamic(() => import("@/components/effects/LiquidEther"), { ssr: false });

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
        <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 md:px-8 overflow-hidden">
          {/* LiquidEther fluid background */}
          <div className="absolute inset-0 z-0 opacity-40 pointer-events-auto">
            <LiquidEther
              colors={['#1a3a6e', '#85adff', '#69f6b8', '#2a5298']}
              mouseForce={15}
              cursorSize={120}
              resolution={0.4}
              autoDemo={true}
              autoSpeed={0.3}
              autoIntensity={1.8}
              takeoverDuration={0.3}
              autoResumeDelay={2000}
              autoRampDuration={0.8}
            />
          </div>
          <div className="max-w-screen-xl mx-auto flex flex-col items-center text-center relative z-10 -mt-6 md:-mt-10">
            
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
          </div>
        </section>

        {/* Split Layout — Terminal Showcase */}
        <section className="py-16 md:py-24 px-6 md:px-8 overflow-hidden">
          <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            
            {/* Left Content: Text & Features */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7 }}
              className="flex flex-col text-left"
            >
              <span className="px-4 py-1.5 rounded-full bg-surface-container border border-outline-variant/30 text-[10px] uppercase tracking-widest text-secondary mb-6 font-label w-max">Trading Terminal</span>
              <h2 className="font-headline text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-on-surface mb-4 leading-tight">
                Real Markets.<br/> 
                <span className="text-primary inline-block mt-2">
                  <TrueFocus 
                    sentence="Virtual Capital."
                    manualMode={false}
                    blurAmount={4}
                    borderColor="#85adff"
                    glowColor="rgba(133, 173, 255, 0.4)"
                    animationDuration={0.8}
                    pauseBetweenAnimations={1.5}
                  />
                </span>
              </h2>
              <p className="text-on-surface-variant text-base md:text-lg font-body mb-8 max-w-lg">
                Step into a high-fidelity institutional trading environment. Experience zero-latency data and deep liquidity without risking your actual portfolio.
              </p>

              <div className="flex flex-col gap-5">
                {/* Feature 1 */}
                <div className="flex gap-5 group cursor-default">
                  <div className="w-10 h-10 shrink-0 rounded-lg bg-surface-container-high border border-outline-variant/30 group-hover:bg-primary/10 group-hover:border-primary/30 transition-colors duration-300 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined">bolt</span>
                  </div>
                  <div>
                    <h4 className="text-on-surface font-bold text-base mb-0.5 font-headline">Zero-Latency Execution</h4>
                    <p className="text-on-surface-variant text-sm leading-relaxed">Execute simulated orders flawlessly using real-time market data matching.</p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="flex gap-5 group cursor-default">
                  <div className="w-10 h-10 shrink-0 rounded-lg bg-surface-container-high border border-outline-variant/30 group-hover:bg-secondary/10 group-hover:border-secondary/30 transition-colors duration-300 text-secondary flex items-center justify-center">
                    <span className="material-symbols-outlined">monitoring</span>
                  </div>
                  <div>
                    <h4 className="text-on-surface font-bold text-base mb-0.5 font-headline">Advanced P&L Metrics</h4>
                    <p className="text-on-surface-variant text-sm leading-relaxed">Track your unrealized and realized returns instantly as prices fluctuate.</p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="flex gap-5 group cursor-default">
                  <div className="w-10 h-10 shrink-0 rounded-lg bg-surface-container-high border border-outline-variant/30 group-hover:bg-tertiary/10 group-hover:border-tertiary/30 transition-colors duration-300 text-tertiary flex items-center justify-center">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
                  </div>
                  <div>
                    <h4 className="text-on-surface font-bold text-base mb-0.5 font-headline">Absolute Zero Risk</h4>
                    <p className="text-on-surface-variant text-sm leading-relaxed">Refine your trading edge without ever risking your real-world capital.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Content: Media/Screenshot */}
            <motion.div 
              initial={{ opacity: 0, x: 30, rotateY: 15 }}
              whileInView={{ opacity: 1, x: 0, rotateY: -8 }}
              viewport={{ once: true }}
              transition={{ duration: 1, type: "spring", bounce: 0.3 }}
              className="w-full relative transform perspective-1000 mt-10 lg:mt-0"
            >
              {/* Background glow behind image */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>
              
              {/* Image Container */}
              <div className="w-fit mx-auto rounded-2xl overflow-hidden glass-panel p-2 shadow-[0_0_60px_rgba(133,173,255,0.15)] border border-outline-variant/30 hover:border-primary/40 transition-colors duration-700 relative z-10 bg-surface-dim">
                <div className="absolute inset-0 bg-gradient-to-tr from-surface-dim/40 to-transparent z-10 pointer-events-none" />
                <img 
                  alt="Coinexa Terminal Interface" 
                  className="w-auto h-auto max-w-full max-h-[400px] md:max-h-[500px] lg:max-h-[600px] object-contain rounded-xl shadow-2xl relative z-0" 
                  src="/dashboard-screen.png" 
                />
              </div>

              {/* Decorative floating mock-notification */}
              <motion.div 
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 bg-surface-container-highest border border-outline-variant/40 rounded-xl p-3 shadow-2xl hidden sm:flex items-center gap-3 z-20"
              >
                <div className="w-10 h-10 rounded-full bg-secondary/15 text-secondary flex items-center justify-center border border-secondary/20">
                  <span className="material-symbols-outlined text-[18px]">check</span>
                </div>
                <div>
                  <div className="text-[10px] text-on-surface-variant font-label uppercase tracking-[0.15em] mb-1">Order Filled</div>
                  <div className="text-sm font-bold text-on-surface flex items-center gap-2">
                    Bought 0.75 BTC <span className="text-secondary text-xs">@ $64,210</span>
                  </div>
                </div>
              </motion.div>

              {/* Decorative floating mock-notification 2 */}
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -top-3 -right-3 md:-top-5 md:-right-5 bg-surface-container-highest border border-outline-variant/40 rounded-xl p-3 shadow-2xl hidden md:flex items-center gap-3 z-20"
              >
                <div className="w-10 h-10 rounded-full bg-tertiary/15 text-tertiary flex items-center justify-center border border-tertiary/20">
                  <span className="material-symbols-outlined text-[18px]">show_chart</span>
                </div>
                <div>
                  <div className="text-[10px] text-on-surface-variant font-label uppercase tracking-[0.15em] mb-1">Profit Alert</div>
                  <div className="text-sm font-bold text-on-surface flex items-center gap-2">
                    SOL/USD <span className="text-secondary text-xs">+8.4%</span>
                  </div>
                </div>
              </motion.div>

            </motion.div>

          </div>
        </section>

        {/* Bento Grid Features */}
        <section className="py-16 md:py-24 px-6 md:px-8 bg-surface-container-low">
          <div className="max-w-screen-xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8 text-center"
            >
              <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tight text-on-surface mb-3">Engineered for Precision</h2>
              <p className="text-on-surface-variant text-base">Professional tools for the modern digital asset trader.</p>
            </motion.div>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 md:grid-cols-6 auto-rows-auto gap-3"
            >
              
              {/* Large Feature: Real-time Data */}
              <motion.div 
                variants={bentoVariants}
                whileHover={{ scale: 1.02 }}
                className="md:col-span-4 md:row-span-1 glass-panel rounded-xl p-6 flex flex-col justify-between kinetic-gradient hover:bg-surface-bright transition-colors cursor-default relative overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary mb-4">
                    <span className="material-symbols-outlined">bolt</span>
                  </div>
                  <h3 className="font-headline text-2xl font-bold text-on-surface mb-3">Real-time Data (CoinGecko)</h3>
                  <p className="text-on-surface-variant max-w-md">Streaming sub-second latency data for thousands of pairs. Never miss a pivot point with institutional-grade feeds.</p>
                </div>
                <div className="mt-5 flex items-center gap-2 overflow-hidden relative z-10">
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
                className="md:col-span-2 md:row-span-1 bg-surface-container-high rounded-xl p-6 border border-outline-variant/20 flex flex-col justify-between hover:border-secondary/50 transition-colors"
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
                className="md:col-span-3 md:row-span-1 bg-surface-container-high rounded-xl p-6 border border-outline-variant/20 flex items-center gap-5 hover:border-primary/50 transition-colors"
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
                className="md:col-span-3 md:row-span-1 glass-panel rounded-xl p-6 flex flex-col justify-center kinetic-gradient border border-outline-variant/30"
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
        <section className="py-16 md:py-24 px-6 md:px-8 relative overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-screen-lg mx-auto rounded-2xl bg-gradient-to-br from-surface-container-highest to-surface-container-lowest p-8 md:p-12 border border-outline-variant/20 text-center relative z-10 overflow-hidden"
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-secondary/10 blur-[80px] rounded-full"></div>
            <h2 className="font-headline text-3xl md:text-4xl font-extrabold mb-3 tracking-tight">Ready to Command the Terminal?</h2>
            <p className="text-on-surface-variant text-base md:text-lg mb-8 max-w-xl mx-auto font-body">Join over 50,000 traders refining their strategies daily. Zero commitments, infinite possibilities.</p>
            <Link href="/register" className="inline-block bg-primary text-on-primary px-10 py-3.5 rounded-lg font-bold font-headline text-base hover:scale-105 transition-all shadow-xl shadow-primary/20 active:scale-95">Open Free Account</Link>
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
