"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Award, Calendar, CheckCircle2, ChevronLeft, ExternalLink, ShieldCheck, Share2, Twitter } from "lucide-react";
import { useReadContract } from "wagmi";
import { CERTMINT_ABI, CERTMINT_CONTRACT_ADDRESS } from "../../../lib/contract";
import { CertificatePreview } from "../../../components/CertificatePreview";

interface CertificateDetails {
  recipientName: string;
  badgeType: string;
  mintDate: string;
}

export default function CertificateDetailPage() {
  const params = useParams();
  const tokenId = params.tokenId as string;
  const [copyStatus, setCopyStatus] = useState("Share Link");

  // Read certificate details from contract
  const { data: certResult, isError: certError, isLoading } = useReadContract({
    address: CERTMINT_CONTRACT_ADDRESS,
    abi: CERTMINT_ABI,
    functionName: "getCertificate",
    args: [BigInt(tokenId || "0")],
    query: {
      enabled: !!tokenId && tokenId !== "MOCK" && !isNaN(Number(tokenId)),
    }
  });

  // Read owner details from contract
  const { data: ownerResult } = useReadContract({
    address: CERTMINT_CONTRACT_ADDRESS,
    abi: CERTMINT_ABI,
    functionName: "ownerOf",
    args: [BigInt(tokenId || "0")],
    query: {
      enabled: !!tokenId && tokenId !== "MOCK" && !isNaN(Number(tokenId)),
    }
  });

  // Read tokenURI metadata (SVG) from contract
  const { data: uriResult } = useReadContract({
    address: CERTMINT_CONTRACT_ADDRESS,
    abi: CERTMINT_ABI,
    functionName: "tokenURI",
    args: [BigInt(tokenId || "0")],
    query: {
      enabled: !!tokenId && tokenId !== "MOCK" && !isNaN(Number(tokenId)),
    }
  });

  // Set default details/simulation fallback if it's a simulated badge or if contract read fails
  const [cert, setCert] = useState<CertificateDetails | null>(null);
  const [owner, setOwner] = useState<string>("");
  const [svgImage, setSvgImage] = useState<string>("");

  useEffect(() => {
    if (tokenId === "1") {
      setCert({
        recipientName: "Satoshi Nakamoto",
        badgeType: "DeFi Pioneer",
        mintDate: "JAN 03, 2009",
      });
      setOwner("0x0000000000000000000000000000000000000000");
    } else if (tokenId === "2") {
      setCert({
        recipientName: "Vitalik Buterin",
        badgeType: "Web3 Developer",
        mintDate: "JUL 30, 2015",
      });
      setOwner("0xAb5801a7D247BD08853C13002f7b59cC9e474054");
    } else if (tokenId === "3") {
      setCert({
        recipientName: "Elite Hacker",
        badgeType: "Hackathon Winner",
        mintDate: "MAY 22, 2026",
      });
      setOwner("0xd8da6bf26964af9d7eed9e03e53415d37aa96045");
    } else if (certResult) {
      const result = certResult as any;
      setCert({
        recipientName: result.recipientName || result[0],
        badgeType: result.badgeType || result[1],
        mintDate: result.mintDate || result[2],
      });
      if (ownerResult) {
        setOwner(ownerResult as string);
      }
      if (uriResult) {
        try {
          const base64Data = (uriResult as string).split(",")[1];
          const metadata = JSON.parse(atob(base64Data));
          setSvgImage((metadata.image || "").replace(/UNIVERSAL GAS FRAMEWORK/g, "UNIVERSAL GATEWAY FRAMEWORK"));
        } catch {}
      }
    }
  }, [certResult, ownerResult, uriResult, tokenId]);

  const handleShareLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopyStatus("Copied!");
      setTimeout(() => setCopyStatus("Share Link"), 2000);
    }
  };

  const getTwitterShare = () => {
    if (!cert) return "";
    const text = `I verified the on-chain achievement of ${cert.recipientName} earning the ${cert.badgeType} badge via CertMint! Minted via USD fee settlement using UGF on Base Sepolia.`;
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`;
  };

  if (isLoading) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center py-24">
        <Award className="w-12 h-12 text-purple-500 animate-bounce mb-4" />
        <span className="text-sm text-slate-400 font-medium">Resolving on-chain credentials...</span>
      </div>
    );
  }

  if (!cert) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center py-20 px-4 text-center">
        <Award className="w-16 h-16 text-slate-700 mb-6" />
        <h3 className="font-outfit font-black text-2xl text-white mb-2">Certificate Not Found</h3>
        <p className="text-sm text-slate-400 max-w-md mb-8">
          The requested token ID #{tokenId} does not exist or has not been claimed yet.
        </p>
        <Link
          href="/claim"
          className="py-3.5 px-8 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-outfit font-bold rounded-xl transition-all"
        >
          Claim a New Certificate
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-grow w-full max-w-6xl mx-auto px-4 md:px-8 py-8 flex flex-col justify-start">
      {/* Back button */}
      <Link
        href="/gallery"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-8 self-start"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Gallery
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side: Certificate Vector Preview */}
        <div className="lg:col-span-6 w-full flex justify-center">
          <div className="w-full max-w-lg relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 to-pink-600 rounded-2xl blur-3xl opacity-10 -z-10" />
            {svgImage ? (
              <div className="w-full aspect-[4/3] rounded-xl overflow-hidden glass-panel glow-purple p-1 select-none">
                <img src={svgImage} alt={`Certificate #${tokenId}`} className="w-full h-full rounded-lg" />
              </div>
            ) : (
              <CertificatePreview
                name={cert.recipientName}
                badge={cert.badgeType}
                date={cert.mintDate}
                tokenId={tokenId}
              />
            )}
          </div>
        </div>

        {/* Right Side: Verification Details */}
        <div className="lg:col-span-6 flex flex-col gap-6 w-full">
          <div className="glass-panel p-6 md:p-8 rounded-2xl flex flex-col gap-6 border-purple-500/20">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded bg-purple-500/10 text-purple-400 text-xs font-bold font-outfit uppercase tracking-wider border border-purple-500/25">
                {cert.badgeType}
              </span>
              <span className="font-mono text-xs text-slate-500 font-bold">
                TOKEN ID: #{tokenId}
              </span>
            </div>

            <h3 className="font-outfit font-black text-3xl text-white">
              {cert.recipientName}
            </h3>

            <div className="w-full h-px bg-white/5" />

            {/* Verification Items */}
            <div className="flex flex-col gap-4 text-xs font-mono">
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 uppercase">Status</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Verified On-Chain
                </span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 uppercase">Holder</span>
                <span className="text-slate-300 truncate max-w-[200px] text-right">
                  <a
                    href={`https://sepolia.basescan.org/address/${owner}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-purple-400 transition-colors flex items-center gap-1 justify-end"
                  >
                    {owner ? `${owner.substring(0, 8)}...${owner.substring(owner.length - 6)}` : "Simulator Address"}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 uppercase">Minted Date</span>
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  {cert.mintDate}
                </span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 uppercase">Contract</span>
                <span className="text-slate-300 truncate max-w-[200px] text-right">
                  <a
                    href={`https://sepolia.basescan.org/address/${CERTMINT_CONTRACT_ADDRESS}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-purple-400 transition-colors flex items-center gap-1 justify-end"
                  >
                    {CERTMINT_CONTRACT_ADDRESS.substring(0, 8)}...{CERTMINT_CONTRACT_ADDRESS.substring(CERTMINT_CONTRACT_ADDRESS.length - 6)}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 uppercase">Network</span>
                <span className="text-slate-300">Base Sepolia Testnet</span>
              </div>
            </div>

            <div className="w-full h-px bg-white/5" />

            {/* UGF sponsor badge */}
            <div className="flex items-center gap-3 p-4 bg-slate-900/60 border border-white/5 rounded-xl text-xs text-slate-300">
              <ShieldCheck className="w-5 h-5 text-purple-400 flex-shrink-0" />
              <span>
                <strong>Sponsored.</strong> The recipient paid a minor claim fee of $0.05 Mock USD via the Universal Gateway Framework. No native network tokens were required.
              </span>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <button
                onClick={handleShareLink}
                className="py-3.5 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-outfit font-bold text-sm border border-white/10 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Share2 className="w-4 h-4" />
                {copyStatus}
              </button>
              <a
                href={getTwitterShare()}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3.5 px-5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-outfit font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Twitter className="w-4 h-4" />
                Share on X
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
