"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Award } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="w-full sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5 px-4 md:px-8 py-3 flex items-center justify-between">
      {/* Brand logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 group-hover:scale-105 transition-transform">
          <Award className="w-5 h-5 text-white" />
        </div>
        <span className="font-outfit font-black text-xl text-white tracking-tight">
          Cert<span className="text-gradient">Mint</span>
        </span>
      </Link>

      {/* Navigation links */}
      <nav className="hidden md:flex items-center gap-6">
        <Link
          href="/claim"
          className={`font-outfit font-medium text-sm transition-colors ${
            isActive("/claim")
              ? "text-purple-400 font-bold"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Claim Badge
        </Link>
        <Link
          href="/gallery"
          className={`font-outfit font-medium text-sm transition-colors ${
            isActive("/gallery")
              ? "text-purple-400 font-bold"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Gallery
        </Link>
      </nav>

      {/* Connect Wallet Button */}
      <div className="flex items-center gap-4">
        {/* Mobile link for Claim */}
        <Link
          href="/claim"
          className="md:hidden font-outfit text-xs px-3 py-1.5 rounded-lg bg-slate-900 border border-white/5 text-slate-300 hover:text-white"
        >
          Claim
        </Link>
        <Link
          href="/gallery"
          className="md:hidden font-outfit text-xs px-3 py-1.5 rounded-lg bg-slate-900 border border-white/5 text-slate-300 hover:text-white"
        >
          Gallery
        </Link>
        <ConnectButton showBalance={false} chainStatus="none" />
      </div>
    </header>
  );
}
