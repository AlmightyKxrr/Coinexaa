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

export default function RegisterPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [alias, setAlias] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already signed in
  useEffect(() => {
    if (user) router.push("/dashboard");
  }, [user, router]);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { toast.error("Please fill in all fields."); return; }
    if (password.length < 6) { toast.error("Password must be at least 6 characters."); return; }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: alias || email.split("@")[0] } },
      });
      if (error) throw error;

      // Auto-create profile row with $10,000 virtual balance
      if (data.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .upsert({ id: data.user.id, virtual_balance: 10000 }, { onConflict: "id" });
        if (profileError) console.error("Profile creation error:", profileError);
      }

      toast.success("Profile deployed! Redirecting to terminal…");
      router.push("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleRegister() {
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
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent"></div>
            <div className="w-full h-full bg-gradient-to-br from-secondary/15 via-surface-container to-primary/5" />
          </div>
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="relative z-10 max-w-lg">
            <div className="mb-8">
              <span className="inline-block py-1 px-3 bg-primary-container text-white text-[10px] font-bold tracking-widest uppercase rounded-full mb-4">Operator Onboarding</span>
              <h1 className="text-5xl lg:text-6xl font-extrabold font-headline leading-tight tracking-tighter text-on-background mb-6">
                Enter the <span className="text-secondary">Market</span>
              </h1>
              <p className="text-lg text-on-surface-variant font-light leading-relaxed">Configure your simulator profile. Trade across hundreds of synthetic pairs with zero capital constraints.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-panel p-6 rounded-xl border border-white/5">
                <span className="material-symbols-outlined text-secondary block mb-3 text-3xl" aria-hidden="true">bolt</span>
                <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-1">Execution</p>
                <p className="text-xl font-bold font-headline text-on-surface">Zero Latency</p>
              </div>
              <div className="glass-panel p-6 rounded-xl border border-white/5">
                <span className="material-symbols-outlined text-primary block mb-3 text-3xl" aria-hidden="true">security</span>
                <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-1">Environment</p>
                <p className="text-xl font-bold font-headline text-on-surface">Risk-Free</p>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-surface-dim">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="w-full max-w-md">
            <div className="mb-10">
              <h2 className="text-3xl font-extrabold font-headline tracking-tight mb-2">Create Account</h2>
              <p className="text-on-surface-variant text-sm">Deploy your operator profile onto the network.</p>
            </div>

            <div className="flex gap-4 mb-8 bg-surface-container-low p-1 rounded-lg">
              <Link href="/login" className="flex-1 py-2 text-center text-sm font-medium text-on-surface-variant hover:text-on-surface transition-all">Login</Link>
              <Link href="/register" className="flex-1 py-2 text-sm text-center font-bold rounded-md bg-surface-bright text-on-surface shadow-sm transition-all">Register</Link>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="register-alias" className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Operator Alias</label>
                <div className="relative group">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-sm" aria-hidden="true">person</span>
                  <input id="register-alias" value={alias} onChange={(e) => setAlias(e.target.value)} className="w-full bg-surface-container-highest border-none focus:ring-1 focus:ring-primary/50 rounded-xl py-3 pl-10 pr-4 text-sm text-on-surface placeholder:text-outline transition-all" placeholder="e.g. quantum_trader" type="text" autoComplete="username" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="register-email" className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Terminal ID (Email)</label>
                <div className="relative group">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-sm" aria-hidden="true">alternate_email</span>
                  <input id="register-email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-surface-container-highest border-none focus:ring-1 focus:ring-primary/50 rounded-xl py-3 pl-10 pr-4 text-sm text-on-surface placeholder:text-outline transition-all" placeholder="operator@coinexa.io" type="email" autoComplete="email" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="register-password" className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Security Cipher</label>
                <div className="relative group">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-sm" aria-hidden="true">lock</span>
                  <input id="register-password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-surface-container-highest border-none focus:ring-1 focus:ring-primary/50 rounded-xl py-3 pl-10 pr-4 text-sm text-on-surface placeholder:text-outline transition-all" placeholder="Minimum 6 characters" type="password" autoComplete="new-password" />
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary-fixed-dim text-on-primary-container font-bold py-4 rounded-xl font-headline uppercase tracking-widest text-xs active:scale-[0.98] transition-all shadow-[0_8px_20px_-4px_rgba(133,173,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed">
                  {isLoading ? "Deploying…" : "Deploy Profile"}
                </button>
              </div>

              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-outline-variant/30"></div>
                <span className="flex-shrink mx-4 text-[10px] font-bold uppercase tracking-widest text-outline">or configure via</span>
                <div className="flex-grow border-t border-outline-variant/30"></div>
              </div>

              <div className="grid grid-cols-1">
                <button type="button" onClick={handleGoogleRegister} className="flex items-center justify-center gap-3 py-3 bg-surface-container-high hover:bg-surface-bright rounded-xl border border-white/5 transition-colors group">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Google Auth</span>
                </button>
              </div>
            </form>

            <p className="mt-8 text-[11px] text-center text-on-surface-variant px-4">
              By deploying a profile, you accept our <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and acknowledge the <Link href="/privacy" className="text-primary hover:underline">Privacy Directive</Link>.
            </p>
          </motion.div>
        </section>
      </main>

      <Footer />
    </>
  );
}
