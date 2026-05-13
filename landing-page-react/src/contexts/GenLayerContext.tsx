import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { createClient } from 'genlayer-js';
import { studionet } from 'genlayer-js/chains';
import { useAccount } from 'wagmi';

type GenLayerClient = ReturnType<typeof createClient>;

interface GenLayerContextValue {
    client: GenLayerClient | null;
}

const GenLayerContext = createContext<GenLayerContextValue>({ client: null });

/**
 * Creates a genlayer-js client using the connected MetaMask address.
 *
 * Key: passing `account` as an address STRING (not a LocalAccount object from
 * createAccount(key)) causes genlayer-js to set isAddress=true in its custom
 * transport. When isAddress=true, all eth_* methods (including eth_sendTransaction)
 * are routed through window.ethereum → MetaMask popup appears for signing.
 *
 * See: genlayer-js/src/client/client.ts → getCustomTransportConfig()
 */
export function GenLayerProvider({ children }: { children: ReactNode }) {
    const { address } = useAccount();

    const client = useMemo<GenLayerClient | null>(() => {
        if (!address) return null;
        return createClient({
            chain: studionet,
            account: address, // string address → MetaMask signs, shows popup
        });
    }, [address]);

    return (
        <GenLayerContext.Provider value={{ client }}>
            {children}
        </GenLayerContext.Provider>
    );
}

export function useGenLayer() {
    return useContext(GenLayerContext);
}
