import React from "react";
import { Loader2, ShieldCheck, Wallet } from "lucide-react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { type UGFClaimStep } from "../lib/ugf";
import { type QuoteResponse } from "@tychilabs/ugf-testnet-js";

export function formatMockUSD(amount: string | undefined): string {
  if (!amount) return "$0.00";
  try {
    if (amount.length > 10) {
      // 18 decimals
      const usd = Number(BigInt(amount) / BigInt("10000000000000")) / 100000;
      return `$${usd.toFixed(3)}`;
    } else {
      // 6 decimals
      const usd = Number(amount) / 1_000_000;
      return `$${usd.toFixed(2)}`;
    }
  } catch {
    return "$0.05"; // static realistic mock usd fallback
  }
}

interface UGFPayButtonProps {
  step: UGFClaimStep;
  quote: QuoteResponse | null;
  errorMsg: string | null;
  onClaim: () => void;
  onQuoteFetch: () => void;
}

export function UGFPayButton({
  step,
  quote,
  errorMsg,
  onClaim,
  onQuoteFetch,
}: UGFPayButtonProps) {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="w-full flex justify-center">
        <ConnectButton.Custom>
          {({ openConnectModal }) => (
            <button
              onClick={openConnectModal}
              type="button"
              className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-outfit font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 active:scale-95"
            >
              <Wallet className="w-5 h-5" />
              Connect Wallet to Claim
            </button>
          )}
        </ConnectButton.Custom>
      </div>
    );
  }

  // Define loading labels
  const getButtonText = () => {
    switch (step) {
      case "authenticating":
        return "Securing Connection...";
      case "quoting":
        return "Calculating Claim Fee...";
      case "settling":
        return "Approving Fee Settlement...";
      case "executing":
        return "Processing Fee Settlement...";
      case "confirming":
        return "Minting NFT Certificate...";
      case "success":
        return "Certificate Secured!";
      case "error":
        return "Failed. Try Again";
      case "idle":
        return quote ? `Claim Certificate` : "Get Claim Fee Quote";
      default:
        return "Claim Certificate";
    }
  };

  const isLoading = [
    "authenticating",
    "quoting",
    "settling",
    "executing",
    "confirming",
  ].includes(step);

  const buttonAction = () => {
    if (quote) {
      onClaim();
    } else {
      onQuoteFetch();
    }
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Quote Display Badge */}
      {quote && (
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-white/5 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Secure USD claiming enabled</span>
          </div>
          <div className="flex items-center gap-1.5 font-semibold">
            <span>Claim Fee:</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {formatMockUSD(quote.payment_amount)} USD
            </span>
          </div>
        </div>
      )}

      {/* Primary Action Button */}
      <button
        onClick={buttonAction}
        disabled={isLoading || step === "success"}
        className={`w-full py-4 px-6 font-outfit font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-white shadow-lg active:scale-95 ${
          isLoading
            ? "bg-slate-800 text-slate-400 cursor-not-allowed border border-white/5"
            : step === "success"
            ? "bg-emerald-600 text-white cursor-default"
            : quote
            ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-500/20"
            : "bg-slate-800 hover:bg-slate-700 border border-white/10"
        }`}
      >
        {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
        {getButtonText()}
      </button>

      {/* Error Message Display */}
      {errorMsg && (
        <div className="p-3 text-xs rounded-lg bg-red-950/40 border border-red-500/30 text-red-400 text-center">
          {errorMsg}
        </div>
      )}
    </div>
  );
}
