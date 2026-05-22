"use client";

import React, { useEffect, useState } from "react";
import { Award, ShieldAlert, Grid, Search, Loader2 } from "lucide-react";
import { GalleryCard } from "../../components/GalleryCard";
import { useAccount, useReadContract, useReadContracts } from "wagmi";
import { CERTMINT_ABI, CERTMINT_CONTRACT_ADDRESS } from "../../lib/contract";

interface CertificateData {
  tokenId: string;
  recipientName: string;
  badgeType: string;
  mintDate: string;
  owner: string;
  tokenUri?: string;
}

const PRELOADED_CERTIFICATES: CertificateData[] = [
  {
    tokenId: "1",
    recipientName: "Satoshi Nakamoto",
    badgeType: "DeFi Pioneer",
    mintDate: "JAN 03, 2009",
    owner: "0x0000000000000000000000000000000000000000",
    tokenUri: `data:application/json;base64,${btoa(JSON.stringify({
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600' width='100%' height='100%'><rect x='15' y='15' width='770' height='570' rx='20' fill='%230F172A' stroke='%233B82F6' stroke-width='4'/><text x='400' y='110' font-family='sans-serif' font-weight='900' font-size='28' fill='%2360A5FA' text-anchor='middle'>CERTMINT ACHIEVEMENT</text><text x='400' y='270' font-family='sans-serif' font-weight='800' font-size='40' fill='%23FFFFFF' text-anchor='middle'>Satoshi Nakamoto</text><rect x='250' y='365' width='300' height='50' rx='25' fill='%231E1B4B' stroke='%238B5CF6' stroke-width='1.5'/><text x='400' y='397' font-family='sans-serif' font-weight='700' font-size='18' fill='%23C084FC' text-anchor='middle'>DEFI PIONEER</text><text x='100' y='520' font-family='monospace' font-size='12' fill='%2364748B'>SERIAL: %230001</text><text x='700' y='520' font-family='monospace' font-size='12' fill='%2364748B' text-anchor='end'>DATE: JAN 03, 2009</text></svg>"
    }))}`
  },
  {
    tokenId: "2",
    recipientName: "Vitalik Buterin",
    badgeType: "Web3 Developer",
    mintDate: "JUL 30, 2015",
    owner: "0xAb5801a7D247BD08853C13002f7b59cC9e474054",
    tokenUri: `data:application/json;base64,${btoa(JSON.stringify({
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600' width='100%' height='100%'><rect x='15' y='15' width='770' height='570' rx='20' fill='%230F172A' stroke='%238B5CF6' stroke-width='4'/><text x='400' y='110' font-family='sans-serif' font-weight='900' font-size='28' fill='%23A78BFA' text-anchor='middle'>CERTMINT ACHIEVEMENT</text><text x='400' y='270' font-family='sans-serif' font-weight='800' font-size='40' fill='%23FFFFFF' text-anchor='middle'>Vitalik Buterin</text><rect x='250' y='365' width='300' height='50' rx='25' fill='%231E1B4B' stroke='%238B5CF6' stroke-width='1.5'/><text x='400' y='397' font-family='sans-serif' font-weight='700' font-size='18' fill='%23C084FC' text-anchor='middle'>WEB3 DEVELOPER</text><text x='100' y='520' font-family='monospace' font-size='12' fill='%2364748B'>SERIAL: %230002</text><text x='700' y='520' font-family='monospace' font-size='12' fill='%2364748B' text-anchor='end'>DATE: JUL 30, 2015</text></svg>"
    }))}`
  },
  {
    tokenId: "3",
    recipientName: "Hackathon Winner",
    badgeType: "Hackathon Winner",
    mintDate: "MAY 22, 2026",
    owner: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
    tokenUri: `data:application/json;base64,${btoa(JSON.stringify({
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600' width='100%' height='100%'><rect x='15' y='15' width='770' height='570' rx='20' fill='%230F172A' stroke='%23EC4899' stroke-width='4'/><text x='400' y='110' font-family='sans-serif' font-weight='900' font-size='28' fill='%23F472B6' text-anchor='middle'>CERTMINT ACHIEVEMENT</text><text x='400' y='270' font-family='sans-serif' font-weight='800' font-size='40' fill='%23FFFFFF' text-anchor='middle'>Elite Hacker</text><rect x='250' y='365' width='300' height='50' rx='25' fill='%231E1B4B' stroke='%238B5CF6' stroke-width='1.5'/><text x='400' y='397' font-family='sans-serif' font-weight='700' font-size='18' fill='%23C084FC' text-anchor='middle'>HACKATHON WINNER</text><text x='100' y='520' font-family='monospace' font-size='12' fill='%2364748B'>SERIAL: %230003</text><text x='700' y='520' font-family='monospace' font-size='12' fill='%2364748B' text-anchor='end'>DATE: MAY 22, 2026</text></svg>"
    }))}`
  }
];

