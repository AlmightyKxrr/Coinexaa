"use client";

import Link from "next/link";

export default function MarketTerminal() {
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
              <input className="bg-transparent border-none focus:ring-0 text-sm p-0 w-48 text-on-surface placeholder:text-on-surface-variant/50 outline-none" placeholder="Quick search..." type="text" />
              <span className="text-[10px] text-outline px-1.5 py-0.5 rounded border border-outline/30 ml-2">⌘K</span>
            </div>
            <Link href="/login" className="text-slate-400 hover:text-slate-200 text-sm font-medium transition-colors">Login</Link>
            <Link href="/register" className="bg-blue-400 text-on-primary-container px-5 py-2 rounded-xl text-sm font-bold active:scale-95 transition-transform">Get Started</Link>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-500/10 to-transparent h-[1px] w-full absolute bottom-0"></div>
      </header>

      <main className="flex-grow pt-24 pb-12 px-4 md:px-8 max-w-screen-2xl mx-auto w-full">
        {/* Market Overview Hero Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="col-span-1 md:col-span-2 relative overflow-hidden rounded-xl p-8 glass-panel terminal-header-sheen">
            <div className="relative z-10">
              <h1 className="text-4xl md:text-5xl font-black font-headline tracking-tighter text-on-surface mb-2 uppercase">Live Terminal</h1>
              <p className="text-on-surface-variant max-w-lg mb-6">Real-time market execution and asset tracking. High-frequency data pipelines synced every 200ms across global exchanges.</p>
              <div className="flex gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 font-label">24h Vol</span>
                  <span className="text-xl font-headline font-bold text-on-surface">$12.42B</span>
                </div>
                <div className="w-px h-10 bg-outline-variant/30"></div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 font-label">BTC Dom</span>
                  <span className="text-xl font-headline font-bold text-on-surface">52.8%</span>
                </div>
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 opacity-10">
              <span className="material-symbols-outlined text-[200px]">monitoring</span>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden glass-panel relative group">
            <img className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" alt="abstract digital artwork representing cryptographic algorithms with glowing blue and green light lines on dark background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpAHoD2mSaU_B5eXwGPzrOonnKJfoekO_ew_xMqkEU3IAdR88C-YGIiR3Sj5jkAHnDqQZUus0UgTs__C7Tx4uIn7z5pRICEOWPjH_fG9mw6iie-j-xJ8qtSULbvAxCCxuwu9EPuUQrpJDq1V0qu8nETlYgDx3hbLHf8FnHVLZ9GHmAyTVTY27GFeUaRPpo4MQWNzOLBhuDSMAXqab962E7xlmkA02jsxOyi3MN7opnjoaVDHKQbjd7tMOjdYSQo-g752M5Wk9U-uo" />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-dim to-transparent p-6 flex flex-col justify-end">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(105,246,184,0.6)]"></span>
                <span className="text-[10px] font-bold uppercase tracking-tighter text-secondary font-label">Market Status: Bullish</span>
              </div>
              <h3 className="text-xl font-bold font-headline leading-tight">Ethereum ETFs Approved: What you need to know</h3>
            </div>
          </div>
        </div>

        {/* Professional Data Table */}
        <section className="bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant/10">
          {/* Table Controls */}
          <div className="p-4 border-b border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-4 bg-surface-container">
            <div className="flex items-center gap-2">
              <button className="bg-surface-bright text-primary px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">filter_alt</span> Filters
              </button>
              <div className="flex bg-surface-container-highest rounded-lg p-1">
                <button className="px-4 py-1 rounded text-xs font-bold bg-surface-bright text-on-surface">All Assets</button>
                <button className="px-4 py-1 rounded text-xs font-bold text-on-surface-variant hover:text-on-surface">Spot</button>
                <button className="px-4 py-1 rounded text-xs font-bold text-on-surface-variant hover:text-on-surface">Futures</button>
              </div>
            </div>
            <div className="relative w-full md:w-80">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
              <input className="w-full bg-surface-container-highest outline-none border-outline-variant/30 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 rounded-xl py-2 pl-10 text-sm" placeholder="Search for coins, symbols, or pairs..." type="text" />
            </div>
          </div>
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
                {/* Bitcoin Row */}
                <tr className="hover:bg-surface-bright transition-colors group">
                  <td className="px-6 py-4 text-sm font-label text-on-surface-variant">1</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                        <span className="material-symbols-outlined text-amber-500 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>currency_bitcoin</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">Bitcoin</span>
                        <span className="text-[11px] text-on-surface-variant font-medium">BTC</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-headline font-bold text-on-surface">$68,241.90</td>
                  <td className="px-6 py-4">
                    <span className="text-secondary text-sm font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">arrow_upward</span>
                      2.45%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-on-surface-variant">$1.34T</td>
                  <td className="px-6 py-4 text-sm font-medium text-on-surface-variant">$34.2B</td>
                  <td className="px-6 py-4 text-right">
                    <button className="bg-secondary text-on-secondary px-4 py-1.5 rounded text-xs font-black uppercase tracking-tight active:scale-95 transition-transform">Trade</button>
                  </td>
                </tr>
                {/* Ethereum Row */}
                <tr className="hover:bg-surface-bright transition-colors group">
                  <td className="px-6 py-4 text-sm font-label text-on-surface-variant">2</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                        <span className="material-symbols-outlined text-blue-400 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>token</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">Ethereum</span>
                        <span className="text-[11px] text-on-surface-variant font-medium">ETH</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-headline font-bold text-on-surface">$3,842.15</td>
                  <td className="px-6 py-4">
                    <span className="text-error text-sm font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">arrow_downward</span>
                      -1.12%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-on-surface-variant">$462.8B</td>
                  <td className="px-6 py-4 text-sm font-medium text-on-surface-variant">$18.9B</td>
                  <td className="px-6 py-4 text-right">
                    <button className="bg-secondary text-on-secondary px-4 py-1.5 rounded text-xs font-black uppercase tracking-tight active:scale-95 transition-transform">Trade</button>
                  </td>
                </tr>
                {/* Solana Row */}
                <tr className="hover:bg-surface-bright transition-colors group">
                  <td className="px-6 py-4 text-sm font-label text-on-surface-variant">3</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                        <span className="material-symbols-outlined text-emerald-400 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>layers</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">Solana</span>
                        <span className="text-[11px] text-on-surface-variant font-medium">SOL</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-headline font-bold text-on-surface">$164.22</td>
                  <td className="px-6 py-4">
                    <span className="text-secondary text-sm font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">arrow_upward</span>
                      5.82%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-on-surface-variant">$74.1B</td>
                  <td className="px-6 py-4 text-sm font-medium text-on-surface-variant">$6.4B</td>
                  <td className="px-6 py-4 text-right">
                    <button className="bg-secondary text-on-secondary px-4 py-1.5 rounded text-xs font-black uppercase tracking-tight active:scale-95 transition-transform">Trade</button>
                  </td>
                </tr>
                {/* Skeleton Loader State Placeholders (Initial Fetch Simulation) */}
                <tr className="animate-pulse">
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
                <tr className="animate-pulse">
                  <td className="px-6 py-4"><div className="h-3 w-4 bg-surface-bright rounded"></div></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-surface-bright rounded-full"></div>
                      <div className="space-y-1">
                        <div className="h-3 w-20 bg-surface-bright rounded"></div>
                        <div className="h-2 w-10 bg-surface-bright/50 rounded"></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><div className="h-4 w-24 bg-surface-bright rounded"></div></td>
                  <td className="px-6 py-4"><div className="h-4 w-12 bg-surface-bright rounded"></div></td>
                  <td className="px-6 py-4"><div className="h-3 w-16 bg-surface-bright rounded"></div></td>
                  <td className="px-6 py-4"><div className="h-3 w-16 bg-surface-bright rounded"></div></td>
                  <td className="px-6 py-4 text-right"><div className="h-7 w-16 bg-surface-bright rounded ml-auto"></div></td>
                </tr>
                <tr className="animate-pulse">
                  <td className="px-6 py-4"><div className="h-3 w-4 bg-surface-bright rounded"></div></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-surface-bright rounded-full"></div>
                      <div className="space-y-1">
                        <div className="h-3 w-14 bg-surface-bright rounded"></div>
                        <div className="h-2 w-6 bg-surface-bright/50 rounded"></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><div className="h-4 w-18 bg-surface-bright rounded"></div></td>
                  <td className="px-6 py-4"><div className="h-4 w-12 bg-surface-bright rounded"></div></td>
                  <td className="px-6 py-4"><div className="h-3 w-16 bg-surface-bright rounded"></div></td>
                  <td className="px-6 py-4"><div className="h-3 w-16 bg-surface-bright rounded"></div></td>
                  <td className="px-6 py-4 text-right"><div className="h-7 w-16 bg-surface-bright rounded ml-auto"></div></td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* Pagination/Footer of Table */}
          <div className="p-4 bg-surface-container-lowest flex justify-between items-center text-xs text-on-surface-variant font-label uppercase tracking-widest">
            <span>Showing 1-50 of 4,218 assets</span>
            <div className="flex gap-2">
              <button className="w-8 h-8 flex items-center justify-center rounded bg-surface-bright text-on-surface-variant border border-outline-variant/10">
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-primary text-on-primary-container font-bold">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-surface-bright text-on-surface-variant">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-surface-bright text-on-surface-variant">3</button>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-surface-bright text-on-surface-variant">
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        </section>
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
      
      {/* Bottom Mobile Nav (Only visible on mobile) */}
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
