"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { UGFProvider } from "@tychilabs/react-ugf";
import { wagmiConfig } from "../lib/wagmi";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#8b5cf6", // Purple accent matching our aesthetic
            accentColorForeground: "white",
            borderRadius: "medium",
            overlayBlur: "small",
          })}
        >
          <UGFProvider mode="testnet">
            {children}
          </UGFProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
