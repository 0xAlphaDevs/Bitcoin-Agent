"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Bitcoin, Bot, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className=" bg-white">
      <section className=" px-4 pt-16 pb-24 md:pt-24 md:pb-24">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Bitcoin <span className="text-emerald-600">Agent</span>
          </h1>
          <p className="text-lg text-gray-600 md:text-xl">
            An AI agent that uses NEAR chain signatures to interact with Bitcoin
            L1.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row justify-center">
            <Button
              size="lg"
              onClick={() =>
                //open in new tab
                window.open(
                  "https://wallet.bitte.ai/smart-actions?mode=debug&agentId=bitcoin-bitte-agent.vercel.app",
                  "_blank"
                )
              }
              className="bg-emerald-600 hover:bg-emerald-700 text-xl font-bold"
            >
              Launch Agent
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 md:py-24 border-t border-gray-100 bg-emerald-100">
        <h2 className="text-4xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid gap-8 md:grid-cols-3 px-8">
          <Card className="border-gray-100">
            <CardContent className="pt-6">
              <div className="rounded-full bg-emerald-50 w-12 h-12 flex items-center justify-center mb-6">
                <Wallet className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">NEAR Integration</h3>
              <p className="text-gray-600">
                Create and sign Bitcoin transactions using one NEAR account.
              </p>
            </CardContent>
          </Card>
          <Card className="border-gray-100">
            <CardContent className="pt-6">
              <div className="rounded-full bg-emerald-50 w-12 h-12 flex items-center justify-center mb-6">
                <Bitcoin className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Create BTC Transaction</h3>
              <p className="text-gray-600">
                Generate BTC transaction with this agent and send it to Bitcoin
                testnet.
              </p>
            </CardContent>
          </Card>
          <Card className="border-gray-100">
            <CardContent className="pt-6">
              <div className="rounded-full bg-emerald-50 w-12 h-12 flex items-center justify-center mb-6">
                <Bot className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Bitte AI Agent</h3>
              <p className="text-gray-600">
                An AI agent running on NEAR mainnet powered by Bitte.ai runtime.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className=" px-4 py-10 md:py-20 border-t border-gray-100">
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join the future of Bitcoin Agents and unlock the full potential of
            the NEAR blockchain.
          </p>
          <Button
            size="lg"
            onClick={() =>
              //open in new tab
              window.open(
                "https://wallet.bitte.ai/smart-actions?mode=debug&agentId=bitcoin-bitte-agent.vercel.app",
                "_blank"
              )
            }
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Launch Agent
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-4">
        <div className="px-4 text-center text-gray-600">
          <a href="https://www.alphadevs.dev/" target="_blank" rel="noreferrer">
            <p> © Team AlphaDevs</p>
          </a>
        </div>
      </footer>
    </div>
  );
}
