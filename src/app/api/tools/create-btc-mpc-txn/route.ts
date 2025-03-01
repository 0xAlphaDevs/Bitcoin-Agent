import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Bitcoin as SignetBTC, BTCRpcAdapters, utils } from "signet.js";

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

export async function GET(request: Request) {
  try {
    const mbMetadataHeader = (await headers()).get("mb-metadata");
    const mbMetadata: { accountId: string } =
      mbMetadataHeader && JSON.parse(mbMetadataHeader);
    const { accountId } = mbMetadata || {};

    const { searchParams } = new URL(request.url);
    const btcReceiverAddress = searchParams.get("btcReceiver");
    const btcAmountInSatoshi = searchParams.get("btcAmountInSatoshi");

    if (!btcReceiverAddress || !btcAmountInSatoshi) {
      return NextResponse.json(
        {
          error:
            "btcReceiverAddress and btcAmountInSatoshi are required parameters",
        },
        { status: 400 }
      );
    }

    // Convert satoshi to BTC
    const btcAmount = Number(btcAmountInSatoshi) / 10 ** 8;

    if (!btcAmount) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // get sender btc address
    const { address: btcSenderAddress, publicKey: btcSenderPublicKey } =
      await Bitcoin.deriveAddressAndPublicKey(accountId as string, "bitcoin-1");

    // create MPC payload and txn
    const { mpcPayloads } = await Bitcoin.getMPCPayloadAndTransaction({
      publicKey: btcSenderPublicKey,
      from: btcSenderAddress,
      to: btcReceiverAddress,
      value: btcAmount.toString(),
    });

    const mpcTransactions = mpcPayloads.map(({ payload }) => ({
      receiverId: "v1.signer",
      actions: [
        {
          type: "FunctionCall",
          params: {
            methodName: "sign",
            args: {
              request: {
                payload: Array.from(payload),
                path: "bitcoin-1",
                key_version: 0,
              },
            },
            gas: "250000000000000",
            deposit: "1",
          },
        },
      ],
    }));

    return NextResponse.json(mpcTransactions[0]);
  } catch (error) {
    console.error("Error generating NEAR transaction payload:", error);
    return NextResponse.json(
      { error: "Failed to generate NEAR transaction payload" },
      { status: 500 }
    );
  }
}
