## Bitcon Bitte Agent

An AI agent that uses NEAR chain signatures to interact with Bitcoin L1 | Powered by Bitte.ai

### Features

- Create and send Bitcoin transactions on using NEAR account
- Provide information about your NEAR account and the associated BTC testnet address, including their balances.

## Table of Contents

1. [All Links](#links)
2. [Multichain Transactions](#multichain-transactions)
3. [Sponsers Tech Stack](#sponsers-tech-stack)
4. [High Level Architecture](#high-level-architecture)
5. [App Demo](#app-demo-screenshots)
6. [Future Vision](#future-vision)
7. [Instructions to setup and run locally ](#instructions-to-setup-agent-locally)
8. [Team](#team)

## Links

- [Agent Code](https://github.com/0xAlphaDevs/Bitcoin-Agent)
- [Deployed URL](https://bitcoin-bitte-agent.vercel.app/)
- [Presentation](https://www.canva.com/design/DAGgeRzhmbY/sUowXAa1lkzz2uMleEVoTA/view)
- [Demo Video]()

## Multichain Transactions

> Test MPC signed transaction to send 10,000 sats on Bitcoin testnet using NEAR mainnet account.

- [Near MPC Signature Txn](https://nearblocks.io/txns/Hii4hGHe4WmVSvC9KqXiLNkux6FygZ9sYYHeXsPJ7KPJ) -> [Corresponding BTC Testnet Txn](https://mempool.space/testnet4/tx/6d21b9e660d2f73689b5bb417621a4588bad5a2a7fce03fc213b32c90f0f5d76)

## Sponsers Tech Stack

- NEAR Mainnet
- NEAR Chain Signatures
- Bitte AI Agent

## High Level Architecture

![High Level Architecture](/public/high-level-architecture.png)

## App Demo Screenshots

![Landing Page](/public/landing-page.png)

![Deployed AI Agent](/public/deployed-ai-agent.png)

![AI Agent Running on Bitte.ai](/public/agent-on-bitte.png)

## Future Vision

- Next step is to add much more sophisticated txns on BTC L1. Including etching, airdrop, and trading of Runes with just one NEAR account.

- Further we want user to be able to do Automated Runes trading with AI agent.

- To support this, we will be developing analytics tools to search and filter wallets for a rune directly from agent dashboard that helps user copy trades of a wallet in single click.

- The ultimate goal is to make an agent that can literally do anything and everything on Bitcoin network

## Instructions to setup agent locally

1. Clone the repo using `git clone https://github.com/0xAlphaDevs/Bitcoin-Agent`
2. Install dependencies using `pnpm install`
3. Copy `.env.example` and add your BITTE_API_KEY.
4. Start the development server using `pnpm dev`
5. Access the agent locally in your browser at [localhost:3001](http://localhost:3001)

## Team

Team [AlphaDevs](https://www.alphadevs.dev) 👇

### Github

[Harsh Tyagi](https://github.com/mr-harshtyagi)
[Yashasvi Chaudhary](https://github.com/0xyshv)

### Twitter / X

[Harsh Tyagi](https://twitter.com/0xmht)
[Yashasvi Chaudhary](https://twitter.com/0xyshv)

## Thanks

- Feel free to reach out to the [AlphaDevs team](https://www.alphadevs.dev) with any questions or issues.

- We appreciate your interest in our project and welcome contributions and feature suggestions.
