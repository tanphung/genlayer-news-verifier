import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, optimism, arbitrum, sepolia } from 'wagmi/chains';
import { defineChain } from 'viem';

export const genLayerStudionet = defineChain({
    id: 61999,
    name: 'GenLayer Studionet',
    nativeCurrency: {
        name: 'GEN',
        symbol: 'GEN',
        decimals: 18,
    },
    rpcUrls: {
        default: { http: ['https://studio.genlayer.com/api'] },
    },
    blockExplorers: {
        default: {
            name: 'GenLayer Explorer',
            url: 'https://explorer-studio.genlayer.com',
        },
    },
    iconUrl: '/genlayer-logo.png',
});

export const config = getDefaultConfig({
    appName: 'NewsVerify',
    appIcon: '/ptp-logo.png',
    projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || 'YOUR_WALLETCONNECT_PROJECT_ID',
    chains: [genLayerStudionet, mainnet, polygon, optimism, arbitrum, sepolia],
    ssr: false,
});
