import { headers } from "next/headers";
import { NextResponse } from "next/server";
import {
  Bitcoin as SignetBTC,
  BTCRpcAdapters,
  utils,
  RSVSignature,
  MPCSignature,
} from "signet.js";
import { providers, connect } from "near-api-js";
import { toRSV } from "signet.js/src/chains/utils";

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
    const txHash = searchParams.get("txHash");

    console.log("btcReceiverAddress", btcReceiverAddress);
    console.log("btcAmountInSatoshi", btcAmountInSatoshi);
    console.log("txHash", txHash);

    if (!btcReceiverAddress || !btcAmountInSatoshi || !txHash) {
      console.log(
        `btcReceiver: ${btcReceiverAddress}\nbtcAmountInSatoshi: ${btcAmountInSatoshi}\ntxHash: ${txHash}`
      );

      return NextResponse.json(
        {
          error:
            '"btcReceiver", "btcAmountInSatoshi" and "txHash" are required parameters',
        },
        { status: 400 }
      );
    }

    // Get the signature from the txHash and send it to BTC testnet
    const connectionConfig = {
      networkId: "mainnet",
      nodeUrl: "https://rpc.mainnet.near.org",
    };
    const near = await connect(connectionConfig);
    const txFinalOutcome = await near.connection.provider.txStatus(
      txHash,
      accountId,
      "FINAL"
    );

    const mpcSignatures: RSVSignature[] = [
      toRSV(providers.getTransactionLastResult(txFinalOutcome) as MPCSignature),
    ];

    // get sender btc address
    const { address: btcSenderAddress, publicKey: btcSenderPublicKey } =
      await Bitcoin.deriveAddressAndPublicKey(accountId as string, "bitcoin-1");

    // Convert satoshi to BTC
    const btcAmount = Number(btcAmountInSatoshi) / 10 ** 8;

    const { transaction } = await Bitcoin.getMPCPayloadAndTransaction({
      publicKey: btcSenderPublicKey,
      from: btcSenderAddress,
      to: btcReceiverAddress,
      value: btcAmountInSatoshi.toString(),
    });

    console.log("transaction", transaction);

    const signedTransaction = Bitcoin.addSignature({
      transaction,
      mpcSignatures,
    });

    const btcTxnHash = await Bitcoin.broadcastTx(signedTransaction);

    return NextResponse.json({ txHash: btcTxnHash }, { status: 200 });
  } catch (error) {
    console.error("Error generating EVM transaction:", error);
    return NextResponse.json(
      { error: "Failed to generate EVM transaction" },
      { status: 500 }
    );
  }
}
