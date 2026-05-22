"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Award, Calendar, CheckCircle2, ChevronRight, User, ExternalLink, HelpCircle, AlertTriangle } from "lucide-react";
import { CertificatePreview } from "../../components/CertificatePreview";
import { BadgeSelector } from "../../components/BadgeSelector";
import { UGFPayButton } from "../../components/UGFPayButton";
import { useUGFClaim } from "../../lib/ugf";

export default function ClaimPage() {
  const [name, setName] = useState("");
  const [selectedBadge, setSelectedBadge] = useState("Web3 Developer");
  const [demoMode, setDemoMode] = useState(false);
  const [demoStep, setDemoStep] = useState<"idle" | "authenticating" | "quoting" | "settling" | "executing" | "confirming" | "success" | "error">("idle");
  const [demoQuote, setDemoQuote] = useState<any>(null);
  const [demoTxHash, setDemoTxHash] = useState<string | null>(null);

  const {
    step: realStep,
    quote: realQuote,
    txHash: realTxHash,
    errorMsg: realErrorMsg,
    getGasQuote,
    executeClaim,
    resetClaim: realResetClaim
  } = useUGFClaim();

  // Combine real and demo states
  const activeStep = demoMode ? demoStep : realStep;
  const activeQuote = demoMode ? demoQuote : realQuote;
  const activeTxHash = demoMode ? demoTxHash : realTxHash;
  const activeErrorMsg = demoMode ? null : realErrorMsg;

  // Format today's date
  const [formattedDate, setFormattedDate] = useState("");
  useEffect(() => {
    setFormattedDate(
      new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).toUpperCase()
    );
  }, []);

  // Trigger confetti on success
  useEffect(() => {
    if (activeStep === "success") {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#8b5cf6", "#3b82f6", "#ec4899"],
      });
    }
  }, [activeStep]);

  const handleFetchQuote = async () => {
    if (demoMode) {
      setDemoStep("quoting");
      setTimeout(() => {
        setDemoQuote({
          payment_amount: "50000", // $0.05
          digest: "0x" + Array(64).fill("a").join(""),
        });
        setDemoStep("idle");
      }, 1000);
    } else {
      await getGasQuote(name || "YOUR NAME", selectedBadge, formattedDate);
    }
  };

  const handleClaim = async () => {
    if (demoMode) {
      setDemoStep("authenticating");
      // Cycle steps: authenticating (800ms) -> settling (1000ms) -> executing (1200ms) -> confirming (1500ms) -> success
      setTimeout(() => {
        setDemoStep("settling");
        setTimeout(() => {
          setDemoStep("executing");
          setTimeout(() => {
            setDemoStep("confirming");
            setTimeout(() => {
              setDemoTxHash("0x" + Array(64).fill("b").join(""));
              setDemoStep("success");
            }, 1500);
          }, 1200);
        }, 1000);
      }, 800);
    } else {
      await executeClaim(name || "YOUR NAME", selectedBadge, formattedDate);
    }
  };

  const handleReset = () => {
    if (demoMode) {
      setDemoStep("idle");
      setDemoQuote(null);
      setDemoTxHash(null);
    } else {
      realResetClaim();
    }
  };

  return (
    <div className="flex-grow w-full max-w-6xl mx-auto px-4 md:px-8 py-8 flex flex-col justify-start">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-outfit font-black text-3xl text-white">
            Claim Certificate
          </h2>
          <p className="text-sm text-slate-400">
            Design your achievement badge and mint it on Base Sepolia via USD fee settlement.
          </p>
        </div>

        {/* Demo Mode Toggle */}
        <div className="flex items-center gap-2 p-1 bg-slate-900 border border-white/5 rounded-lg self-start">
          <button
            onClick={() => {
              setDemoMode(false);
              handleReset();
            }}
            className={`px-3 py-1.5 rounded text-xs font-outfit font-bold transition-all ${
              !demoMode
                ? "bg-purple-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Live Web3
          </button>
          <button
            onClick={() => {
              setDemoMode(true);
              handleReset();
            }}
            className={`px-3 py-1.5 rounded text-xs font-outfit font-bold transition-all flex items-center gap-1.5 ${
              demoMode
                ? "bg-amber-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Simulator Mode
          </button>
        </div>
      </div>

      {demoMode && (
        <div className="mb-6 p-3 bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 rounded-lg flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>You are running in Simulator Mode. You do not need to connect your wallet or sign actual transactions. Perfect for instant trials.</span>
        </div>
      )}

      {activeStep === "success" ? (
        // Success Card
        <div className="w-full max-w-2xl mx-auto glass-panel p-8 rounded-2xl flex flex-col items-center text-center animate-fade-in border-emerald-500/30">
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h3 className="font-outfit font-extrabold text-2xl text-white mb-2">
            Achievement Verified & Minted!
          </h3>
          <p className="text-sm text-slate-400 max-w-md mb-8">
            Congratulations! Your achievement certificate has been minted on Base Sepolia. 
            The certificate rendering and SVG reside completely on-chain.
          </p>

          <div className="w-full max-w-sm mb-8">
            <CertificatePreview
              name={name || "YOUR NAME"}
              badge={selectedBadge}
              date={formattedDate}
              tokenId={activeTxHash ? "482" : "XXX"} // Simulating a mock ID or parsing the real one
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md mb-8 font-outfit text-xs">
            <a
              href={
                demoMode
                  ? "#"
                  : `https://sepolia.basescan.org/tx/${activeTxHash}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-xl bg-slate-900 border border-white/5 text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-all"
            >
              Verify on BaseScan
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href={
                demoMode
                  ? "#"
                  : `https://testnet.ugfscan.com/tx/${activeTxHash}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-xl bg-purple-950/20 border border-purple-500/20 text-purple-300 hover:text-purple-200 flex items-center justify-center gap-1.5 transition-all"
            >
              Verify on UGF Scan
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <button
            onClick={handleReset}
            className="py-3 px-8 bg-slate-800 hover:bg-slate-700 text-white font-outfit font-bold rounded-xl transition-all"
          >
            Claim Another Badge
          </button>
        </div>
      ) : (
        // Input Form & Live Preview side-by-side
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Settings */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="glass-panel p-6 rounded-2xl flex flex-col gap-5">
              <h3 className="font-outfit font-extrabold text-lg text-white pb-3 border-b border-white/5">
                Certificate Settings
              </h3>

              {/* Name Input */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  Recipient Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (activeQuote) handleReset(); // Reset quote if inputs change
                  }}
                  disabled={activeStep !== "idle" && activeStep !== "error" && activeStep !== "authenticating" && activeStep !== "quoting"}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              {/* Badge Picker */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  Select Badge Category
                </label>
                <BadgeSelector
                  selectedId={selectedBadge}
                  onChange={(id) => {
                    setSelectedBadge(id);
                    if (activeQuote) handleReset(); // Reset quote if inputs change
                  }}
                />
              </div>

              {/* Date (Static display for clarity) */}
              <div className="flex items-center justify-between p-3.5 bg-slate-900/60 rounded-xl border border-white/5 text-xs text-slate-400">
                <span className="flex items-center gap-1.5 uppercase font-semibold">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  Issue Date
                </span>
                <span className="font-mono font-bold text-white">{formattedDate || "LOADING..."}</span>
              </div>
            </div>

            {/* Action Pay Button */}
            <div className="glass-panel p-6 rounded-2xl">
              <UGFPayButton
                step={activeStep}
                quote={activeQuote}
                errorMsg={activeErrorMsg}
                onClaim={handleClaim}
                onQuoteFetch={handleFetchQuote}
              />
            </div>
          </div>

          {/* Certificate Live Preview */}
          <div className="lg:col-span-6 flex flex-col gap-4 sticky top-24">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Live Preview
            </h3>
            <div className="relative">
              <CertificatePreview
                name={name}
                badge={selectedBadge}
                date={formattedDate || "MAY 22, 2026"}
                tokenId="XXX"
              />
            </div>
            <p className="text-[11px] text-slate-500 leading-normal text-center max-w-md mx-auto">
              This preview matches the exact vector SVG layouts rendered on-chain in the ERC-721 token metadata.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
