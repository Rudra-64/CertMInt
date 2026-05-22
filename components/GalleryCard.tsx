import React from "react";
import { ExternalLink, ShieldCheck } from "lucide-react";

interface GalleryCardProps {
  tokenId: string;
  recipientName: string;
  badgeType: string;
  mintDate: string;
  owner: string;
  tokenUri?: string;
}

export function GalleryCard({
  tokenId,
  recipientName,
  badgeType,
  mintDate,
  owner,
  tokenUri,
}: GalleryCardProps) {
  // Truncate address (e.g. 0x1234...5678)
  const formatAddress = (addr: string) => {
    if (!addr) return "0x0000...0000";
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  // Extract the SVG base64 if present in the tokenUri data
  let imgSrc = "";
  if (tokenUri && tokenUri.startsWith("data:application/json;base64,")) {
    try {
      const base64Data = tokenUri.split(",")[1];
      const jsonStr = atob(base64Data);
      const metadata = JSON.parse(jsonStr);
      imgSrc = (metadata.image || "").replace(/UNIVERSAL GAS FRAMEWORK/g, "UNIVERSAL GATEWAY FRAMEWORK");
    } catch (e) {
      console.error("Error decoding tokenUri metadata", e);
    }
  }

  // Fallback styling if image cannot be parsed
  const fallbackSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="75"><rect width="100" height="75" fill="%231e293b"/><text x="50" y="40" fill="%2364748b" font-size="10" text-anchor="middle">Preview</text></svg>`;

  return (
    <div className="glass-panel glass-panel-hover rounded-xl overflow-hidden flex flex-col group">
      {/* Certificate Image Frame */}
      <div className="w-full aspect-[4/3] bg-slate-950 relative overflow-hidden border-b border-white/5">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={`Certificate #${tokenId}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-slate-900/60">
            <ShieldCheck className="w-12 h-12 text-purple-500/50 mb-2 animate-pulse" />
            <span className="text-xs text-slate-400 font-semibold font-outfit">
              Loading Certificate Metadata
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3 px-2.5 py-1 bg-slate-950/80 border border-white/10 rounded-full text-[10px] font-mono text-purple-400 font-bold backdrop-blur-sm">
          #{tokenId}
        </div>
      </div>

      {/* Meta Content */}
      <div className="p-4 flex flex-col flex-grow">
        <span className="px-2 py-0.5 self-start rounded bg-purple-500/10 text-purple-400 text-[10px] font-bold font-outfit uppercase tracking-wider mb-2 border border-purple-500/15">
          {badgeType}
        </span>
        <h4 className="font-outfit font-bold text-white text-base truncate mb-1">
          {recipientName}
        </h4>
        
        {/* Holder and Date Details */}
        <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-white/5 text-[11px] text-slate-400 font-mono">
          <div>
            <span className="text-[9px] text-slate-500 block uppercase">Holder</span>
            <span className="text-slate-300 font-semibold hover:text-purple-400 transition-colors">
              <a
                href={`https://sepolia.basescan.org/address/${owner}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {formatAddress(owner)}
              </a>
            </span>
          </div>
          <div className="text-right">
            <span className="text-[9px] text-slate-500 block uppercase">Minted On</span>
            <span className="text-slate-300">{mintDate}</span>
          </div>
        </div>

        {/* Verification Link */}
        <a
          href={`https://sepolia.basescan.org/token/0xaF19b022204E641D8B4D4f307F43126fBE3f46f3?a=${tokenId}`} // Replace with dynamic address if needed
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 w-full py-2 px-3 rounded bg-white/5 hover:bg-white/10 text-[11px] text-slate-300 hover:text-white font-medium flex items-center justify-center gap-1.5 transition-all"
        >
          Verify on BaseScan
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
