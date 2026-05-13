# Deployment Guide - News Verification Dapp

## Prerequisites

- GenLayer CLI or Studio access
- Node.js 18+ (for frontend)
- npm or yarn

## Step 1: Deploy Smart Contract

### Using GenLayer Studio

1. Open GenLayer Studio
2. Create new contract file
3. Copy contents from `contracts/news_verifier.py`
4. Click "Deploy"
5. Note the contract address (e.g., `0x123...abc`)

### Using GenLayer CLI

```bash
genlayer deploy contracts/news_verifier.py
```

## Step 2: Configure Frontend

Update the contract address in `frontend/src/App.tsx`:

```typescript
const CONTRACT_ADDRESS = "0xYourDeployedContractAddress";
```

## Step 3: Install Dependencies

### Frontend

```bash
cd frontend

# If Vite wasn't initialized yet, run:
npm create vite@latest . -- --template react-ts

# Install dependencies
npm install
npm install @genlayer/js
```

### Standalone Client

```bash
cd genlayer_client
npm install
```

> [!NOTE]
> If `@genlayer/js` installation fails, check GenLayer documentation for registry configuration.

## Step 4: Run the Application

### Development Mode

```bash
cd frontend
npm run dev
```

Access at `http://localhost:5173`

### Production Build

```bash
cd frontend
npm run build
npm run preview
```

## Step 5: Test the Integration

### Via Frontend

1. Open the application
2. Enter a news URL (e.g., `https://www.bbc.com/news/article`)
3. Click "Verify News"
4. Wait for consensus (~30-60 seconds depending on network)
5. View results

### Via Node.js Script

```bash
cd genlayer_client
# Edit verify_news.js to set CONTRACT_ADDRESS and NEWS_URL
node verify_news.js
```

## Troubleshooting

### Contract Not Found

- Verify contract address is correct
- Ensure contract is deployed to the same network you're connecting to

### Connection Failed

- Check RPC URL in `GenLayerContext.tsx` (default: `http://localhost:4000`)
- Ensure GenLayer node/simulator is running

### Transaction Timeout

- Increase timeout in client configuration
- Check validator node status

## Network Configuration

### Local Development (Simulator)

```typescript
const client = new GenLayerClient({
  rpcUrl: 'http://localhost:4000',
  chainId: 1337
});
```

### Testnet

```typescript
const client = new GenLayerClient({
  rpcUrl: 'https://testnet.genlayer.com',
  chainId: <testnet_chain_id>
});
```

## Next Steps

- Add authentication/wallet integration
- Implement result caching
- Add UI for browsing verified news history
- Deploy to production network
