import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { baseSepolia } from "wagmi/chains";

// Use a fallback public Project ID for RainbowKit / WalletConnect
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "3fcc6bba6f1f962c95457b07b85d9cfd";

export const wagmiConfig = getDefaultConfig({
  appName: "CertMint",
  projectId: walletConnectProjectId,
  chains: [baseSepolia],
  ssr: true,
});
