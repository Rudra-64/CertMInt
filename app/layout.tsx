import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";
import { Providers } from "../components/Providers";
import { Navbar } from "../components/Navbar";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
});

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "CertMint | Gasless On-Chain Achievement Certificates",
  description: "Claim your verified Web3 achievements completely gaslessly. Pay claim fees in stablecoins instead of ETH using the Universal Gas Framework (UGF) on Base Sepolia.",
  keywords: ["CertMint", "Base Sepolia", "UGF", "Universal Gas Framework", "Gasless Minting", "On-chain SVG", "NFT Certificate"],
  authors: [{ name: "CertMint Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="antialiased min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-grow flex flex-col">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
