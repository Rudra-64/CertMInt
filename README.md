# CertMint 📜✨

CertMint is a production-ready, visually stunning Web3 dApp built on **Base Sepolia** using Next.js 14 and Tailwind CSS. It allows users to claim achievement certificates fully on-chain gaslessly via the **Universal Gas Framework (UGF)**. Instead of paying for transaction gas with ETH, users authorize and settle gas fees (rendered in the UI as a **"Claim Fee"**) using **Mock USD** stablecoins—delivering a seamless, Web2-like minting experience entirely on-chain.

---

## ✨ Features

- 🌌 **Premium Visuals:** Modern dark mode interface styled with glassmorphic cards, custom mesh gradients, and micro-interactions.
- ⚡ **Zero-ETH claiming:** Settle claim fees in Mock USD. UGF sponsors the transaction gas under the hood.
- 🎨 **On-Chain Vector SVGs:** Recipient names, certificate issues, and serials are rendered inside SVG XML code compiled directly on-chain within the NFT metadata.
- 🎛️ **Simulator Mode:** Sandbox toggle letting users test the entire transaction pipeline (auth, quoting, USD settling, gasless execution, BaseScan verification) without connecting a real wallet.
- 🖼️ **Achievement Gallery:** Searchable grid featuring live on-chain contract fetches and historic fallback accomplishments.
- 🔗 **Verify & Share:** Dynamic detail routes featuring verification statuses, contract links, holder links, and social shares (Twitter/X).

---

## 🛠️ Tech Stack

- **Framework:** React/Next.js 14 (App Router), TypeScript
- **Styling:** Tailwind CSS, Lucide Icons, Canvas Confetti
- **Web3 Integrations:** Wagmi v2, Viem v2, RainbowKit v2, Ethers v6
- **Gas Abstraction:** `@tychilabs/react-ugf`, `@tychilabs/ugf-testnet-js`
- **Smart Contracts:** Solidity v0.8.24, Hardhat, OpenZeppelin v5 (with viaIR compiler optimizations and Cancun target)

---

## 📂 Project Directory Structure

```text
├── contracts/
│   └── CertMint.sol          # ERC-721 contract with on-chain SVG metadata rendering
├── components/
│   ├── BadgeSelector.tsx     # Achievement category selector card grid
│   ├── CertificatePreview.tsx# Vector SVG real-time preview component
│   ├── GalleryCard.tsx       # Grid display card with BaseScan link
│   ├── Navbar.tsx            # Sticky navigation bar with RainbowKit Wallet Button
│   ├── Providers.tsx         # Wagmi, React Query, RainbowKit & UGF providers
│   └── UGFPayButton.tsx      # USD fee badge & step-by-step progress button
├── lib/
│   ├── contract.ts           # Contract address and compiled ABI definitions
│   ├── ugf.ts                # Adapters & custom useUGFClaim hook for transactions
│   └── wagmi.ts              # Wagmi v2 network configurations for Base Sepolia
├── app/
│   ├── layout.tsx            # Global layout wrapping Navbar & Web3 Providers
│   ├── globals.css           # Custom mesh backgrounds and glassmorphism styling
│   ├── page.tsx              # Beautiful, interactive Hero landing page
│   ├── claim/                # Route: claim certificates
│   ├── gallery/              # Route: searchable achievement gallery
│   └── certificate/          # Route: shareable credentials verifier
├── hardhat.config.js         # EVM compiler configuration
├── next.config.js            # Webpack alias settings to ignore unused multi-chain peers
└── tsconfig.json             # TypeScript compiler settings targeting ES2022
```

---

## 🚀 Getting Started

### 1. Installation
Install project dependencies (including dev tools):
```powershell
npm install --legacy-peer-deps
```

### 2. Run Local Development Server
Start the development environment:
```powershell
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build & Package
To bundle the optimized web production build:
```powershell
npm run build
```

### 4. Hardhat Solidity Compile
Verify contract compatibility:
```powershell
npx hardhat compile
```

---

## 🔒 UGF Lifecycle Execution

Transaction execution flows through the UGF SDK programmatic pipeline inside `lib/ugf.ts`:

1. **Authentication:** Authenticate with UGF (`ugfClient.auth.login(signer)`).
2. **Quoting:** Calculate gas limits and convert to a USD value (`ugfClient.quote.get(...)`).
3. **Settling:** Approve Mock USD and settle transaction fees (`ugfClient.payment.x402.execute(...)`).
4. **Execution:** Sponsor and execute the EVM call (`ugfClient.chains.evm.sponsorAndExecute(...)`).
5. **Confirmation:** Poll the Base Sepolia receipt and log explorer confirmations.
