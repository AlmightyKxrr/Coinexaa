import Link from "next/link";

// ─── Shared Footer ─────────────────────────────────────────────────────────────

const FOOTER_LINKS = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "#", label: "API Docs" },
  { href: "#", label: "Support" },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full py-5 border-t border-slate-800/30 bg-black mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-6 md:px-8 w-full max-w-screen-2xl mx-auto">
        <div className="text-sm font-bold text-slate-500 font-body uppercase">
          COINEXA TERMINAL
        </div>
        <div className="flex gap-6">
          {FOOTER_LINKS.map(({ href, label }) => (
            <Link
              key={label}
              href={href}
              className="text-slate-600 hover:text-slate-300 text-[10px] uppercase tracking-widest transition-colors font-body"
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="text-emerald-400 text-[10px] uppercase tracking-widest font-body flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          © {year} COINEXA TERMINAL. MARKET STATUS: OPERATIONAL
        </div>
      </div>
    </footer>
  );
}
