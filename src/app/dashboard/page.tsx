"use client";

import Link from "next/link";
import { useState } from "react";

export default function DashboardPage() {
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
            <Link href="/login" className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors active:scale-95">Login</Link>
            <Link href="/register" className="px-6 py-2 bg-primary text-on-primary-container font-bold rounded-lg hover:bg-primary-fixed transition-all active:scale-95">Get Started</Link>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-500/10 to-transparent h-[1px] w-full absolute bottom-0"></div>
      </nav>

      <main className="pt-24 pb-12 px-8 max-w-screen-2xl mx-auto space-y-6 flex-grow w-full">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <div className="lg:col-span-12 glass-panel rounded-xl kinetic-gradient p-12 text-center flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA4xhzbo6GhTKpUj715OwmRTWb1SxsJNqfHd62cDP1JhIHdfV8_NscRzVUAI5RhDkmBQAm3r7ZCX1fI7Y2qsKjqCJZv8Ow5XebF8Tmw69j-G_2aPIUSGIENspu2zciTzOLVDU3pi3Y3JQR-bQ_Y8Tl9PQewbuv09ARyJrrIKdg1ZNL_kxcJb5kInhROccjDDSqdB0U8cgkynpN53aTpFDxGRZi2NoWMJZM0v_0F6JUnkL5ahBntVibkETMHvW6nCz9CLMxcItny9Dg')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
            <span className="text-on-surface-variant font-label text-xs uppercase tracking-[0.2em] mb-4">Total Net Asset Value</span>
            <h1 className="font-headline text-6xl md:text-8xl font-extrabold tracking-tighter text-on-surface mb-4">
              $1,284,592<span className="text-primary-dim">.42</span>
            </h1>
            <div className="flex items-center gap-3 bg-secondary/10 px-4 py-2 rounded-full border border-secondary/20">
              <span className="material-symbols-outlined text-secondary text-sm">trending_up</span>
              <span className="text-secondary font-bold text-lg">+12.4%</span>
              <span className="text-on-surface-variant text-sm font-medium">vs last month</span>
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-container-high rounded-xl p-6 border border-outline-variant/10">
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-headline text-lg font-bold tracking-tight">Portfolio Allocation</h2>
                <span className="material-symbols-outlined text-on-surface-variant">pie_chart</span>
              </div>
              <div className="flex items-center gap-8">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-8 border-primary/20"></div>
                  <div className="absolute inset-0 rounded-full border-8 border-primary border-t-transparent border-r-transparent -rotate-45"></div>
                  <span className="font-headline font-bold text-xl text-primary">BTC</span>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <span className="text-sm font-medium">Bitcoin</span>
                    </div>
                    <span className="text-sm font-bold">52%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-secondary"></div>
                      <span className="text-sm font-medium">Ethereum</span>
                    </div>
                    <span className="text-sm font-bold">28%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-tertiary"></div>
                      <span className="text-sm font-medium">Solana</span>
                    </div>
                    <span className="text-sm font-bold">15%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-high rounded-xl p-6 border border-outline-variant/10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-headline text-lg font-bold tracking-tight">Performance Metrics</h2>
                <span className="material-symbols-outlined text-on-surface-variant">analytics</span>
              </div>
              <div className="space-y-6">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-on-surface-variant uppercase tracking-widest font-label">Sharpe Ratio</span>
                  <span className="text-2xl font-headline font-bold">2.84</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-on-surface-variant uppercase tracking-widest font-label">Max Drawdown</span>
                  <span className="text-2xl font-headline font-bold text-error">-14.2%</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-on-surface-variant uppercase tracking-widest font-label">Realized P&amp;L</span>
                  <span className="text-2xl font-headline font-bold text-secondary">+$14,290.00</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-surface-container-highest rounded-xl p-6 border border-outline-variant/20 shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="material-symbols-outlined text-6xl">account_balance_wallet</span>
              </div>
              <h2 className="font-headline text-lg font-bold tracking-tight mb-6">Interactive Terminal</h2>
              <div className="flex bg-surface-container-low p-1 rounded-lg mb-6">
                <button className="flex-1 py-2 text-sm font-bold bg-secondary text-on-secondary rounded-md shadow-lg">BUY</button>
                <button className="flex-1 py-2 text-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors">SELL</button>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-label ml-1">Asset Pair</label>
                  <div className="bg-surface-bright p-3 rounded-lg flex items-center justify-between cursor-pointer hover:bg-surface-container-high transition-colors border border-outline-variant/10">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-[16px] text-on-primary font-bold">currency_bitcoin</span>
                      </div>
                      <span className="font-bold">BTC / USDT</span>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant">expand_more</span>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-label ml-1">Amount</label>
                  <div className="bg-surface-bright p-3 rounded-lg flex items-center border border-outline-variant/10 focus-within:border-primary/50 transition-all">
                    <input className="outline-none bg-transparent border-none focus:ring-0 w-full p-0 font-headline font-bold text-xl placeholder:text-on-surface-variant/30" placeholder="0.00" type="number" />
                    <span className="text-xs font-bold text-on-surface-variant ml-2">BTC</span>
                  </div>
                </div>
                
                <div className="bg-surface-container-low p-4 rounded-lg space-y-2 border border-outline-variant/5">
                  <div className="flex justify-between text-[10px] uppercase tracking-widest text-on-surface-variant font-label">
                    <span>Estimated Price</span>
                    <span className="text-on-surface">$64,291.50</span>
                  </div>
                  <div className="flex justify-between text-[10px] uppercase tracking-widest text-on-surface-variant font-label">
                    <span>Trading Fee</span>
                    <span className="text-on-surface">0.05%</span>
                  </div>
                  <div className="h-[1px] bg-outline-variant/10 my-1"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase">Total Cost</span>
                    <span className="text-lg font-headline font-extrabold text-secondary">$0.00</span>
                  </div>
                </div>
                <button className="w-full py-4 bg-secondary text-on-secondary font-bold rounded-lg shadow-[0_0_20px_rgba(105,246,184,0.3)] hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-xs">Execute Market Order</button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-12">
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
                    <tr className="hover:bg-surface-bright transition-colors group">
                      <td className="px-6 py-4 text-xs font-medium text-on-surface-variant">2024-05-24 14:22:01</td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-secondary/10 text-secondary border border-secondary/20">BUY</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm">BTC</span>
                          <span className="text-[10px] text-on-surface-variant">Bitcoin</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-headline font-bold text-sm">0.4520</td>
                      <td className="px-6 py-4 text-right font-headline font-bold text-sm">$63,120.00</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                          <span className="text-[10px] font-bold text-secondary uppercase">Filled</span>
                        </div>
                      </td>
                    </tr>
                    
                    <tr className="hover:bg-surface-bright transition-colors group">
                      <td className="px-6 py-4 text-xs font-medium text-on-surface-variant">2024-05-24 11:05:42</td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-tertiary-container/10 text-tertiary border border-tertiary-container/20">SELL</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm">ETH</span>
                          <span className="text-[10px] text-on-surface-variant">Ethereum</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-headline font-bold text-sm">12.500</td>
                      <td className="px-6 py-4 text-right font-headline font-bold text-sm">$3,842.10</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                          <span className="text-[10px] font-bold text-secondary uppercase">Filled</span>
                        </div>
                      </td>
                    </tr>
                    
                    <tr className="hover:bg-surface-bright transition-colors group">
                      <td className="px-6 py-4 text-xs font-medium text-on-surface-variant">2024-05-23 23:59:12</td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-secondary/10 text-secondary border border-secondary/20">BUY</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm">SOL</span>
                          <span className="text-[10px] text-on-surface-variant">Solana</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-headline font-bold text-sm">140.00</td>
                      <td className="px-6 py-4 text-right font-headline font-bold text-sm">$172.45</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                          <span className="text-[10px] font-bold text-secondary uppercase">Filled</span>
                        </div>
                      </td>
                    </tr>
                    
                    <tr className="hover:bg-surface-bright transition-colors group">
                      <td className="px-6 py-4 text-xs font-medium text-on-surface-variant">2024-05-23 09:12:33</td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-tertiary-container/10 text-tertiary border border-tertiary-container/20">SELL</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm">BTC</span>
                          <span className="text-[10px] text-on-surface-variant">Bitcoin</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-headline font-bold text-sm">0.1000</td>
                      <td className="px-6 py-4 text-right font-headline font-bold text-sm">$67,200.00</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-outline-variant"></div>
                          <span className="text-[10px] font-bold text-on-surface-variant uppercase">Cancelled</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
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
