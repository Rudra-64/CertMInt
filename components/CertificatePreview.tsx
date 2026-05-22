import React from "react";

interface CertificatePreviewProps {
  name: string;
  badge: string;
  date: string;
  tokenId?: string;
}

export function CertificatePreview({
  name = "YOUR NAME",
  badge = "WEB3 DEVELOPER",
  date = "MAY 22, 2026",
  tokenId = "XXX",
}: CertificatePreviewProps) {
  const displayName = name.trim() || "YOUR NAME";
  const displayBadge = badge.toUpperCase();

  return (
    <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden glass-panel glow-purple p-1 select-none">
      {/* Dynamic SVG Certificate Preview */}
      <svg
        viewBox="0 0 800 600"
        className="w-full h-full rounded-lg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="previewBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="50%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
          <linearGradient id="previewBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
          <linearGradient id="previewTextGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="50%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#F472B6" />
          </linearGradient>
          <filter id="previewGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer border with gradient */}
        <rect
          x="15"
          y="15"
          width="770"
          height="570"
          rx="20"
          fill="url(#previewBgGrad)"
          stroke="url(#previewBorderGrad)"
          strokeWidth="4"
        />

        {/* Subtle decorative grid/circles in background */}
        <circle
          cx="400"
          cy="300"
          r="250"
          fill="none"
          stroke="#334155"
          strokeWidth="1"
          strokeDasharray="5,5"
          opacity="0.3"
        />
        <circle
          cx="400"
          cy="300"
          r="180"
          fill="none"
          stroke="#475569"
          strokeWidth="2"
          opacity="0.2"
        />

        {/* Top decoration */}
        <path
          d="M 250,50 L 550,50"
          fill="none"
          stroke="url(#previewBorderGrad)"
          strokeWidth="2"
          opacity="0.8"
        />
        <rect x="370" y="45" width="60" height="10" rx="5" fill="#3B82F6" opacity="0.8" />

        {/* Certificate Title */}
        <text
          x="400"
          y="110"
          fontFamily="'Outfit', sans-serif"
          fontWeight="900"
          fontSize="28"
          fill="url(#previewTextGrad)"
          textAnchor="middle"
          letterSpacing="4"
        >
          CERTMINT ACHIEVEMENT
        </text>
        <text
          x="400"
          y="140"
          fontFamily="'Inter', sans-serif"
          fontWeight="400"
          fontSize="14"
          fill="#94A3B8"
          textAnchor="middle"
          letterSpacing="2"
        >
          ON-CHAIN VERIFIED CERTIFICATE
        </text>

        {/* Presentation Line */}
        <text
          x="400"
          y="210"
          fontFamily="'Inter', sans-serif"
          fontWeight="300"
          fontSize="16"
          fill="#64748B"
          textAnchor="middle"
        >
          This is proudly presented to
        </text>

        {/* Recipient Name */}
        <text
          x="400"
          y="270"
          fontFamily="'Outfit', sans-serif"
          fontWeight="800"
          fontSize="40"
          fill="#FFFFFF"
          textAnchor="middle"
          filter="url(#previewGlow)"
        >
          {displayName}
        </text>
        <path d="M 300,295 L 500,295" fill="none" stroke="#475569" strokeWidth="1" />

        {/* Achievement Subtitle */}
        <text
          x="400"
          y="335"
          fontFamily="'Inter', sans-serif"
          fontWeight="300"
          fontSize="16"
          fill="#64748B"
          textAnchor="middle"
        >
          for successfully completing the milestone of
        </text>

        {/* Achievement Badge/Type */}
        <g transform="translate(400, 390)">
          <rect
            x="-150"
            y="-25"
            width="300"
            height="50"
            rx="25"
            fill="#1E1B4B"
            stroke="#8B5CF6"
            strokeWidth="1.5"
          />
          <text
            x="0"
            y="7"
            fontFamily="'Outfit', sans-serif"
            fontWeight="700"
            fontSize="18"
            fill="#C084FC"
            textAnchor="middle"
            letterSpacing="1"
          >
            {displayBadge}
          </text>
        </g>

        {/* Footer metadata (Serial & Date) */}
        <text
          x="100"
          y="520"
          fontFamily="monospace"
          fontSize="12"
          fill="#64748B"
          textAnchor="start"
        >
          SERIAL: #000{tokenId}
        </text>
        <text
          x="700"
          y="520"
          fontFamily="monospace"
          fontSize="12"
          fill="#64748B"
          textAnchor="end"
        >
          DATE: {date}
        </text>

        <text
          x="400"
          y="550"
          fontFamily="'Inter', sans-serif"
          fontSize="10"
          fill="#475569"
          textAnchor="middle"
          letterSpacing="1"
        >
          SECURED BY UNIVERSAL GATEWAY FRAMEWORK
        </text>
      </svg>
    </div>
  );
}
