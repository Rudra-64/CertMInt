import React from "react";
import { Award, Code, Globe, Shield, Terminal } from "lucide-react";

export const BADGE_OPTIONS = [
  {
    id: "Web3 Developer",
    label: "Web3 Developer",
    description: "Mastered Solidity, smart contracts, and decentralized architectures.",
    icon: Code,
    color: "from-blue-500 to-indigo-500",
    textColor: "text-blue-400",
    bgColor: "bg-blue-950/40",
    borderColor: "border-blue-500/30",
  },
  {
    id: "DeFi Pioneer",
    label: "DeFi Pioneer",
    description: "Built liquidity protocols, yield strategies, and financial primitives.",
    icon: Globe,
    color: "from-pink-500 to-rose-500",
    textColor: "text-pink-400",
    bgColor: "bg-pink-950/40",
    borderColor: "border-pink-500/30",
  },
  {
    id: "Hackathon Winner",
    label: "Hackathon Winner",
    description: "Demonstrated elite execution, design, and hacking in the arena.",
    icon: Award,
    color: "from-purple-500 to-fuchsia-500",
    textColor: "text-purple-400",
    bgColor: "bg-purple-950/40",
    borderColor: "border-purple-500/30",
  },
  {
    id: "DAO Contributor",
    label: "DAO Contributor",
    description: "Shaped governance, decentralized collaboration, and community growth.",
    icon: Shield,
    color: "from-emerald-500 to-teal-500",
    textColor: "text-emerald-400",
    bgColor: "bg-emerald-950/40",
    borderColor: "border-emerald-500/30",
  },
];

interface BadgeSelectorProps {
  selectedId: string;
  onChange: (id: string) => void;
}

export function BadgeSelector({ selectedId, onChange }: BadgeSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
      {BADGE_OPTIONS.map((option) => {
        const Icon = option.icon;
        const isSelected = option.id === selectedId;

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`flex flex-col items-start p-4 rounded-xl text-left transition-all duration-300 ${
              isSelected
                ? `${option.bgColor} border-2 border-purple-500/80 shadow-md shadow-purple-500/10 scale-[1.01]`
                : "bg-slate-900/40 border border-white/5 hover:border-white/10 hover:bg-slate-900/60"
            }`}
          >
            <div
              className={`p-2 rounded-lg bg-gradient-to-br ${option.color} bg-opacity-20 mb-3`}
            >
              <Icon className="w-5 h-5 text-white" />
            </div>
            <h4 className="font-outfit font-bold text-base text-white mb-1">
              {option.label}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {option.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}
