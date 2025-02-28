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

const CONTRACT = new utils.chains.near.contract.NearChainSignatureContract({
  networkId: "mainnet",
  contractId: "v1.signer",
});

const btcRpcAdapter = new BTCRpcAdapters.Mempool(
  "https://mempool.space/testnet4/api"
);

const Bitcoin = new SignetBTC({
  network: "testnet",
  contract: CONTRACT,
  btcRpcAdapter,
});

export async function GET() {
  const mbMetadataHeader = (await headers()).get("mb-metadata");
  const mbMetadata: { accountId: string } =
    mbMetadataHeader && JSON.parse(mbMetadataHeader);

  const { accountId } = mbMetadata || {};
  console.log("accountId", accountId);

  // const { searchParams } = new URL(request.url);
  // const accountId = searchParams.get("accountId");

  const { address } = await Bitcoin.deriveAddressAndPublicKey(
    accountId as string,
    // "0xmht.near",
    "bitcoin-1"
  );

  const btcAddress = address;

  // if (!accountId) {
  //   return NextResponse.json(
  //     {
  //       error: "Unable to find user data in the request",
  //     },
  //     {
  //       status: 500,
  //     }
  //   );
  // }

  return NextResponse.json({ accountId, btcAddress });
}
