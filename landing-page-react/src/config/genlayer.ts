// GenLayer configuration
export const GENLAYER_CONFIG = {
    rpcUrl: import.meta.env.VITE_GENLAYER_RPC_URL || 'https://studio.genlayer.com/api',
    chainId: parseInt(import.meta.env.VITE_GENLAYER_CHAIN_ID || '61999'),
    networkName: import.meta.env.VITE_GENLAYER_NETWORK_NAME || 'GenLayer Studionet'
};

// Contract addresses (update after deployment)
export const CONTRACTS = {
    NEWS_VERIFIER: import.meta.env.VITE_NEWS_VERIFIER_ADDRESS || '0xYourContractAddressHere'
};

// Network configuration
export const NETWORKS = {
    local: {
        rpcUrl: 'http://localhost:4000',
        chainId: 1337,
        name: 'GenLayer Local Simulator'
    },
    studionet: {
        rpcUrl: 'https://studio.genlayer.com/api',
        chainId: 61999,
        name: 'GenLayer Studionet'
    },
    testnet: {
        rpcUrl: 'https://testnet-rpc.genlayer.com',
        chainId: 123456,
        name: 'GenLayer Testnet'
    }
};

export const DEFAULT_NETWORK = 'studionet';
