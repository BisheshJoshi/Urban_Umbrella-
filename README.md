# Urban Umbrella

AI-assisted tooling for safety-oriented analysis workflows across blockchain and distributed systems.

Primary product focus:
- AI in blockchain safety scanning
- Learning/feedback loop for model improvement
- Browser extension UX for in-browser analysis workflows

This repository currently includes:
- **Contracts**: Solidity-based smart contracts managed with Hardhat, Ethers.js v6, OpenZeppelin, and Solhint.
- **Frontend**: A React 19 web application built with Vite, TypeScript, TanStack Router/Query/Form/Table/Virtual. Tested with Vitest and Playwright.
- **Documentation**: Project process, architecture, and audit reports under `docs/`.

## Repository Layout

```text
UrbanUmbrella/
|-- contracts/               # Smart contract development suite
|   |-- contracts/           # Solidity source files
|   |-- test/                # Contract unit tests
|   `-- hardhat.config.js    # Hardhat configuration
|-- docs/                    # Project architecture and implementation docs
|-- frontend/                # React web application (Vite + TypeScript)
|   |-- src/                 # Application source
|   |-- public/              # Static assets
|   `-- package.json         # Frontend dependencies
|-- .github/                 # CI/CD workflows
|-- LICENSE                  # MIT License
`-- README.md                # Project overview
```

## Prerequisites

- Node.js 18+
- npm 9+

## Quick Start

### 1) Smart Contracts

Navigate to the `contracts/` directory:

```powershell
cd contracts
npm install
npx hardhat test
```

### 2) Frontend Application

Navigate to the `frontend/` directory:

```powershell
cd frontend
npm install
npm run dev
```

The application will be available at `http://localhost:5173`.

## Core Features

- **Wallet Connectivity**: Full support for EVM wallet connections (via injected providers).
- **Vercel Analytics**: Built-in monitoring for page views and user interactions.
- **Modular Design**: Separated concerns between blockchain logic (Solidity) and user interface (React).

## suggested Next Steps

1. Integrate real-time AI scanning endpoints into the frontend.
2. Develop a browser extension target (`manifest.json` MV3) using the React components.
3. Expanded contract suite for more complex safety analysis scenarios.

## Copyright & License

Copyright (c) 2026 **Gabriele Iacopo Langellotto** and **Bishesh Joshi**

This project is licensed under the [MIT License](LICENSE). See the LICENSE file for details.
