# 🍯 HoneyChain — Verifiable Honey Traceability from Hive to Table

[![CI Pipeline](https://github.com/CODEwthJit/HONEYCHAIN/actions/workflows/ci.yml/badge.svg)](https://github.com/CODEwthJit/HONEYCHAIN/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-gray?logo=solidity)](https://soliditylang.org/)
[![Network](https://img.shields.io/badge/Network-Arbitrum_Sepolia-28A0F0?logo=arbitrum)](https://sepolia.arbiscan.io/address/0xcf29656Cdcc7D94C3dbAD2eAf204e8FCA129e988)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **HoneyChain** is an end-to-end, zero-cost, enterprise-grade blockchain traceability platform designed to combat global honey adulteration. It pairs high-speed relational query performance with immutable Arbitrum Sepolia L2 smart contracts, in-browser cryptographic PDF verification, and a completely frictionless consumer experience requiring **₹0 in gas fees and zero crypto knowledge** for buyers.

---

## 🌟 Live Deployment & Smart Contracts

| Component | Network / Provider | Address / Link |
|---|---|---|
| **HoneyBatchRegistry Contract** | Arbitrum Sepolia L2 (Chain ID: `421614`) | [`0xcf29656Cdcc7D94C3dbAD2eAf204e8FCA129e988`](https://sepolia.arbiscan.io/address/0xcf29656Cdcc7D94C3dbAD2eAf204e8FCA129e988) |
| **Genesis Deployment Transaction** | Arbitrum Sepolia L2 | [`0x92fa5371f6...7003b5ba1d`](https://sepolia.arbiscan.io/tx/0x92fa5371f6af3420845472f76c17ffefc6d284c8f26368e7966ecf7003b5ba1d) |
| **Block Explorer** | Arbiscan Testnet | [View on Arbiscan](https://sepolia.arbiscan.io/address/0xcf29656Cdcc7D94C3dbAD2eAf204e8FCA129e988) |
| **CI / CD Automated Pipeline** | GitHub Actions | [Workflows Status](https://github.com/CODEwthJit/HONEYCHAIN/actions) |

---

## 🐝 The Problem HoneyChain Solves

Honey is the **third most adulterated food product in the world**. Industrial illicit actors routinely:
- Dilute authentic raw honey with high-fructose corn syrup (HFCS) and C4 sugar cane syrups.
- Utilize resin filters to strip geographic pollen markers, concealing country of origin.
- Forge ISO/IEC 17025 laboratory Certificates of Analysis (CoA) with altered purity metrics.
- Centralized supply-chain databases allow rogue actors to rewrite audit logs without tamper evidence.

### The HoneyChain Solution:
1. **The 4 Tiers of Truth**: Explicitly distinguishes between *self-submitted declarations*, *authenticated relational logs*, *on-chain cryptographic hashes*, and *independent physical laboratory validations*.
2. **Directed Acyclic Graph (DAG) Batch Lineage**: Accurately tracks real-world honey blending and splitting operations (e.g., merging 3 hive harvests into a processing tank, then splitting into 1,000 retail jars) without breaking lineage.
3. **In-Browser Zero-Upload PDF Verification**: Users drag and drop lab reports to calculate their SHA-256 fingerprint client-side using the Web Crypto API and compare it against on-chain records.
4. **Instant Emergency Recall System**: When adulteration or antibiotic contamination is detected post-distribution, authorized certifiers freeze the batch on-chain, instantly displaying prominent recall banners on consumer QR scans.
5. **Zero Crypto Required for Consumers**: Ordinary shoppers scan a standard QR code on any honey jar with their native smartphone camera. No wallet, no gas, no browser extension.

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    subgraph Physical Supply Chain
        A[Beekeeper: Extraction & Harvest] --> B[Testing Lab: ISO 17025 EA-IRMS & HPLC]
        B --> C[Processor: Clarification & Blending]
        C --> D[Packager: Bottling & QR Labeling]
        D --> E[Consumer: Store Shelf / Dining Table]
    end

    subgraph Data & Storage Layer
        A -->|Harvest Details| DB[(PostgreSQL / Drizzle ORM)]
        B -->|Lab Metrics & CoA PDF| DB
        C -->|DAG Split/Merge Lineage| DB
        D -->|Lot & Packaging Metadata| DB
    end

    subgraph Blockchain Consensus Layer
        A -.->|Anchor Genesis Batch| SC[HoneyBatchRegistry.sol<br/>Arbitrum Sepolia L2]
        B -.->|Anchor PDF SHA-256 Hash| SC
        C -.->|Anchor Processing Events| SC
        D -.->|Authorize Bottle Lots| SC
        B -.->|Emergency Recall Trigger| SC
    end

    subgraph Consumer Verification
        E -->|Scan QR with Phone| UI[Next.js 16 Web App]
        UI -->|Fetch Fast Metadata| DB
        UI -->|Cryptographic Verification| SC
        UI -->|In-Browser WebCrypto SHA-256| B
    end
```

---

## ✨ Key Features

### 🔍 1. Interactive QR Scanner & Batch Lookup
- **Dynamic Origin Adaptation**: QR codes automatically adapt to their host domain (`localhost`, custom domain, or Vercel production), ensuring instant smartphone compatibility.
- **In-Browser Camera Scanner**: Real-time webcam and smartphone camera scanning with targeted reticle, photo upload, and instant manual batch code search.

### 🛡️ 2. The 4 Tiers of Truth Philosophy
| Tier | Name | Description | Trust Level |
|---|---|---|---|
| **Tier 1** | Submitted | Self-declared metadata entered by a beekeeper (e.g. ambient temperature, floral origin). | Informational |
| **Tier 2** | Recorded | Authenticated logs stored in relational PostgreSQL with audited timestamps. | Operational |
| **Tier 3** | Anchored | Immutable cryptographic hash anchored to the Arbitrum Sepolia blockchain. | Tamper-Evident |
| **Tier 4** | Verified | Physical laboratory testing (EA-IRMS isotope ratio mass spectrometry, HPLC, HMF) matched with cryptographic PDF hashes. | Empirical Truth |

### 📄 3. In-Browser Cryptographic Lab Report Verifier
- Uses the **W3C Web Crypto API** directly inside the client browser.
- Computes the SHA-256 cryptographic digest without uploading files to any external server.
- Compares the digest against the on-chain laboratory certificate hash to prove the certificate has not been modified by a single byte.

### ⚠️ 4. On-Chain Emergency Recall Protocol
- Emergency recall capability governed by strict OpenZeppelin `AccessControl` roles.
- When an adulteration event is recorded, the smart contract transitions the batch state to `RECALLED`.
- Any subsequent consumer scan prominently highlights safety warnings, batch revocation dates, and return advisories.

---

## 🛠️ Tech Stack & Zero-Cost Architecture

- **Frontend & Server Components**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack, Partial Prerendering) + [React 19](https://react.dev/)
- **Styling & UI**: [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), Lucide Icons
- **Database & ORM**: [Drizzle ORM](https://orm.drizzle.team/), PostgreSQL, [Supabase](https://supabase.com/) (Free Tier)
- **Smart Contracts**: [Solidity 0.8.24](https://soliditylang.org/), [OpenZeppelin Contracts v5](https://docs.openzeppelin.com/contracts/5.x/)
- **Blockchain Network**: [Arbitrum Sepolia L2](https://arbitrum.io/) (Free Testnet, sub-cent gas fees)
- **Development Tooling**: [Hardhat](https://hardhat.org/), TypeScript, [pnpm v12](https://pnpm.io/)
- **Hosting & CI/CD**: [Vercel](https://vercel.com/) (Hobby Tier) + [GitHub Actions](https://github.com/features/actions)

---

## 📁 Repository Structure

```text
HONEYCHAIN/
├── .github/
│   └── workflows/
│       └── ci.yml               # Automated CI (lint, types, tests, build)
├── contracts/                   # Solidity Hardhat Workspace
│   ├── contracts/
│   │   ├── HoneyAccessControl.sol   # Role-based access control
│   │   └── HoneyBatchRegistry.sol   # Core batch registry & recall logic
│   ├── scripts/
│   │   └── deploy.ts            # Arbitrum Sepolia deployment script
│   ├── test/
│   │   └── HoneyBatchRegistry.test.ts # Hardhat unit tests (5 passing)
│   ├── hardhat.config.ts        # Hardhat configuration & network RPCs
│   └── package.json
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── layout.tsx           # Root layout with hydration safety
│   │   ├── page.tsx             # Home landing page with QR Scanner modal
│   │   ├── dashboard/           # Supply chain operations & recall portal
│   │   ├── trace/[batchCode]/   # Consumer batch trace & timeline
│   │   └── verify-document/     # In-browser SHA-256 PDF report verifier
│   ├── components/              # Modular UI components
│   │   ├── qr/                  # QrCard & QrScannerModal
│   │   ├── timeline/            # JourneyTimeline & stage details
│   │   ├── ui/                  # Buttons, cards, navbar, badges
│   │   └── verifier/            # DocumentVerifier
│   ├── db/                      # Drizzle ORM schema & client
│   │   ├── schema.ts            # Batches, LabTests, Lineage DAG schema
│   │   └── index.ts
│   └── lib/
│       ├── blockchain/          # Deployed ABI and contractAddresses.json
│       ├── crypto/              # SHA-256 Web Crypto utilities
│       └── data/                # Sample batches (HNY-2026-0001, HNY-2026-0002)
├── .env.example                 # Documented environment template
├── pnpm-workspace.yaml          # pnpm workspace config
└── package.json                 # Web application dependencies
```

---

## 🚀 Quickstart & Local Development

### Prerequisites
- [Node.js](https://nodejs.org/) v20.x or v22.x
- [pnpm](https://pnpm.io/) v10+ or v12+

### 1. Clone the Repository
```bash
git clone https://github.com/CODEwthJit/HONEYCHAIN.git
cd HONEYCHAIN
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:
```bash
cp .env.example .env.local
```

Populate the required values:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_CHAIN_ID=421614
NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
NEXT_PUBLIC_REGISTRY_CONTRACT_ADDRESS=0xcf29656Cdcc7D94C3dbAD2eAf204e8FCA129e988
NEXT_PUBLIC_ACCESS_CONTROL_CONTRACT_ADDRESS=0xcf29656Cdcc7D94C3dbAD2eAf204e8FCA129e988
NEXT_PUBLIC_SUPABASE_URL=https://honeychain-demo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/honeychain
```

### 4. Run the Development Server
```bash
pnpm dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## ⚡ Smart Contracts Testing & Deployment

### 1. Run Smart Contract Unit Tests
```bash
cd contracts
pnpm test
```

Expected output:
```text
  HoneyBatchRegistry
    ✔ should allow an authorized beekeeper to create a batch
    ✔ should revert if an unauthorized account attempts to create a batch
    ✔ should allow a laboratory to record quality tests and anchor document hash
    ✔ should allow a processor to record transformations (DAG lineage)
    ✔ should allow emergency recall and prevent subsequent mutations

  5 passing (896ms)
```

### 2. Deploy to Arbitrum Sepolia
```bash
cd contracts
pnpm deploy:sepolia
```

---

## 🧪 Demo Scenarios to Try

1. **Verify an Authentic Batch (`HNY-2026-0001`)**:
   - Navigate to `/trace/HNY-2026-0001`.
   - Click **"Verify on Arbiscan"** to inspect the real transaction on Arbitrum Sepolia.
   - Scan the rendered QR code with your smartphone camera to see seamless mobile routing.
2. **Inspect an Emergency Recalled Batch (`HNY-2026-0002`)**:
   - Navigate to `/trace/HNY-2026-0002`.
   - Observe the prominent recall warning banner, contaminated reason, and health advisories.
3. **In-Browser Certificate Verification**:
   - Go to `/verify-document`.
   - Drop a PDF certificate to watch client-side Web Crypto SHA-256 calculation and on-chain hash matching.
4. **Supply Chain Operations**:
   - Go to `/dashboard` to simulate beekeeper batch creation, laboratory test logging, and admin recall execution.

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ❤️ for consumer transparency and food supply chain integrity.
</p>
