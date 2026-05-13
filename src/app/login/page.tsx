"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function LoginPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already signed in
  useEffect(() => {
    if (user) router.push("/dashboard");
  }, [user, router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { toast.error("Please fill in all fields."); return; }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Session authorized. Redirecting to terminal…");
      router.push("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleLogin() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) toast.error(error.message);
  }

  return (
    <>
      <Navbar />

      <main className="flex-grow flex flex-col md:flex-row pt-16">
        <section className="hidden md:flex md:w-1/2 relative overflow-hidden bg-surface-container-lowest items-center justify-center p-12">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
            <div className="w-full h-full bg-gradient-to-br from-primary/20 via-surface-container to-secondary/5" />
          </div>
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="relative z-10 max-w-lg">
            <div className="mb-8">
              <span className="inline-block py-1 px-3 bg-secondary-container text-secondary text-[10px] font-bold tracking-widest uppercase rounded-full mb-4">Terminal Access</span>
              <h1 className="text-5xl lg:text-6xl font-extrabold font-headline leading-tight tracking-tighter text-on-background mb-6">
                Execute with <span className="text-primary">Precision</span>
              </h1>
              <p className="text-lg text-on-surface-variant font-light leading-relaxed">Join the next generation of institutional-grade trading. Access real-time liquid data and high-velocity execution.</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="glass-panel p-6 rounded-xl border border-white/5">
                <div className="flex items-center gap-4 mb-2">
                  <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">account_balance_wallet</span>
                  <h3 className="text-secondary font-headline font-bold uppercase tracking-wider text-sm">Welcome Bonus</h3>
                </div>
                <p className="text-3xl font-extrabold font-headline text-on-surface">$10,000</p>
                <p className="text-xs text-on-surface-variant uppercase tracking-widest mt-1">Virtual Trading Balance</p>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-surface-dim">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="w-full max-w-md">
            <div className="mb-10">
              <h2 className="text-3xl font-extrabold font-headline tracking-tight mb-2">Access Portal</h2>
              <p className="text-on-surface-variant text-sm">Initialize your session to the Kinetic Terminal.</p>
            </div>

            <div className="flex gap-4 mb-8 bg-surface-container-low p-1 rounded-lg">
              <Link href="/login" className="flex-1 py-2 text-sm text-center font-bold rounded-md bg-surface-bright text-on-surface shadow-sm transition-all">Login</Link>
              <Link href="/register" className="flex-1 py-2 text-center text-sm font-medium text-on-surface-variant hover:text-on-surface transition-all">Register</Link>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="login-email" className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Terminal ID (Email)</label>
                <div className="relative group">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-sm" aria-hidden="true">alternate_email</span>
                  <input id="login-email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-surface-container-highest border-none focus:ring-1 focus:ring-primary/50 rounded-xl py-3 pl-10 pr-4 text-sm text-on-surface placeholder:text-outline transition-all" placeholder="operator@coinexa.io" type="email" autoComplete="email" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label htmlFor="login-password" className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Security Cipher</label>
                </div>
                <div className="relative group">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-sm" aria-hidden="true">lock</span>
                  <input id="login-password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-surface-container-highest border-none focus:ring-1 focus:ring-primary/50 rounded-xl py-3 pl-10 pr-4 text-sm text-on-surface placeholder:text-outline transition-all" placeholder="••••••••••••" type="password" autoComplete="current-password" />
                </div>
              </div>

              <div className="pt-2">
                <button type="submit" disabled={isLoading} className="w-full bg-secondary hover:bg-secondary-fixed-dim text-on-secondary font-bold py-4 rounded-xl font-headline uppercase tracking-widest text-xs active:scale-[0.98] transition-all shadow-[0_8px_20px_-4px_rgba(105,246,184,0.3)] disabled:opacity-50 disabled:cursor-not-allowed">
                  {isLoading ? "Authorizing…" : "Authorize Login"}
                </button>
              </div>

              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-outline-variant/30"></div>
                <span className="flex-shrink mx-4 text-[10px] font-bold uppercase tracking-widest text-outline">or authenticate via</span>
                <div className="flex-grow border-t border-outline-variant/30"></div>
              </div>

              <div className="grid grid-cols-1">
                <button type="button" onClick={handleGoogleLogin} className="flex items-center justify-center gap-3 py-3 bg-surface-container-high hover:bg-surface-bright rounded-xl border border-white/5 transition-colors group">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Google</span>
                </button>
              </div>
            </form>

            <div className="mt-12 p-4 bg-primary/5 border border-primary/10 rounded-xl flex items-start gap-4">
              <span className="material-symbols-outlined text-primary mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">info</span>
              <div>
                <p className="text-[11px] font-bold text-primary uppercase tracking-widest mb-1">New Operator Directive</p>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  New accounts are eligible for a <span className="text-on-surface font-semibold">$10,000 USD</span> virtual credit for strategy backtesting in the simulation environment.
                </p>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </>
  );
}
