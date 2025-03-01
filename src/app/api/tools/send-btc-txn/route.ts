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
import {
  ExecutionOutcomeWithId,
  FinalExecutionOutcome,
} from "near-api-js/lib/providers";

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

    // get SuccessValue from receipts_outcome and convert base64 to string
    const decodedSuccessValue = getDecodedSuccessValue(
      txFinalOutcome.receipts_outcome
    );
    const mpcSignature: MPCSignature = JSON.parse(
      decodedSuccessValue as string
    );

    console.log("mpcSignature", mpcSignature);

    const mpcSignatures: RSVSignature[] = [toRSV(mpcSignature)];

    console.log("mpcSignatures", mpcSignatures);

    // get sender btc address
    const { address: btcSenderAddress, publicKey: btcSenderPublicKey } =
      await Bitcoin.deriveAddressAndPublicKey(accountId as string, "bitcoin-1");

    const { transaction } = await Bitcoin.getMPCPayloadAndTransaction({
      publicKey: btcSenderPublicKey,
      from: btcSenderAddress,
      to: btcReceiverAddress,
      value: btcAmountInSatoshi.toString(),
    });

    console.log("transaction", transaction);

    // set maximum fee rate
    transaction.psbt.setMaximumFeeRate(10000);

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

const getDecodedSuccessValue = (receiptsOutcome: ExecutionOutcomeWithId[]) => {
  let successReceiptId: string | null = null;
  let successValue = null;

  // Find the SuccessReceiptId
  receiptsOutcome.forEach((receipt) => {
    //@ts-ignore
    if (receipt.outcome.status.SuccessReceiptId) {
      //@ts-ignore
      successReceiptId = receipt.outcome.status.SuccessReceiptId;
    }
  });

  if (!successReceiptId) return null; // Return null if no SuccessReceiptId is found

  // Find the SuccessValue corresponding to the SuccessReceiptId
  receiptsOutcome.forEach((receipt) => {
    if (
      receipt.id === successReceiptId &&
      //@ts-ignore
      receipt.outcome.status.SuccessValue !== undefined
    ) {
      //@ts-ignore
      successValue = receipt.outcome.status.SuccessValue;
    }
  });

  if (!successValue) return null; // Return null if no SuccessValue is found

  // Decode from Base64 to String
  try {
    return atob(successValue); // Decode Base64
  } catch (error) {
    console.error("Error decoding Base64:", error);
    return null;
  }
};
