import { headers } from "next/headers";
import { NextResponse } from "next/server";
import {
  Bitcoin as SignetBTC,
  BTCRpcAdapters,
  utils,
  // RSVSignature,
  // MPCSignature,
  // BTCUnsignedTransaction,
} from "signet.js";
import { KeyPair } from "@near-js/crypto";

const CONTRACT = new utils.chains.near.contract.NearChainSignatureContract({
  networkId: "mainnet",
  contractId: "v1.signer",
  accountId: "",
  keypair: KeyPair.fromRandom("ed25519"),
});

const btcRpcAdapter = new BTCRpcAdapters.Mempool(
  "https://mempool.space/testnet4/api"
);

const Bitcoin = new SignetBTC({
  network: "mainnet",
  contract: CONTRACT,
  btcRpcAdapter,
});

export async function GET() {
  const mbMetadataHeader = (await headers()).get("mb-metadata");
  const mbMetadata: { accountId: string; evmAddress: string } | undefined =
    mbMetadataHeader && JSON.parse(mbMetadataHeader);

  const { accountId } = mbMetadata || {};
  const { address } = await Bitcoin.deriveAddressAndPublicKey(
    "0xmht.near" as string,
    "bitcoin-1"
  );

  const btcAddress = address;

  if (!accountId) {
    return NextResponse.json(
      {
        error: "Unable to find user data in the request",
      },
      {
        status: 500,
      }
    );
  }

  return NextResponse.json({ accountId, btcAddress });
}
