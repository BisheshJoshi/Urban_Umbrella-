# Prioritized Backlog

This backlog outlines the planned features and improvements for the Smart Contract and Frontend layers.

## P0 (High Priority)

- **Frontend: Vercel Analytics Integration**: finalize events for scan triggers and wallet connections.
- **Contracts: Security Suite**: Add more comprehensive test coverage for safety analysis scenarios.
- **Contracts: Static Analysis**: Integrate `slither` or similar for automated security checks.

## P1 (Near-Term Enhancements)

- **UI/UX: Structured Results**: Display scan results with risk badges, clear explanations, and matched security rules.
- **UI/UX: History View**: Client-side persistence for recent scan activity (LocalStorage or IndexedDB).
- **Extension-readiness**: Modularize React components for reuse in a Manifest V3 popup.

## P2 (Long-Term Roadmap)

- **Browser Extension Scaffold**: Initial MV3 setup with popup and background scripts.
- **Multi-Chain Support**: Adapters for various EVM-compatible networks.
- **Contract Fuzzing**: Integrate Diligence Fuzzing or Echidna for advanced safety verification.

## Non-Goals (For Now)

- Implementing a server-side backend for data persistence (focus is on client-side and smart contract logic).
- Handling private keys directly (relying on injected wallet providers like MetaMask).
