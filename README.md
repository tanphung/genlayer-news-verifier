# News Verification Dapp

A decentralized application (Dapp) powered by GenLayer that verifies the trustworthiness of news articles using AI and blockchain consensus.

## Project Structure

```
news_verification_dapp/
├── contracts/
│   └── news_verifier.py          # GenLayer Intelligent Contract
├── frontend/                      # React + Vite frontend
│   ├── src/
│   │   ├── contexts/
│   │   │   └── GenLayerContext.tsx
│   │   ├── components/
│   │   │   └── NewsVerifier.tsx
│   │   └── App.tsx
│   └── package.json
├── genlayer_client/               # Standalone Node.js integration
│   ├── verify_news.js
│   └── package.json
└── README.md
```

## Features

- **Web Data Access**: Fetches real-time news content from any URL
- **AI-Powered Analysis**: Uses LLM to analyze credibility, bias, and extract key facts
- **Blockchain Consensus**: Ensures verification results are agreed upon by validators
- **Trust Score**: Assigns a 0-100 score indicating article credibility
- **History Tracking**: Stores all verified news for future reference

## Smart Contract

The `NewsVerifier` contract provides:

- `verify_news(url: str)` - Verifies a news article and returns analysis
- `get_verification_result(url: str)` - Retrieves stored verification
- `get_all_news()` - Lists all verified URLs

## Setup

### 1. Deploy the Contract

```bash
# Using GenLayer CLI or Studio
genlayer deploy contracts/news_verifier.py
```

### 2. Frontend Setup

```bash
cd frontend
npm install
# Update CONTRACT_ADDRESS in src/App.tsx
npm run dev
```

### 3. Standalone Client Setup

```bash
cd genlayer_client
npm install
# Update CONTRACT_ADDRESS in verify_news.js
node verify_news.js
```

## Usage

### Via Frontend

1. Open the frontend in your browser
2. Enter a news article URL
3. Click "Verify News"
4. Wait for consensus (may take time depending on network)
5. View the trust score, summary, bias level, and key facts

### Via Node.js Script

```javascript
const result = await client.writeContract({
    address: CONTRACT_ADDRESS,
    method: 'verify_news',
    args: ['https://example.com/article'],
    value: 0
});
```

## Technology Stack

- **GenLayer**: Intelligent Contract platform
- **React + TypeScript**: Frontend framework
- **Vite**: Build tool
- **@genlayer/js**: GenLayer JavaScript SDK

## Important Notes

> [!IMPORTANT]
> The `@genlayer/js` package may require access to GenLayer's npm registry. Check GenLayer documentation for installation instructions.

> [!WARNING]
> This is a prototype. The contract uses `strict_eq` for consensus which requires exact LLM output matches. For production, consider implementing a custom comparator with tolerance.

## License

MIT
