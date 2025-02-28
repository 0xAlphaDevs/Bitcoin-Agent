import { ACCOUNT_ID } from "@/app/config";
import { NextResponse } from "next/server";

export async function GET() {
  const pluginData = {
    openapi: "3.0.0",
    info: {
      title: "Boilerplate",
      description: "API for the boilerplate",
      version: "1.0.0",
    },
    servers: [
      {
        url: "https://bitte-agent-test-ruby.vercel.app/",
      },
    ],
    "x-mb": {
      "account-id": ACCOUNT_ID,
      assistant: {
        name: "yshv assistant",
        description:
          "An assistant that answers with blockchain information, tells the user's account id, interacts with twitter, creates transaction payloads for NEAR and relays them using chain signatures on BTC blockchain, and flips coins.",
        instructions:
          "You create near and btc transactions, give blockchain information, tell the user's account id, interact with twitter and flip coins. For blockchain transactions, first generate a transaction payload using the endpoint /api/tools/create-near-transaction, then explicitly use the 'generate-transaction' tool to sign payload using NEAR MPC contract. Then this signed txn can be sent to BTC testnet, make sure to provide the 'to' address (receiver), 'txHash' (from near signed txn) and 'amount' (in satoshi) parameters when calling /api/tools/send-btc-txn. If any parameter is not provided, then ask for it explicitly.",
        tools: [{ type: "generate-transaction" }, { type: "sign-message" }],
      },
    },
    paths: {
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
      "/api/tools/twitter": {
        get: {
          operationId: "getTwitterShareIntent",
          summary: "Generate a Twitter share intent URL",
          description:
            "Creates a Twitter share intent URL based on provided parameters",
          parameters: [
            {
              name: "text",
              in: "query",
              required: true,
              schema: {
                type: "string",
              },
              description: "The text content of the tweet",
            },
            {
              name: "url",
              in: "query",
              required: false,
              schema: {
                type: "string",
              },
              description: "The URL to be shared in the tweet",
            },
            {
              name: "hashtags",
              in: "query",
              required: false,
              schema: {
                type: "string",
              },
              description: "Comma-separated hashtags for the tweet",
            },
            {
              name: "via",
              in: "query",
              required: false,
              schema: {
                type: "string",
              },
              description: "The Twitter username to attribute the tweet to",
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
                      twitterIntentUrl: {
                        type: "string",
                        description: "The generated Twitter share intent URL",
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
      "/api/tools/create-near-transaction": {
        get: {
          operationId: "createNearTransaction",
          summary: "Create a NEAR transaction payload",
          description:
            "Generates a NEAR transaction payload for MPC contract to sign which can be used directly in the generate-tx tool",
          parameters: [
            {
              name: "receiverId",
              in: "query",
              required: true,
              schema: {
                type: "string",
              },
              description: "The NEAR account ID of the receiver",
            },
            {
              name: "amount",
              in: "query",
              required: true,
              schema: {
                type: "string",
              },
              description: "The amount of NEAR tokens to transfer",
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
      "/api/tools/send-btc-txn": {
        get: {
          operationId: "createBtcTransaction",
          summary: "Create BTC transaction",
          description:
            "Generate an BTC transaction payload with specified recipient and amount to be used ",
          parameters: [
            {
              name: "to",
              in: "query",
              required: true,
              schema: {
                type: "string",
              },
              description: "The BTC address of the receiver",
            },
            {
              name: "amount",
              in: "query",
              required: true,
              schema: {
                type: "string",
              },
              description: "The amount of BTC to transfer",
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
