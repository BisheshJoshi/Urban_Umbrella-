# Frontend (React + Vite)

This is the active frontend application for the Web3 Security Suite.

This frontend is also intended to be the base UI layer for a future browser extension (popup/options pages).

It currently provides:

- Basic app shell
- EVM wallet authentication (injected provider)
- A basic scan UI wired to the backend `/scan` endpoint

## Run Locally

From `UrbanUmbrella/frontend/frontend/`:

```powershell
npm install
npm run dev
```

Default local URL:

```text
http://localhost:5173
```

## Available Scripts

- `npm run dev` - start local dev server
- `npm run build` - create production build
- `npm run preview` - preview production build
- `npm run lint` - run ESLint
- `npm run test:run` - run unit tests (Vitest)
- `npm run test:e2e` - run E2E smoke test (Playwright)

## Wallet Integration Notes

- EVM authentication is implemented in `src/EvmAuth.jsx`.
- For injected wallets, an EIP-1193 provider must be available (for example, MetaMask or a compatible wallet).

## Configuration

- `VITE_API_BASE_URL` sets the backend base URL (default: `http://127.0.0.1:8000`).
- `VITE_EVM_ALLOWED_CHAIN_IDS` controls the allowlist (comma-separated).
- Copy `.env.example` to `.env.local` for local overrides.

## Important Directory Note

The repository contains multiple frontend-related folders (`frontend/`, `frontend/frontend/`, and `frontend_tmp/`).

Use `frontend/frontend/` as the canonical app until consolidation is completed.

## Next Frontend Milestones

1. Add feedback labeling and scan history UI.
2. Improve UX states (loading/error/empty) and accessibility.
3. Reuse core UI components in a Manifest V3 extension shell.

## Copyright & License

Copyright (c) 2026 **Gabriele Iacopo Langellotto** and **Bishesh Joshi**

Licensed under the MIT License. See the [LICENSE](../../LICENSE) file for details.
