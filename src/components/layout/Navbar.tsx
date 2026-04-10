import Link from "next/link";
import { Wallet, LineChart, LayoutDashboard, User } from "lucide-react";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tighter hover:opacity-80 transition-opacity">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            C
          </div>
          <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Coinexa
          </span>
        </Link>
        <div className="ml-8 hidden space-x-6 md:flex">
          <Link href="/market" className="text-sm font-medium text-gray-300 hover:text-white transition-colors flex items-center gap-2">
            <LineChart className="h-4 w-4" /> Market
          </Link>
          <Link href="/dashboard" className="text-sm font-medium text-gray-300 hover:text-white transition-colors flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </Link>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Log in
          </Link>
          <Link href="/register" className="inline-flex h-9 items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 transition-colors">
            Get Started
            <Wallet className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
