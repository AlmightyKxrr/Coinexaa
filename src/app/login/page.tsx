"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-slate-950/60 backdrop-blur-xl shadow-[0_4px_24px_rgba(133,173,255,0.04)]">
        <div className="flex justify-between items-center h-16 px-8 w-full max-w-screen-2xl mx-auto">
          <Link href="/" className="text-2xl font-black tracking-tighter text-slate-100 uppercase font-headline">
            COINEXA
          </Link>
          <div className="flex items-center gap-6">
            <Link className="text-slate-400 hover:text-slate-200 transition-colors font-headline tracking-tight" href="/market">Market</Link>
            <Link className="text-slate-400 hover:text-slate-200 transition-colors font-headline tracking-tight" href="/dashboard">Dashboard</Link>
            <div className="bg-gradient-to-r from-blue-500/10 to-transparent h-[1px] w-full absolute bottom-0"></div>
          </div>
        </div>
      </nav>

      <main className="flex-grow flex flex-col md:flex-row pt-16">
        <section className="hidden md:flex md:w-1/2 relative overflow-hidden bg-surface-container-lowest items-center justify-center p-12">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
            <img 
              className="w-full h-full object-cover opacity-40 mix-blend-luminosity" 
              alt="abstract digital visualization of blockchain network with glowing blue data nodes and interconnected paths on deep black background" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKCPYA3Upix-Zh3WbKWoDKgyILimq5W1XanGcyxIQxQ_aP_aIGxKmBhGzrwLEpDvFDJHFVDDVH1cfxhA-5ycsN-_5Bbsmw2DMXNKuuimyLj6SQf0Tm5XH_vg_jo2pQjkOiRGIj08L5q0dBNJsLA8y8YJd7x-XbNWp__XIBgDjaADeTZ4VdvxdNrA8PNe16QpvIbujlkDTJXMHbWhzjxuXMHX2z1LDpy_e2SqMXyGJOxGSRABv-XuM-Mno2QuAfKsTRHc3zjpYAuS4"
            />
          </div>
          <div className="relative z-10 max-w-lg">
            <div className="mb-8">
              <span className="inline-block py-1 px-3 bg-secondary-container text-secondary text-[10px] font-bold tracking-widest uppercase rounded-full mb-4">
                Terminal Access
              </span>
              <h1 className="text-5xl lg:text-6xl font-extrabold font-headline leading-tight tracking-tighter text-on-background mb-6">
                Execute with <span className="text-primary">Precision</span>
              </h1>
              <p className="text-lg text-on-surface-variant font-light leading-relaxed">
                Join the next generation of institutional-grade trading. Access real-time liquid data and high-velocity execution.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="glass-panel p-6 rounded-xl border border-white/5">
                <div className="flex items-center gap-4 mb-2">
                  <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
                  <h3 className="text-secondary font-headline font-bold uppercase tracking-wider text-sm">Welcome Bonus</h3>
                </div>
                <p className="text-3xl font-extrabold font-headline text-on-surface">$10,000</p>
                <p className="text-xs text-on-surface-variant uppercase tracking-widest mt-1">Virtual Trading Balance</p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-surface-dim">
          <div className="w-full max-w-md">
            <div className="mb-10">
              <h2 className="text-3xl font-extrabold font-headline tracking-tight mb-2">Access Portal</h2>
              <p className="text-on-surface-variant text-sm">Initialize your session to the Kinetic Terminal.</p>
            </div>
            
            <div className="flex gap-4 mb-8 bg-surface-container-low p-1 rounded-lg">
              <Link href="/login" className="flex-1 py-2 text-sm text-center font-bold rounded-md bg-surface-bright text-on-surface shadow-sm transition-all">Login</Link>
              <Link href="/register" className="flex-1 py-2 text-center text-sm font-medium text-on-surface-variant hover:text-on-surface transition-all">Register</Link>
            </div>
            
            <form className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Terminal ID (Email)</label>
                <div className="relative group">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-sm">alternate_email</span>
                  <input className="w-full bg-surface-container-highest border-none focus:ring-1 focus:ring-primary/50 rounded-xl py-3 pl-10 pr-4 text-sm text-on-surface placeholder:text-outline transition-all" placeholder="operator@coinexa.io" type="email" />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Security Cipher</label>
                  <a className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-primary-fixed-dim transition-colors" href="#">Recover?</a>
                </div>
                <div className="relative group">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-sm">lock</span>
                  <input className="w-full bg-surface-container-highest border-none focus:ring-1 focus:ring-primary/50 rounded-xl py-3 pl-10 pr-4 text-sm text-on-surface placeholder:text-outline transition-all" placeholder="••••••••••••" type="password" />
                </div>
              </div>
              
              <div className="pt-2">
                <button type="button" className="w-full bg-secondary hover:bg-secondary-fixed-dim text-on-secondary font-bold py-4 rounded-xl font-headline uppercase tracking-widest text-xs active:scale-[0.98] transition-all shadow-[0_8px_20px_-4px_rgba(105,246,184,0.3)]">
                  Authorize Login
                </button>
              </div>
              
              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-outline-variant/30"></div>
                <span className="flex-shrink mx-4 text-[10px] font-bold uppercase tracking-widest text-outline">or authenticate via</span>
                <div className="flex-grow border-t border-outline-variant/30"></div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <button type="button" className="flex items-center justify-center gap-3 py-3 bg-surface-container-high hover:bg-surface-bright rounded-xl border border-white/5 transition-colors group">
                  <img className="w-4 h-4 opacity-80 group-hover:opacity-100 transition-opacity" alt="google logo icon" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpybL67pUoAtwWPh62QlW_a5xdjKcbW8wCuao1lUVaxLG18kA1BjJpu0lVGhYiqLL1D00jrolQa_boin3UmD1B1_78Mi3CZrGsk0sqRbMEe9cRS3eJC2tCx19R_AlWYHB3fT0agrIlKYlmDN08vMq50_5Z6KntcsgmdDGC0aHYg2fwEldMh-SEgSJS-ddBhblIChG9wPipp68xprWkNswvZU0bP8C6o9dk2Qk7zlvNIF8YpodVbppeMvhxzpfwXpnmL4fSCHh_KUs" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Google</span>
                </button>
                <button type="button" className="flex items-center justify-center gap-3 py-3 bg-surface-container-high hover:bg-surface-bright rounded-xl border border-white/5 transition-colors group">
                  <span className="material-symbols-outlined text-on-surface text-lg group-hover:text-primary transition-colors">key</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Passkey</span>
                </button>
              </div>
            </form>
            
            <div className="mt-12 p-4 bg-primary/5 border border-primary/10 rounded-xl flex items-start gap-4">
              <span className="material-symbols-outlined text-primary mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
              <div>
                <p className="text-[11px] font-bold text-primary uppercase tracking-widest mb-1">New Operator Directive</p>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  New accounts are eligible for a <span className="text-on-surface font-semibold">$10,000 USD</span> virtual credit for strategy backtesting in the simulation environment.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="w-full py-4 border-t border-slate-800/30 bg-black font-['Inter'] text-[10px] uppercase tracking-widest text-slate-600 mt-auto">
        <div className="flex justify-between items-center px-8 w-full max-w-screen-2xl mx-auto">
          <div className="text-sm font-bold text-slate-500">
            © 2024 COINEXA TERMINAL. MARKET STATUS: OPERATIONAL
          </div>
          <div className="flex gap-8">
            <a className="hover:text-slate-300 transition-colors" href="#">Terms</a>
            <a className="hover:text-slate-300 transition-colors" href="#">Privacy</a>
            <a className="hover:text-slate-300 transition-colors" href="#">API Docs</a>
            <a className="hover:text-slate-300 transition-colors" href="#">Support</a>
          </div>
        </div>
      </footer>
    </>
  );
}
