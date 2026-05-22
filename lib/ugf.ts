import { BrowserProvider, JsonRpcSigner, ethers } from "ethers";
import { useMemo, useState } from "react";
import { type Account, type Chain, type Client, type Transport, encodeFunctionData } from "viem";
import { type Config, useConnectorClient } from "wagmi";
import {
  BASE_SEPOLIA_CHAIN_ID,
  BASE_SEPOLIA_CHAIN_TYPE,
  TYI_USD_PAYMENT_COIN,
  UGFClient,
  type QuoteResponse,
} from "@tychilabs/ugf-testnet-js";
import { CERTMINT_ABI, CERTMINT_CONTRACT_ADDRESS } from "./contract";

// Initialize the UGF Client (Testnet SDK defaults to testnet endpoints)
export const ugfClient = new UGFClient();

/**
 * Wagmi to Ethers v6 Signer Adapter
 */
export function clientToSigner(client: Client<Transport, Chain, Account>) {
  const { account, chain, transport } = client;
  const network = {
    chainId: chain.id,
    name: chain.name,
  };
  const provider = new BrowserProvider(transport, network);
  const signer = new JsonRpcSigner(provider, account.address);
  return signer;
}

export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: client } = useConnectorClient<Config>({ chainId });
  return useMemo(() => (client ? clientToSigner(client) : undefined), [client]);
}

export type UGFClaimStep =
  | "idle"
  | "authenticating"
  | "quoting"
  | "settling"
  | "executing"
  | "confirming"
  | "success"
  | "error";

export function useUGFClaim() {
  const [step, setStep] = useState<UGFClaimStep>("idle");
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const signer = useEthersSigner();

  // Helper to fetch quote before proceeding
  const getGasQuote = async (name: string, badge: string, date: string): Promise<QuoteResponse | null> => {
    if (!signer) {
      setErrorMsg("Wallet not connected");
      return null;
    }

    try {
      setStep("quoting");
      setErrorMsg(null);

      const address = await signer.getAddress();
      
      // Encode target transaction data using viem
      const data = encodeFunctionData({
        abi: CERTMINT_ABI,
        functionName: "claimCertificate",
        args: [name, badge, date],
      });

      const txObject = {
        to: CERTMINT_CONTRACT_ADDRESS,
        data,
        value: "0",
      };

      const fetchedQuote = await ugfClient.quote.get({
        payment_coin: TYI_USD_PAYMENT_COIN,
        payer_address: address,
        payment_chain: BASE_SEPOLIA_CHAIN_ID,
        payment_chain_type: BASE_SEPOLIA_CHAIN_TYPE,
        tx_object: JSON.stringify(txObject),
        dest_chain_id: BASE_SEPOLIA_CHAIN_ID,
        dest_chain_type: BASE_SEPOLIA_CHAIN_TYPE,
      });

      setQuote(fetchedQuote);
      setStep("idle"); // Reset to idle so user can click "Claim"
      return fetchedQuote;
    } catch (err: any) {
      console.error("UGF Quote Error:", err);
      setErrorMsg(err.message || "Failed to fetch claim fee quote");
      setStep("error");
      return null;
    }
  };

  // Full claim flow: Settle fee -> Execute gaslessly -> Confirm
  const executeClaim = async (
    name: string,
    badge: string,
    date: string,
    preFetchedQuote?: QuoteResponse
  ) => {
    if (!signer) {
      setErrorMsg("Wallet not connected");
      setStep("error");
      return;
    }

    try {
      let activeQuote = preFetchedQuote || quote;

      // 1. Authenticate with UGF
      setStep("authenticating");
      setErrorMsg(null);
      await ugfClient.auth.login(signer);

      // 2. Fetch quote if not already available
      if (!activeQuote) {
        setStep("quoting");
        const freshQuote = await getGasQuote(name, badge, date);
        if (!freshQuote) return;
        activeQuote = freshQuote;
      }

      // 3. Settle Fee (Mock USD authorization)
      setStep("settling");
      await ugfClient.payment.x402.execute({
        quote: activeQuote,
        signer,
        token: TYI_USD_PAYMENT_COIN,
      });

      // 4. Execute transaction gaslessly on Base Sepolia
      setStep("executing");
      
      const data = encodeFunctionData({
        abi: CERTMINT_ABI,
        functionName: "claimCertificate",
        args: [name, badge, date],
      });

      const buildTx = async () => {
        return {
          to: CERTMINT_CONTRACT_ADDRESS,
          data,
          value: BigInt(0),
        };
      };

      // 5. Submit to target EVM chain and poll for confirmation
      setStep("confirming");
      const executionResult = await ugfClient.chains.evm.sponsorAndExecute(
        activeQuote.digest,
        signer,
        buildTx,
        {
          intervalMs: 2000,
          maxAttempts: 30,
          onTick: (status, attempt) => {
            console.log(`Polling transaction confirmation: attempt ${attempt}, status: ${status.status}`);
          },
        }
      );

      setTxHash(executionResult.userTxHash);
      setStep("success");
    } catch (err: any) {
      console.error("UGF Execution Error:", err);
      setErrorMsg(err.message || "Failed to execute gasless transaction");
      setStep("error");
    }
  };

  const resetClaim = () => {
    setStep("idle");
    setQuote(null);
    setTxHash(null);
    setErrorMsg(null);
  };

  return {
    step,
    quote,
    txHash,
    errorMsg,
    getGasQuote,
    executeClaim,
    resetClaim,
  };
}
