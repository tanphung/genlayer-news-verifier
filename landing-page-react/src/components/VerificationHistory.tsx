import { useState } from 'react';
import type { HistoryRecord, Verdict } from '../lib/types';
import { removeRecord, clearAll } from '../lib/historyStore';

interface VerificationHistoryProps {
    records: HistoryRecord[];
    activeId: string | null;
    onSelect: (record: HistoryRecord) => void;
}

function relativeTime(timestamp: number): string {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

function scoreBadgeClass(verdict: Verdict): string {
    switch (verdict) {
        case 'Credible': return 'hist-score-badge hist-score-badge--credible';
        case 'Questionable': return 'hist-score-badge hist-score-badge--questionable';
        case 'Unreliable': return 'hist-score-badge hist-score-badge--unreliable';
        default: return 'hist-score-badge hist-score-badge--unknown';
    }
}

function truncateUrl(url: string, max = 40): string {
    try {
        const u = new URL(url);
        const short = u.hostname + u.pathname;
        return short.length > max ? short.slice(0, max) + '…' : short;
    } catch {
        return url.length > max ? url.slice(0, max) + '…' : url;
    }
}

export default function VerificationHistory({ records, activeId, onSelect }: VerificationHistoryProps) {
    const [confirmClear, setConfirmClear] = useState(false);

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        removeRecord(id);
    };

    const handleClear = () => {
        if (confirmClear) {
            clearAll();
            setConfirmClear(false);
        } else {
            setConfirmClear(true);
            setTimeout(() => setConfirmClear(false), 3000);
        }
    };

    return (
        <div className="hist-panel glass-card">
            <div className="hist-panel__header">
                <h3 className="hist-panel__title">History</h3>
                {records.length > 0 && (
                    <button
                        className={`hist-panel__clear ${confirmClear ? 'hist-panel__clear--confirm' : ''}`}
                        onClick={handleClear}
                        title={confirmClear ? 'Click again to confirm' : 'Clear all history'}
                    >
                        {confirmClear ? 'Confirm?' : 'Clear all'}
                    </button>
                )}
            </div>

            {records.length === 0 ? (
                <div className="hist-panel__empty">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M12 6V12L16 14M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p>No verifications yet</p>
                    <span>Verified articles will appear here</span>
                </div>
            ) : (
                <ul className="hist-panel__list">
                    {records.map((record) => (
                        <li
                            key={record.id}
                            className={`hist-item ${activeId === record.id ? 'hist-item--active' : ''}`}
                            onClick={() => onSelect(record)}
                        >
                            <div className="hist-item__left">
                                <span className={scoreBadgeClass(record.verdict)}>
                                    {record.trustScore}
                                </span>
                            </div>
                            <div className="hist-item__main">
                                <span className="hist-item__verdict">{record.verdict}</span>
                                <span className="hist-item__url" title={record.url}>
                                    {truncateUrl(record.url)}
                                </span>
                                <span className="hist-item__time">{relativeTime(record.timestamp)}</span>
                            </div>
                            <button
                                className="hist-item__delete"
                                onClick={(e) => handleDelete(e, record.id)}
                                aria-label="Delete record"
                                title="Delete"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
