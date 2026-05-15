import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react';
import { createClient } from 'genlayer-js';
import { studionet } from 'genlayer-js/chains';
import { useAccount } from 'wagmi';

type GenLayerClient = ReturnType<typeof createClient>;

interface GenLayerContextValue {
    client: GenLayerClient | null;
}

const GenLayerContext = createContext<GenLayerContextValue>({ client: null });

/**
 * Creates a genlayer-js client using the connected wallet's provider.
 *
 * Key fix: genlayer-js supports a `provider` option (see client.ts line 33).
 * Without it, genlayer-js falls back to `window.ethereum` which only works
 * with MetaMask on profiles that already authorized the dapp.
 *
 * By passing the actual provider from the wagmi connector (MetaMask, OKX,
 * WalletConnect, etc.), eth_sendTransaction is routed through the correct
 * wallet — works on all Chrome profiles and all wallet types.
 */
export function GenLayerProvider({ children }: { children: ReactNode }) {
    const { address, connector } = useAccount();
    const [client, setClient] = useState<GenLayerClient | null>(null);

    useEffect(() => {
        if (!address || !connector) {
            setClient(null);
            return;
        }

        let cancelled = false;

        (async () => {
            try {
                // Get the EIP-1193 provider from the active wagmi connector.
                // This is the actual wallet provider (MetaMask, OKX, WalletConnect, etc.)
                const provider = await connector.getProvider();

                if (cancelled) return;

                const newClient = createClient({
                    chain: studionet,
                    account: address,
                    provider: provider as any, // EIP-1193 compatible provider
                });

                setClient(newClient);
            } catch (err) {
                console.error('Failed to get wallet provider, falling back:', err);
                if (cancelled) return;

                // Fallback: create client without explicit provider (uses window.ethereum)
                setClient(createClient({
                    chain: studionet,
                    account: address,
                }));
            }
        })();

        return () => { cancelled = true; };
    }, [address, connector]);

    const value = useMemo(() => ({ client }), [client]);

    return (
        <GenLayerContext.Provider value={value}>
            {children}
        </GenLayerContext.Provider>
    );
}

export function useGenLayer() {
    return useContext(GenLayerContext);
}
