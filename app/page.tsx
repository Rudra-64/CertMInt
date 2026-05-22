"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Award, Zap, Shield, Sparkles, Coins } from "lucide-react";
import { CertificatePreview } from "../components/CertificatePreview";
import { BADGE_OPTIONS } from "../components/BadgeSelector";

export default function LandingPage() {
  const [activeBadgeIndex, setActiveBadgeIndex] = useState(0);
  const [mockNameIndex, setMockNameIndex] = useState(0);

  const mockNames = [
    "Satoshi Nakamoto",
    "Vitalik Buterin",
    "Ada Lovelace",
    "Alan Turing",
    "Grace Hopper"
  ];

  // Rotate preview card details every 3 seconds for a dynamic feel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBadgeIndex((prev) => (prev + 1) % BADGE_OPTIONS.length);
      setMockNameIndex((prev) => (prev + 1) % mockNames.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const currentBadge = BADGE_OPTIONS[activeBadgeIndex];
  const currentName = mockNames[mockNameIndex];
  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).toUpperCase();

  return (
    <div className="flex flex-col items-center w-full min-h-[calc(100vh-68px)] relative px-4 md:px-8 py-12 md:py-24">
      {/* Decorative background glow spots */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse" />

      {/* Hero Section */}
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Heading and description */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs text-purple-400 font-semibold font-outfit mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Powered by Universal Gateway Framework (UGF)</span>
          </div>

          <h1 className="font-outfit font-black text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-[1.1] mb-6">
            Claim Your Achievement. <br />
            <span className="text-gradient">No ETH Needed.</span>
          </h1>

          <p className="text-slate-400 font-sans text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
            CertMint lets you claim fully on-chain SVG achievement certificates on Base Sepolia. 
            Sponsorship and settlement fees are processed dynamically under the hood, allowing you to settle claims in 
            <strong className="text-slate-200"> Mock USD</strong> instead of native network tokens. A seamless Web2 experience, completely on-chain.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              href="/claim"
              className="py-4 px-8 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-outfit font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 active:scale-95 group"
            >
              Mint Your Badge
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/gallery"
              className="py-4 px-8 bg-slate-900 hover:bg-slate-800 text-white font-outfit font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 border border-white/10 active:scale-95"
            >
              View Gallery
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-6 md:gap-12 mt-12 pt-8 border-t border-white/5 w-full">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-mono tracking-wider">Network Fee</span>
              <span className="text-xl md:text-2xl font-outfit font-extrabold text-emerald-400">$0.00 USD</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-mono tracking-wider">Claim Fee</span>
              <span className="text-xl md:text-2xl font-outfit font-extrabold text-white">$0.05 USD</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-mono tracking-wider">UX Framework</span>
              <span className="text-xl md:text-2xl font-outfit font-extrabold text-purple-400">UGF X402</span>
            </div>
          </div>
        </div>

        {/* Right Column: Live Animated Certificate Preview */}
        <div className="lg:col-span-5 flex justify-center w-full">
          <div className="w-full max-w-md relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 to-pink-600 rounded-2xl blur-2xl opacity-20 -z-10" />
            <CertificatePreview
              name={currentName}
              badge={currentBadge.label}
              date={currentDate}
              tokenId="MOCK"
            />
            {/* Real-time Indicator tag */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-slate-950/90 border border-white/10 rounded-full text-[10px] font-semibold text-slate-300 flex items-center gap-1.5 shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Real-Time SVG Preview Rendering</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div className="max-w-6xl w-full mt-24 md:mt-36">
        <h2 className="font-outfit font-extrabold text-2xl md:text-3xl text-white text-center mb-12">
          USD Claiming: How It Works
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-xl flex flex-col items-start">
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-4">
              <Coins className="w-6 h-6" />
            </div>
            <h3 className="font-outfit font-bold text-lg text-white mb-2">1. Connect Wallet</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Connect your standard Web3 wallet. You do not need any native network tokens to pay for transaction fees on Base Sepolia.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-xl flex flex-col items-start">
            <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-outfit font-bold text-lg text-white mb-2">2. Enter Achievement</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Input your achievement name, pick your badge category, and check the beautifully rendered dynamic SVG certificate in real-time.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-xl flex flex-col items-start">
            <div className="p-3 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400 mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-outfit font-bold text-lg text-white mb-2">3. Sponsored Settlement</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Accept the Mock USD settlement fee. UGF coordinates standard ERC-20 approval and submits the transaction with sponsorship on-chain.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