export default function GalleryPage() {
  const { address } = useAccount();
  const [searchTerm, setSearchTerm] = useState("");
  const [certificates, setCertificates] = useState<CertificateData[]>(PRELOADED_CERTIFICATES);
  const [loading, setLoading] = useState(false);

  // Read total count from the contract on Base Sepolia
  const { data: totalCertCount, isError: totalCountError } = useReadContract({
    address: CERTMINT_CONTRACT_ADDRESS,
    abi: CERTMINT_ABI,
    functionName: "totalCertificates",
  });

  // Construct contracts reading config for wagmi useReadContracts
  const maxToFetch = totalCertCount ? Number(totalCertCount) : 0;
  
  // We will dynamically fetch the latest 5 certificates if there are any
  const idsToFetch = Array.from({ length: Math.min(5, maxToFetch) }, (_, i) => BigInt(maxToFetch - i));

  const contractQueries = idsToFetch.flatMap(id => [
    {
      address: CERTMINT_CONTRACT_ADDRESS,
      abi: CERTMINT_ABI,
      functionName: "getCertificate" as const,
      args: [id] as const,
    },
    {
      address: CERTMINT_CONTRACT_ADDRESS,
      abi: CERTMINT_ABI,
      functionName: "ownerOf" as const,
      args: [id] as const,
    },
    {
      address: CERTMINT_CONTRACT_ADDRESS,
      abi: CERTMINT_ABI,
      functionName: "tokenURI" as const,
      args: [id] as const,
    }
  ]);

  const { data: batchResults } = useReadContracts({
    contracts: contractQueries as any,
  });

  useEffect(() => {
    // If we fetched results from the contract, map them
    if (batchResults && batchResults.length > 0 && maxToFetch > 0) {
      const fetchedCerts: CertificateData[] = [];
      
      for (let i = 0; i < idsToFetch.length; i++) {
        const tokenId = idsToFetch[i].toString();
        const certResult = batchResults[i * 3];
        const ownerResult = batchResults[i * 3 + 1];
        const uriResult = batchResults[i * 3 + 2];

        if (certResult?.status === "success" && ownerResult?.status === "success") {
          const cert = certResult.result as [string, string, string];
          const owner = ownerResult.result as string;
          const tokenUri = uriResult?.status === "success" ? (uriResult.result as string) : undefined;

          fetchedCerts.push({
            tokenId,
            recipientName: cert[0],
            badgeType: cert[1],
            mintDate: cert[2],
            owner,
            tokenUri,
          });
        }
      }

      // Merge fetched certificates with preloaded ones
      if (fetchedCerts.length > 0) {
        // Filter out any duplicates
        const existingIds = new Set(fetchedCerts.map(c => c.tokenId));
        const filteredPreloads = PRELOADED_CERTIFICATES.filter(c => !existingIds.has(c.tokenId));
        setCertificates([...fetchedCerts, ...filteredPreloads]);
      }
    }
  }, [batchResults, maxToFetch]);

  // Filter based on search term
  const filteredCerts = certificates.filter(
    (c) =>
      c.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.badgeType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.tokenId.includes(searchTerm)
  );

  return (
    <div className="flex-grow w-full max-w-6xl mx-auto px-4 md:px-8 py-8 flex flex-col justify-start">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-outfit font-black text-3xl text-white">
            Achievement Gallery
          </h2>
          <p className="text-sm text-slate-400">
            Verify certificates and achievements claimed via USD fee settlement via UGF.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, badge..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex-grow flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-4" />
          <span className="text-sm text-slate-400 font-medium">Fetching verified achievements...</span>
        </div>
      ) : filteredCerts.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center py-20 bg-slate-950/40 border border-white/5 rounded-2xl p-8">
          <Award className="w-12 h-12 text-slate-600 mb-4" />
          <h3 className="font-outfit font-bold text-lg text-white mb-1">No Certificates Found</h3>
          <p className="text-xs text-slate-400">No achievements matched your search query. Try another keyword!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCerts.map((cert) => (
            <GalleryCard
              key={cert.tokenId}
              tokenId={cert.tokenId}
              recipientName={cert.recipientName}
              badgeType={cert.badgeType}
              mintDate={cert.mintDate}
              owner={cert.owner}
              tokenUri={cert.tokenUri}
            />
          ))}
        </div>
      )}
    </div>
  );
}
