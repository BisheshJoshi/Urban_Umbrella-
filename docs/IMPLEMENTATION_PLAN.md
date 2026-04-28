# Implementation Plan

This plan outlines the roadmap for the Smart Contract and Frontend development tracks.

## Phase 1: Repository Stabilization (Completed)

Goal: Eliminate ambiguity and make local development predictable.

- Flattened `frontend/` directory structure.
- Removed outdated Python/ML backend references.
- Consolidated documentation to reflect the current state.

## Phase 2: Frontend Productization

Goal: Move from a connection demo to a usable safety scanning interface.

- **Heuristic Scanning**: Implement client-side heuristic analysis for transaction data.
- **Structured Results**: Render risk scores, explanations, and confidence indicators.
- **Persistence**: Add client-side history for recent scans using IndexedDB.
- **Error Handling**: Improve logic for handling varied wallet and RPC failures.

## Phase 3: Contract Security Suite

Goal: Expand the safety analysis capabilities on-chain.

- **Expanded Test Coverage**: Add comprehensive tests for multiple safety scenarios.
- **Static Analysis Integration**: Setup Slither/Solhint for continuous security auditing.
- **Fuzzing Groundwork**: Prepare contracts for advanced property-based testing.

## Phase 4: Browser Extension Track

Goal: Deliver a Manifest V3 extension for in-browser safety scanning.

- **Extension Project Structure**: Initial setup with `manifest.json` (MV3).
- **Reusable Components**: Modularize React parts for Popup and Options pages.
- **Background Orchestration**: Implement service workers for scan execution.

## Phase 5: Quality and Automation (In Progress)

Goal: Enforce quality on every change.

- **CI Workflow**: Maintain the updated `.github/workflows/ci.yml`.
- **E2E Testing**: Expand Playwright coverage for new frontend features.
- **Audit Automation**: Regular `npm audit` and security monitoring.
