# CI/CD Guide

This document defines the CI/CD baseline for the Urban Umbrella repository.

## Objectives

- Run frontend checks (React/Vite) automatically on pull requests and pushes to `main`.
- Run contract checks (Hardhat/Solidity) automatically.
- Keep pipeline feedback fast and deterministic.

## Repository Structure

The CI configuration assumes the following flat structure:
- `frontend/`: React application.
- `contracts/`: Solidity smart contracts.

## Current Workflow

The repository uses `.github/workflows/ci.yml` with the following jobs:

### 1) Frontend (React)
- **Environment**: Node 20
- **Steps**:
  - `npm ci`: Clean install.
  - `npm audit`: Security check.
  - `npm run lint`: ESLint check.
  - `npm run test:run`: Vitest unit tests.
  - `npm run build`: Production build.
  - `npx playwright install`: Browser setup.
  - `npm run test:e2e`: E2E smoke tests.

### 2) Contracts (Solidity)
- **Environment**: Node 20
- **Steps**:
  - `npm ci`: Clean install.
  - `npm run lint`: Solhint / ESLint check.
  - `npm run test`: Hardhat tests.
  - `npm audit`: Security check.

## Staged Rollout Plan

1. **Stabilization**: Ensure all unit and E2E tests pass consistently in the CI environment.
2. **Quality Gates**: Add coverage thresholds for both frontend and contracts.
3. **Deployment**: Add a deployment job for static hosting (e.g., Vercel) for the frontend once the target environment is finalized.
