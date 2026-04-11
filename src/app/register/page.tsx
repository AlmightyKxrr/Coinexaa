"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

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
              <Link href="/dashboard" className="px-6 py-2 bg-primary text-on-primary-container font-bold rounded-lg hover:bg-primary-fixed transition-all active:scale-95">Dashboard</Link>
            ) : (
              <>
                <Link href="/login" className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors active:scale-95">Login</Link>
                <Link href="/register" className="px-6 py-2 bg-primary text-on-primary-container font-bold rounded-lg hover:bg-primary-fixed transition-all active:scale-95">Get Started</Link>
              </>
            )}
          </div>
          <div className="bg-gradient-to-r from-blue-500/10 to-transparent h-[1px] w-full absolute bottom-0"></div>
        </div>
      </nav>

      <main className="flex-grow flex flex-col md:flex-row pt-16">
        <section className="hidden md:flex md:w-1/2 relative overflow-hidden bg-surface-container-lowest items-center justify-center p-12">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent"></div>
            <img className="w-full h-full object-cover opacity-40 mix-blend-luminosity" alt="abstract digital visualization" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKCPYA3Upix-Zh3WbKWoDKgyILimq5W1XanGcyxIQxQ_aP_aIGxKmBhGzrwLEpDvFDJHFVDDVH1cfxhA-5ycsN-_5Bbsmw2DMXNKuuimyLj6SQf0Tm5XH_vg_jo2pQjkOiRGIj08L5q0dBNJsLA8y8YJd7x-XbNWp__XIBgDjaADeTZ4VdvxdNrA8PNe16QpvIbujlkDTJXMHbWhzjxuXMHX2z1LDpy_e2SqMXyGJOxGSRABv-XuM-Mno2QuAfKsTRHc3zjpYAuS4" />
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
                <span className="material-symbols-outlined text-secondary block mb-3 text-3xl">bolt</span>
                <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-1">Execution</p>
                <p className="text-xl font-bold font-headline text-on-surface">Zero Latency</p>
              </div>
              <div className="glass-panel p-6 rounded-xl border border-white/5">
                <span className="material-symbols-outlined text-primary block mb-3 text-3xl">security</span>
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
                <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Operator Alias</label>
                <div className="relative group">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-sm">person</span>
                  <input value={alias} onChange={(e) => setAlias(e.target.value)} className="w-full bg-surface-container-highest border-none focus:ring-1 focus:ring-primary/50 rounded-xl py-3 pl-10 pr-4 text-sm text-on-surface placeholder:text-outline transition-all" placeholder="e.g. quantum_trader" type="text" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Terminal ID (Email)</label>
                <div className="relative group">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-sm">alternate_email</span>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-surface-container-highest border-none focus:ring-1 focus:ring-primary/50 rounded-xl py-3 pl-10 pr-4 text-sm text-on-surface placeholder:text-outline transition-all" placeholder="operator@coinexa.io" type="email" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Security Cipher</label>
                <div className="relative group">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-sm">lock</span>
                  <input value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-surface-container-highest border-none focus:ring-1 focus:ring-primary/50 rounded-xl py-3 pl-10 pr-4 text-sm text-on-surface placeholder:text-outline transition-all" placeholder="Minimum 6 characters" type="password" />
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
                  <img className="w-4 h-4 opacity-80 group-hover:opacity-100 transition-opacity" alt="google logo icon" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpybL67pUoAtwWPh62QlW_a5xdjKcbW8wCuao1lUVaxLG18kA1BjJpu0lVGhYiqLL1D00jrolQa_boin3UmD1B1_78Mi3CZrGsk0sqRbMEe9cRS3eJC2tCx19R_AlWYHB3fT0agrIlKYlmDN08vMq50_5Z6KntcsgmdDGC0aHYg2fwEldMh-SEgSJS-ddBhblIChG9wPipp68xprWkNswvZU0bP8C6o9dk2Qk7zlvNIF8YpodVbppeMvhxzpfwXpnmL4fSCHh_KUs" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Google Auth</span>
                </button>
              </div>
            </form>

            <p className="mt-8 text-[11px] text-center text-on-surface-variant px-4">
              By deploying a profile, you accept our <a href="#" className="text-primary hover:underline">Terms of Service</a> and acknowledge the <a href="#" className="text-primary hover:underline">Privacy Directive</a>.
            </p>
          </motion.div>
        </section>
      </main>

      <footer className="w-full py-4 border-t border-slate-800/30 bg-black font-['Inter'] text-[10px] uppercase tracking-widest text-slate-600 mt-auto">
        <div className="flex justify-between items-center px-8 w-full max-w-screen-2xl mx-auto">
          <div className="text-sm font-bold text-slate-500">© 2024 COINEXA TERMINAL. MARKET STATUS: OPERATIONAL</div>
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
