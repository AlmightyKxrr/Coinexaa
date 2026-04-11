"use client";

import Link from "next/link";

export default function Home() {
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
            <Link href="/login" className="text-slate-400 hover:text-slate-200 transition-colors font-headline tracking-tight text-sm px-4 py-2">Login</Link>
            <Link href="/register" className="bg-primary-container text-on-primary-container px-5 py-2 rounded-lg font-bold transition-transform active:scale-95 text-sm">Get Started</Link>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-500/10 to-transparent h-[1px] w-full absolute bottom-0"></div>
      </nav>

      {/* Live Ticker (Custom Component) */}
      <div className="mt-16 w-full overflow-hidden bg-surface-container-lowest py-2 border-b border-outline-variant/10">
        <div className="flex whitespace-nowrap animate-marquee items-center gap-12 px-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-on-surface-variant">BTC/USD</span>
            <span className="text-xs font-medium text-secondary">$64,231.50</span>
            <span className="text-[10px] text-secondary-fixed-dim">+2.4%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-on-surface-variant">ETH/USD</span>
            <span className="text-xs font-medium text-secondary">$3,452.12</span>
            <span className="text-[10px] text-secondary-fixed-dim">+1.8%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-on-surface-variant">SOL/USD</span>
            <span className="text-xs font-medium text-error">$142.88</span>
            <span className="text-[10px] text-error-dim">-0.4%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-on-surface-variant">BNB/USD</span>
            <span className="text-xs font-medium text-secondary">$588.20</span>
            <span className="text-[10px] text-secondary-fixed-dim">+0.9%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-on-surface-variant">XRP/USD</span>
            <span className="text-xs font-medium text-on-surface-variant">$0.61</span>
            <span className="text-[10px] text-on-surface-variant">0.0%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-on-surface-variant">ADA/USD</span>
            <span className="text-xs font-medium text-error">$0.45</span>
            <span className="text-[10px] text-error-dim">-1.2%</span>
          </div>
        </div>
      </div>

      <main className="relative">
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 px-8 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-6xl pointer-events-none opacity-20">
            <div className="absolute top-20 left-10 w-96 h-96 bg-primary blur-[120px] rounded-full"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary blur-[120px] rounded-full"></div>
          </div>
          <div className="max-w-screen-xl mx-auto flex flex-col items-center text-center relative z-10">
            <span className="px-4 py-1.5 rounded-full bg-surface-container-high border border-outline-variant/30 text-[10px] uppercase tracking-widest text-primary-fixed mb-8 font-label">The Future of Simulated Trading</span>
            <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-none text-on-surface mb-6">
              Master the Market <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">with Zero Risk</span>
            </h1>
            <p className="max-w-2xl text-on-surface-variant text-lg md:text-xl font-body mb-10 leading-relaxed">
              Execute high-velocity crypto trades in a professional-grade terminal using real-time market data. No capital required, just raw strategy.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href="/register" className="bg-secondary text-on-secondary px-8 py-4 rounded-lg font-bold font-headline text-lg hover:brightness-110 transition-all shadow-xl shadow-secondary/10 active:scale-95">Get Started</Link>
              <Link href="/market" className="bg-surface-container-high text-on-surface border border-outline-variant px-8 py-4 rounded-lg font-bold font-headline text-lg hover:bg-surface-bright transition-all active:scale-95">View Market</Link>
            </div>
            
            {/* Subtle Divider */}
            <div className="w-full max-w-6xl h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent my-24"></div>
            
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-4">
                Real Markets. Virtual Capital.
              </h2>
              <p className="text-on-surface-variant text-lg md:text-xl font-body">
                Step into a high-fidelity institutional trading environment. Experience zero-latency data and deep liquidity without risking your actual portfolio.
              </p>
            </div>

            <div className="w-full max-w-5xl rounded-xl overflow-hidden glass-panel p-2 transform perspective-1000 rotate-x-6 rotate-y--12 shadow-[0_0_50px_rgba(133,173,255,0.2)] hover:rotate-0 transition-transform duration-700 ease-out flex justify-center">
              <img 
                alt="Coinexa Terminal Interface" 
                className="w-full rounded-lg shadow-2xl border border-outline-variant/20 max-w-700" 
                src="/dashboard-screen.png" 
              />
            </div>
          </div>
        </section>

        {/* Bento Grid Features */}
        <section className="py-24 px-8 bg-surface-container-low">
          <div className="max-w-screen-xl mx-auto">
            <div className="mb-16 text-center">
              <h2 className="font-headline text-4xl font-bold tracking-tight text-on-surface mb-4">Engineered for Precision</h2>
              <p className="text-on-surface-variant">Professional tools for the modern digital asset trader.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-6 grid-rows-2 gap-4 h-auto md:h-[600px]">
              
              {/* Large Feature: Real-time Data */}
              <div className="md:col-span-4 md:row-span-1 glass-panel rounded-xl p-8 flex flex-col justify-between kinetic-gradient group hover:bg-surface-bright transition-all cursor-default relative overflow-hidden">
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary mb-6">
                    <span className="material-symbols-outlined">bolt</span>
                  </div>
                  <h3 className="font-headline text-2xl font-bold text-on-surface mb-3">Real-time Data (CoinGecko)</h3>
                  <p className="text-on-surface-variant max-w-md">Streaming sub-second latency data for thousands of pairs. Never miss a pivot point with institutional-grade feeds.</p>
                </div>
                <div className="mt-8 flex items-center gap-2 overflow-hidden relative z-10">
                  <div className="h-1 w-full bg-outline-variant/20 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-2/3"></div>
                  </div>
                  <span className="text-[10px] font-label text-primary">LIVE SYNC</span>
                </div>
              </div>

              {/* Small Feature: Zero Risk */}
              <div className="md:col-span-2 md:row-span-1 bg-surface-container-high rounded-xl p-8 border border-outline-variant/20 flex flex-col justify-between group hover:border-secondary/50 transition-all">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary mb-4">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
                </div>
                <div>
                  <h3 className="font-headline text-xl font-bold text-on-surface mb-2">Zero Risk</h3>
                  <p className="text-on-surface-variant text-sm">Experience the thrill of the market with virtual liquidity. Perfect your edge before risking capital.</p>
                </div>
              </div>

              {/* Medium Feature: Dynamic Portfolio */}
              <div className="md:col-span-3 md:row-span-1 bg-surface-container-high rounded-xl p-8 border border-outline-variant/20 flex items-center gap-6 group hover:border-primary/50 transition-all">
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
              </div>

              {/* Small Feature: Terminal Mode */}
              <div className="md:col-span-3 md:row-span-1 glass-panel rounded-xl p-8 flex flex-col justify-center kinetic-gradient border border-outline-variant/30 group">
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
              </div>

            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-8 relative overflow-hidden">
          <div className="max-w-screen-xl mx-auto rounded-2xl bg-gradient-to-br from-surface-container-highest to-surface-container-lowest p-12 md:p-24 border border-outline-variant/20 text-center relative z-10 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-secondary/10 blur-[80px] rounded-full"></div>
            <h2 className="font-headline text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Ready to Command the Terminal?</h2>
            <p className="text-on-surface-variant text-lg mb-12 max-w-xl mx-auto font-body">Join over 50,000 traders refining their strategies daily. Zero commitments, infinite possibilities.</p>
            <Link href="/register" className="inline-block bg-primary text-on-primary px-10 py-5 rounded-lg font-bold font-headline text-xl hover:scale-105 transition-all shadow-xl shadow-primary/20 active:scale-95">Open Free Account</Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 border-t border-slate-800/30 bg-black">
        <div className="flex justify-between items-center px-8 w-full max-w-screen-2xl mx-auto">
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
