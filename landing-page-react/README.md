# NewsVerify Landing Page (React + Web3)

Premium SaaS landing page with integrated Web3 wallet authentication using RainbowKit, wagmi, and ethers.js.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔗 Web3 Integration

### Wallet Connection
- **RainbowKit**: Beautiful wallet connection UI
- **wagmi**: React hooks for Ethereum
- **viem**: TypeScript interface for Ethereum
- **Supported Wallets**: MetaMask, WalletConnect, Coinbase Wallet, and more

### Supported Networks
- Ethereum Mainnet
- Polygon
- Optimism
- Arbitrum
- Sepolia (Testnet)

### Configuration

Update your WalletConnect Project ID in `src/config/wagmi.ts`:

```typescript
export const config = getDefaultConfig({
  appName: 'NewsVerify',
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // Get from https://cloud.walletconnect.com
  chains: [mainnet, polygon, optimism, arbitrum, sepolia],
});
```

## 📁 Project Structure

```
landing-page-react/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx          # Navigation with wallet button
│   │   ├── Hero.tsx            # Hero section
│   │   ├── Features.tsx        # Features grid
│   │   └── OtherSections.tsx   # Other landing sections
│   ├── config/
│   │   └── wagmi.ts            # Web3 configuration
│   ├── App.tsx                 # Main app component
│   ├── main.tsx                # Entry point with providers
│   ├── index.css               # Main styles
│   └── rainbowkit-custom.css   # Custom RainbowKit styles
├── index.html
└── package.json
```

## 🎨 Design Features

- **Glassmorphism**: Modern frosted glass effects
- **Vibrant Gradients**: Purple, pink, and cyan color scheme
- **Smooth Animations**: Scroll-triggered and hover effects
- **Responsive Design**: Mobile-first approach
- **Premium Typography**: Space Grotesk + Inter fonts
- **Custom RainbowKit Theme**: Matches NewsVerify design system

## 🔧 Customization

### Colors
Edit CSS custom properties in `src/index.css`:
```css
:root {
  --primary-500: #6366f1;
  --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  /* ... */
}
```

### Wallet Button Styling
Customize RainbowKit appearance in `src/rainbowkit-custom.css`

### Add More Chains
Update `src/config/wagmi.ts`:
```typescript
import { mainnet, polygon, avalanche } from 'wagmi/chains';

export const config = getDefaultConfig({
  // ...
  chains: [mainnet, polygon, avalanche],
});
```

## 🧪 Testing Wallet Connection

1. **Install MetaMask** browser extension
2. **Start dev server**: `npm run dev`
3. **Click "Connect Wallet"** in the navbar
4. **Select wallet provider** (MetaMask, WalletConnect, etc.)
5. **Approve connection** in wallet popup
6. **Verify address displayed** in navbar

## 🌐 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Deploy the dist/ folder
```

### GitHub Pages
```bash
npm run build
# Deploy the dist/ folder to gh-pages branch
```

## 📦 Dependencies

### Core
- React 18
- TypeScript
- Vite

### Web3
- wagmi ^2.5.7
- @rainbow-me/rainbowkit ^2.0.2
- viem ^2.7.15
- @tantml:parameter>
<parameter name="Complexity">5
