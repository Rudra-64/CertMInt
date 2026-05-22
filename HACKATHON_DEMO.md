# Hackathon Demo Guide: CertMint 📜✨

Welcome to the hackathon presentation and demo script guide for CertMint. This document provides a highly polished, paragraph-formatted explanation of the project to structure your demo video, along with a structured walkthrough of the UI features to highlight.

---

## Project Presentation Script

### Part 1: The Vision & Problem Statement
In Web3 today, user onboarding remains one of the largest bottlenecks due to the friction of managing transaction fees. Standard decentralized applications require users to acquire native gas tokens like ETH before they can perform even simple actions, creating a steep learning curve that alienates Web2 users. **CertMint** is built to solve this exact problem on the Base Sepolia network. It is a production-ready, visually stunning achievement-minting dApp designed to deliver a completely native Web2 feel. By using CertMint, users can design and claim fully on-chain achievement certificates and badges completely gaslessly under the hood, paying for claim fee settlements in Mock USD stablecoins instead of ETH. This shifts the complexity of blockchain fees away from the end user, making Web3 interaction as familiar and seamless as standard Web2 shopping carts.

### Part 2: How It Works under the Hood (UGF Integration)
At the core of CertMint's seamless user experience is the **Universal Gateway Framework (UGF)**. When a user creates a certificate, UGF intercepts the EVM transaction data, estimates the gas limits on Base Sepolia, and quotes a precise claim settlement fee denominated in Mock USD stablecoins. Once the user approves the USD fee payment, the framework coordinates the ERC-20 approval and triggers a sponsor execution contract under the hood. The framework pays the native gas fees on behalf of the user, executing the transaction on Base Sepolia while settling the payment in USD. The user's wallet prompts are simple and clean, consisting only of USD authorizations rather than complex native coin calculations, creating a secure, sponsor-backed minting pipeline.

### Part 3: Premium UI/UX & On-Chain Architecture
CertMint is crafted with premium visual aesthetics to captivate users at first glance. The design incorporates elegant glassmorphism panels, harmonious dark-mode neon gradients, and responsive micro-interactions that make the page feel alive. Unlike traditional NFTs that point to external, centralized servers for their images, CertMint generates its vector SVG certificate graphics directly on-chain within the smart contract’s ERC-721 metadata. When a user types their name and selects a badge category—such as "Web3 Developer" or "DeFi Pioneer"—the frontend renders an exact preview of the vector SVG layout in real time. Once claimed, the entire SVG code resides on the blockchain, guaranteeing that the achievement credentials will exist forever, independent of external hosting servers.

### Part 4: Interactive Gallery & Route Verification
To complete the product lifecycle, CertMint includes a searchable **Achievement Gallery** and dynamic shareable pages. The gallery connects to the Base Sepolia network, dynamically fetching the latest minted certificates straight from the blockchain and matching them alongside preloaded historical fallbacks. Users can search and filter certificates by token ID, badge type, or recipient name. Each certificate has a dedicated shareable detail route containing verification metadata, direct links to the holder's wallet address, smart contract contract details on BaseScan, and a Twitter share button with predefined copy. This allows users to instantly showcase their verifiable accomplishments to their community with a single click.

---

## Recommended Video Demo Walkthrough Flow

If you are recording a 2-3 minute video for your hackathon submission, we recommend following this layout:

1. **The Hook (0:00 - 0:30):** Start on the Landing Page. Show off the glowing mesh background and the rotating certificate preview card. Read the hero text: *"Claim Your Achievement. No ETH Needed."* Mention that this is powered by UGF and that native transaction fees are completely abstract.
2. **Real-time Certificate Design (0:30 - 1:00):** Click on "Mint Your Badge" to go to the Claim route. Type a name (e.g., your name or a test name) and toggle between different badge categories ("Web3 Developer", "DeFi Pioneer", etc.). Point out how the certificate SVG updates dynamically in real-time.
3. **The Simulator Mode Demonstration (1:00 - 1:45):** Toggle **Simulator Mode** on. Click "Get Claim Fee Quote". Highlight the claim fee box showing the `$0.05 USD` quote. Click "Claim Certificate". Explain each transition state as the button updates:
   - *Securing Connection...* (UGF Login)
   - *Approving Fee Settlement...* (ERC-20 approval simulation)
   - *Processing Fee Settlement...* (USD Payment confirmation)
   - *Minting NFT Certificate...* (Transaction validation)
   - *Certificate Secured!* (Confetti explosion!)
4. **Verification & Gallery (1:45 - 2:30):** Show the minted success card. Click "Verify on BaseScan" and "Verify on UGF Scan" to show how users trace their transactions. Navigate to the **Gallery** page, search for your minted certificate, and click into its detail view. Show off the Twitter share button and the on-chain metadata panel.
5. **Conclusion (2:30 - 3:00):** Wrap up by summarizing the value: CertMint is production-ready, stores all graphics on-chain, and uses UGF to deliver a gas-free, Web2-friendly onboarding experience for the next billion Web3 users.
