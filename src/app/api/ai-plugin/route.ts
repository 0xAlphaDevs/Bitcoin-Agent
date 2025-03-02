import { ACCOUNT_ID } from "@/app/config";
import { NextResponse } from "next/server";

export async function GET() {
  const pluginData = {
    openapi: "3.0.0",
    info: {
      title: "Bitcoin Agent",
      description: "API for the Bitcoin Agent",
      version: "1.0.0",
    },
    servers: [
      {
        url: "https://bitcoin-bitte-agent.vercel.app",
      },
    ],
    "x-mb": {
      "account-id": ACCOUNT_ID,
      assistant: {
        name: "Bitcoin Agent",
        description:
          "An assistant that answers with blockchain information, tells the user's near account id, show BTC wallet address and BTC balance, creates a Bitcon txn that utilizes near chain signatures, sends signed MPC transaction on bitcoin testnet and flips coins.",
        instructions:
          "You create near txns powered by chain signatures and send them on btc testnet, give blockchain information, tell the user's near account id, get BTC balance and flip coins. For blockchain transactions, first generate a transaction payload using the endpoint /api/tools/create-btc-mpc-txn, then explicitly use the 'generate-transaction' tool to sign received payload using NEAR account. After this txn is signed, use 'api/tools/send-btc-txn' to relay it to BTC testnet, make sure to provide the 'txHash' (received from signed near txn), 'btcReceiver' address, 'btcAmountInSatoshi' parameters when calling /api/tools/send-btc-txn. If any parameter is not provided, then ask for it explicitly.",
        tools: [{ type: "generate-transaction" }, { type: "sign-message" }],
        image: "https://cryptologos.cc/logos/bitcoin-btc-logo.svg",
      },
    },
    paths: {
      // TEST path
      "/api/tools/get-blockchains": {
        get: {
          summary: "get blockchain information",
          description: "Respond with a list of blockchains",
          operationId: "get-blockchains",
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        description: "The list of blockchains",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      // DONE
      "/api/tools/get-user": {
        get: {
          summary: "get user information",
          description: "Respond with user account ID and BTC address",
          operationId: "get-user",
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      accountId: {
                        type: "string",
                        description: "The user's account ID",
                      },
                      btcAddress: {
                        type: "string",
                        description: "The user's MPC BTC address",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      // DONE
      "/api/tools/get-btc-balance": {
        get: {
          operationId: "get-btc-balance",
          summary: "Get BTC balance",
          description: "Respond with BTC address and balance",
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      btcBalance: {
                        type: "string",
                        description: "The current BTC balance of the user",
                      },
                      btcAddress: {
                        type: "string",
                        description: "The user's BTC address",
                      },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Bad request",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "string",
                        description: "Error message",
                      },
                    },
                  },
                },
              },
            },
            "500": {
              description: "Error response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "string",
                        description: "Error message",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      // DONE
      "/api/tools/create-btc-mpc-txn": {
        get: {
          operationId: "create-btc-mpc-txn",
          summary:
            "Creates a NEAR txn that utilizes near chain signatures to send transaction on bitcoin testnet",
          description:
            "Generates a NEAR transaction payload for MPC contract to send bitcoin on bitcoin test. Recieved payload from this tool can be used directly in the generate-tx tool.",
          parameters: [
            {
              name: "btcReceiver",
              in: "query",
              required: true,
              schema: {
                type: "string",
              },
              description: "The Bitcon testnet wallet address of receiver",
            },
            {
              name: "btcAmountInSatoshi",
              in: "query",
              required: true,
              schema: {
                type: "string",
              },
              description: "The amount BTC in satoshi to transfer",
            },
          ],
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      transactionPayload: {
                        type: "object",
                        properties: {
                          signerId: {
                            type: "string",
                            description: "The signer's NEAR account ID",
                          },
                          receiverId: {
                            type: "string",
                            description: "The receiver's NEAR account ID",
                          },
                          actions: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                type: {
                                  type: "string",
                                  description:
                                    "The type of action (e.g., 'Transfer')",
                                },
                                params: {
                                  type: "object",
                                  properties: {
                                    deposit: {
                                      type: "string",
                                      description:
                                        "The amount to transfer in yoctoNEAR",
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Bad request",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "string",
                        description: "Error message",
                      },
                    },
                  },
                },
              },
            },
            "500": {
              description: "Error response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "string",
                        description: "Error message",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      // DONE
      "/api/tools/send-btc-txn": {
        get: {
          operationId: "send-btc-txn",
          summary: "Relay/Send the signed BTC testnet transaction",
          description:
            "Send signed transaction to BTC testnet. The signature is received form the txHash of the signed NEAR transaction. Other parameters are the BTC receiver address, BTC amount in satoshi.",
          parameters: [
            {
              name: "btcReceiver",
              in: "query",
              required: true,
              schema: {
                type: "string",
              },
              description: "The BTC address of the receiver",
            },
            {
              name: "btcAmountInSatoshi",
              in: "query",
              required: true,
              schema: {
                type: "string",
              },
              description: "The amount of BTC to transfer in satoshi",
            },
            {
              name: "txHash",
              in: "query",
              required: true,
              schema: {
                type: "string",
              },
              description: "The txHash of the signed txn from near",
            },
          ],
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      txHash: {
                        type: "string",
                        description:
                          "The txHash of the txn relayed to BTC chain :",
                      },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Bad request",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "string",
                        description: "Error message",
                      },
                    },
                  },
                },
              },
            },
            "500": {
              description: "Server error",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "string",
                        description: "Error message",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      // TEST path
      "/api/tools/coinflip": {
        get: {
          summary: "Coin flip",
          description: "Flip a coin and return the result (heads or tails)",
          operationId: "coinFlip",
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      result: {
                        type: "string",
                        description:
                          "The result of the coin flip (heads or tails)",
                        enum: ["heads", "tails"],
                      },
                    },
                  },
                },
              },
            },
            "500": {
              description: "Error response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "string",
                        description: "Error message",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  return NextResponse.json(pluginData);
}
