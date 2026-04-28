# Deployment Guide

## Local Development

### 1) Smart Contracts
Navigate to the `contracts/` directory and use Hardhat:

```powershell
cd contracts
npm install
npx hardhat test
```

### 2) Frontend Application
Navigate to the `frontend/` directory and use Vite:

```powershell
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`.

## Frontend Configuration

The frontend uses Vite environment variables for configuration.
- `VITE_API_BASE_URL`: Base URL for security analysis services (if external).

Create a `.env.local` file in the `frontend/` directory for local overrides.

## Production Deployment

### Frontend (Static Hosting)
- Build the production bundle: `npm run build` in the `frontend/` directory.
- Deploy the resulting `dist/` folder to a static hosting provider like Vercel, Netlify, or AWS S3.
- Vercel Analytics is integrated and will track data once deployed to Vercel.

### Smart Contracts
- Configure your deployment network in `contracts/hardhat.config.js`.
- Use a secure private key (via environment variables, never committed) to deploy to target networks.
- Example: `npx hardhat run scripts/deploy.js --network mainnet`
