"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { usePortfolioStore } from "@/store/usePortfolioStore";
import { formatUSD } from "@/lib/format";

// ─── Shared Navigation Bar ─────────────────────────────────────────────────────

const NAV_LINKS = [
  { href: "/market", label: "Market" },
  { href: "/dashboard", label: "Dashboard" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const usdBalance = usePortfolioStore((s) => s.usdBalance);
  const isDashboard = pathname === "/dashboard";

  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-950/60 backdrop-blur-xl shadow-[0_4px_24px_rgba(133,173,255,0.04)]">
      <div className="flex justify-between items-center h-16 px-6 md:px-8 w-full max-w-screen-2xl mx-auto">
        {/* Left: Logo + Links */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-2xl font-black tracking-tighter text-slate-100 uppercase font-headline"
          >
            COINEXA
          </Link>
          <div className="hidden md:flex gap-6 items-center">
            {NAV_LINKS.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={
                    isActive
                      ? "text-primary font-bold border-b-2 border-primary pb-1 font-headline tracking-tight transition-all"
                      : "text-slate-400 hover:text-slate-200 transition-colors font-headline tracking-tight"
                  }
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right: Auth actions */}
        <div className="flex items-center gap-4">
          {user ? (
            isDashboard ? (
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline text-xs text-on-surface-variant font-label uppercase tracking-widest">
                  Balance:
                </span>
                <span className="text-sm font-bold text-secondary">
                  {formatUSD(usdBalance)}
                </span>
                <button
                  onClick={signOut}
                  className="ml-2 text-xs text-slate-400 hover:text-error transition-colors uppercase tracking-widest font-label"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/dashboard"
                className="bg-primary-container text-on-primary-container px-5 py-2 rounded-lg font-bold transition-transform active:scale-95 text-sm"
              >
                Dashboard
              </Link>
            )
          ) : (
            <>
              <Link
                href="/login"
                className="text-slate-400 hover:text-slate-200 transition-colors font-headline tracking-tight text-sm px-4 py-2"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-primary-container text-on-primary-container px-5 py-2 rounded-lg font-bold transition-transform active:scale-95 text-sm"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
      <div className="bg-gradient-to-r from-blue-500/10 to-transparent h-[1px] w-full absolute bottom-0" />
    </nav>
  );
}
