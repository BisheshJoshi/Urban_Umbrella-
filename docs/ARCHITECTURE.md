# Architecture (Protocol-Agnostic)

## Goals

- Keep core logic independent of any single blockchain or wallet.
- Support new networks through modular components.
- Enforce security boundaries for Web3 user interactions.

## Core Layers

### 1) Smart Contracts (Hardhat + Solidity)

The blockchain layer manages core logic and state on-chain.
- Source path: `contracts/contracts/`
- Test path: `contracts/test/`
- Tooling: Hardhat

### 2) Frontend (React + Vite + TypeScript)

The primary interface for users to interact with the security analyzer.
- Source path: `frontend/src/`
- Tooling: React 19, Vite, TypeScript
- State Management: React Context / Hooks / TanStack Query
- UI Components: TanStack Form / Table / Virtual
- Routing: TanStack Router
- Analytics: Vercel Analytics

### 3) Security Analysis (Ongoing)

The scanning logic is currently being integrated directly into the frontend service layer to provide heuristic risk assessment for EVM transactions and account states.

## Extension Strategy

The frontend is designed to be packaged as a browser extension (MV3) in future phases. The current architecture ensures that the UI and logic can be reused within an extension's popup or background scripts without major refactoring.
