import { useState, useCallback, useEffect, useRef } from 'react';
import { useGenLayer } from '../contexts/GenLayerContext';
import { TransactionStatus, type Hash } from 'genlayer-js/types';
import { useAccount, useSwitchChain } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { CONTRACTS } from '../config/genlayer';
import toast, { Toaster } from 'react-hot-toast';
import ptpLogo from '../assets/ptp-logo.png';
import EvidenceResult from './EvidenceResult';
import VerificationHistory from './VerificationHistory';
import TrustMap from './TrustMap';
import type { HistoryRecord, VerificationResult } from '../lib/types';
import { addRecord } from '../lib/historyStore';
import { useHistory } from '../lib/useHistory';

const STUDIONET_CHAIN_ID = 61999;
const PENDING_TX_KEY = 'nv_pending_tx';

// ── Pending transaction persistence ──────────────────────────────────────────
// Saves txHash + url to localStorage so verification survives page navigation.
function savePendingTx(hash: string, url: string) {
    localStorage.setItem(PENDING_TX_KEY, JSON.stringify({ hash, url }));
}
function loadPendingTx(): { hash: string; url: string } | null {
    try {
        const raw = localStorage.getItem(PENDING_TX_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch { return null; }
}
function clearPendingTx() {
    localStorage.removeItem(PENDING_TX_KEY);
}

export default function NewsVerifier() {
    const { client } = useGenLayer();
    const { isConnected: walletConnected, chainId } = useAccount();
    const { switchChain } = useSwitchChain();
    const [urlToVerify, setUrlToVerify] = useState('');
    const [activeRecord, setActiveRecord] = useState<HistoryRecord | null>(null);
    const [loading, setLoading] = useState(false);
    const [txHash, setTxHash] = useState<string | null>(null);
    const [verifyError, setVerifyError] = useState<string | null>(null);
    const history = useHistory();

    const isOnStudionet = chainId === STUDIONET_CHAIN_ID;
    const resumedRef = useRef(false); // prevent double-resume

    // Surface latest verification if none manually selected
    useEffect(() => {
        if (!activeRecord && history.length > 0) {
            setActiveRecord(history[0]);
        }
    }, [history, activeRecord]);

    // ── Shared: wait for consensus → read result → save ─────────────────────
    const waitAndSaveResult = useCallback(async (
        txHashValue: string,
        url: string,
        signal: { cancelled: boolean },
    ) => {
        await client!.waitForTransactionReceipt({
            hash: txHashValue as Hash,
            status: TransactionStatus.FINALIZED,
            interval: 10_000,
            retries: 120,
        });

        if (signal.cancelled) return;
        toast.loading('Consensus reached. Reading result…', { id: 'verify' });

        const rawResult = await client!.readContract({
            address: CONTRACTS.NEWS_VERIFIER as `0x${string}`,
            functionName: 'get_verification_result',
            args: [],
        });

        if (signal.cancelled) return;

        // GenLayer AI validators may wrap JSON in markdown fences or extra text.
        // Per GenLayer docs: extract the JSON object between first { and last }.
        const raw = (rawResult as string).trim();
        const first = raw.indexOf('{');
        const last = raw.lastIndexOf('}');
        if (first === -1 || last === -1 || last <= first) {
            throw new Error('Contract returned invalid response: no JSON object found');
        }
        const result: VerificationResult = JSON.parse(raw.slice(first, last + 1));
        const record = addRecord(url, result);
        setActiveRecord(record);
        setTxHash(null);
        clearPendingTx();
        toast.success('Verification complete!', { id: 'verify' });
    }, [client]);

    // ── Resume pending tx on mount (user navigated away and came back) ──────
    useEffect(() => {
        if (!client || resumedRef.current) return;
        const pending = loadPendingTx();
        if (!pending) return;

        resumedRef.current = true;
        const signal = { cancelled: false };

        setLoading(true);
        setTxHash(pending.hash);
        toast.loading('Resuming verification. Waiting for AI consensus…', { id: 'verify' });

        (async () => {
            try {
                await waitAndSaveResult(pending.hash, pending.url, signal);
            } catch (err) {
                if (signal.cancelled) return;
                const errorMsg = err instanceof Error ? err.message : 'Verification failed';
                setVerifyError(errorMsg);
                toast.error('Verification failed. Please try again.', { id: 'verify' });
                clearPendingTx();
                console.error('Resume verification failed:', err);
            } finally {
                if (!signal.cancelled) setLoading(false);
            }
        })();

        return () => { signal.cancelled = true; };
    }, [client, waitAndSaveResult]);

    // ── Submit new verification ─────────────────────────────────────────────
    const handleVerify = useCallback(async () => {
        if (!client || !urlToVerify) {
            toast.error('Please enter a URL');
            setVerifyError('Please enter a URL');
            return;
        }
        if (!isOnStudionet) {
            toast.error('Please switch to GenLayer Studionet first');
            return;
        }

        setLoading(true);
        setVerifyError(null);
        setTxHash(null);
        toast.loading('Waiting for MetaMask signature…', { id: 'verify' });

        const submittedUrl = urlToVerify;

        try {
            // 1. Submit — wallet popup appears here (provider from wagmi connector signs)
            const hash = await client.writeContract({
                address: CONTRACTS.NEWS_VERIFIER as `0x${string}`,
                functionName: 'verify_news',
                args: [submittedUrl],
                value: 0n,
            });

            setTxHash(hash as string);
            setUrlToVerify('');
            savePendingTx(hash as string, submittedUrl);
            console.log('Transaction submitted:', hash);
            toast.loading('Transaction submitted. Waiting for AI consensus…', { id: 'verify' });

            // 2. Wait + read + save (shared logic)
            await waitAndSaveResult(hash as string, submittedUrl, { cancelled: false });
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Verification failed';
            setVerifyError(errorMsg);
            toast.error('Verification failed. Please try again.', { id: 'verify' });
            clearPendingTx();
            console.error('Verification failed:', err);
        } finally {
            setLoading(false);
        }
    }, [client, urlToVerify, isOnStudionet, waitAndSaveResult]);

    // ── Not connected ──────────────────────────────────────────────────────────
    if (!walletConnected) {
        return (
            <div className="container app-shell">
                <div className="glass-card connect-prompt">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                        <path d="M21 18V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H6M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <h2>Connect your wallet</h2>
                    <p>Connect a wallet to start verifying articles and anchor results on-chain.</p>
                    <div className="connect-prompt-action">
                        <ConnectButton showBalance={false} />
                    </div>
                </div>
            </div>
        );
    }

    // ── Wrong network ──────────────────────────────────────────────────────────
    if (!isOnStudionet) {
        return (
            <div className="container app-shell">
                <div className="glass-card connect-prompt">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <h2>Switch to GenLayer Studionet</h2>
                    <p>Verification requires the GenLayer Studionet network (chain&nbsp;61999).</p>
                    <div className="connect-prompt-action">
                        <button
                            className="btn-primary"
                            onClick={() => switchChain({ chainId: STUDIONET_CHAIN_ID })}
                        >
                            Switch Network
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ── App ────────────────────────────────────────────────────────────────────
    return (
        <div className="container app-shell">
            <Toaster position="top-right" />

            <div className="app-badge">
                <img src={ptpLogo} alt="" aria-hidden style={{ width: '20px', height: '20px', objectFit: 'cover', borderRadius: '50%' }} />
                <span>Powered by GenLayer</span>
            </div>

            <header className="app-header">
                <h1 className="app-title">Verify an article</h1>
                <p className="app-subtitle">
                    Paste a URL. Validators reach AI consensus and return an evidence card with trust score, bias, and key facts.
                </p>
            </header>

            <div className="glass-card verify-form">
                <label className="verify-label" htmlFor="url-input">Article URL</label>
                <div className="verify-input-row">
                    <input
                        id="url-input"
                        type="url"
                        inputMode="url"
                        value={urlToVerify}
                        onChange={(e) => setUrlToVerify(e.target.value)}
                        placeholder="https://example.com/article"
                        className="verify-input"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && urlToVerify && !loading) handleVerify();
                        }}
                    />
                    <button
                        type="button"
                        onClick={handleVerify}
                        disabled={loading || !urlToVerify}
                        className="btn-primary verify-submit"
                    >
                        {loading ? 'Verifying…' : 'Verify'}
                    </button>
                </div>

                {/* Transaction hash link while waiting */}
                {txHash && (
                    <div className="verify-tx-status">
                        <span>Tx: </span>
                        <a
                            href={`https://genlayer-explorer.vercel.app/tx/${txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="verify-tx-link"
                        >
                            {txHash.slice(0, 12)}…{txHash.slice(-8)}
                        </a>
                        <span className="verify-tx-note"> — AI consensus in progress, this may take a few minutes</span>
                    </div>
                )}

                {verifyError && (
                    <div className="verify-error" role="alert">
                        {verifyError}
                    </div>
                )}
            </div>

            <div className="app-grid">
                <div className="app-grid-main">
                    {/* Output area — always stable, never unmounted by loading state.
                        Loading indication lives in the form card (button + tx status + toasts). */}
                    {activeRecord ? (
                        <EvidenceResult record={activeRecord} />
                    ) : (
                        <div className="glass-card evidence-empty">
                            <svg viewBox="0 0 24 24" width="56" height="56" fill="none" aria-hidden>
                                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <h3>No evidence yet</h3>
                            <p>Submit your first URL to see a full evidence breakdown here.</p>
                        </div>
                    )}
                    <TrustMap records={history} />
                </div>

                <aside className="app-grid-side">
                    <VerificationHistory
                        records={history}
                        activeId={activeRecord?.id ?? null}
                        onSelect={(record) => setActiveRecord(record)}
                    />
                </aside>
            </div>
        </div>
    );
}
