import { useState } from 'react';
import type { HistoryRecord, Verdict } from '../lib/types';
import ShareButton from './ShareButton';

interface EvidenceResultProps {
    record: HistoryRecord;
}

function verdictClass(verdict: Verdict): string {
    switch (verdict) {
        case 'Credible': return 'verdict-badge verdict-badge--credible';
        case 'Questionable': return 'verdict-badge verdict-badge--questionable';
        case 'Unreliable': return 'verdict-badge verdict-badge--unreliable';
        default: return 'verdict-badge verdict-badge--unknown';
    }
}

function scoreColor(score: number): string {
    if (score >= 70) return 'var(--success-500)';
    if (score >= 40) return 'var(--warning-500)';
    return '#ef4444';
}

function biasClass(bias: string): string {
    switch (bias) {
        case 'Low': return 'bias-pill bias-pill--low';
        case 'Medium': return 'bias-pill bias-pill--medium';
        case 'High': return 'bias-pill bias-pill--high';
        default: return 'bias-pill bias-pill--unknown';
    }
}

function confidenceLabel(score: number): string {
    if (score >= 80) return 'High Confidence';
    if (score >= 60) return 'Moderate Confidence';
    if (score >= 40) return 'Low Confidence';
    return 'Very Low Confidence';
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

export default function EvidenceResult({ record }: EvidenceResultProps) {
    const [factsExpanded, setFactsExpanded] = useState(false);
    const { result } = record;
    const color = scoreColor(record.trustScore);
    const facts = result.key_facts ?? [];
    const showToggle = facts.length > 3;
    const visibleFacts = factsExpanded ? facts : facts.slice(0, 3);

    return (
        <div className="evidence-card glass-card">
            {/* Header */}
            <div className="evidence-card__header">
                <div className="evidence-card__verdict-row">
                    <span className={verdictClass(record.verdict)}>{record.verdict}</span>
                    <span className="evidence-card__time">{relativeTime(record.timestamp)}</span>
                </div>
                <div className="evidence-card__url" title={record.url}>
                    {record.url.length > 80 ? record.url.slice(0, 80) + '…' : record.url}
                </div>
            </div>

            {/* Score + Progress */}
            <div className="evidence-card__score-section">
                <div className="evidence-card__score-number" style={{ color }}>
                    {record.trustScore}
                    <span className="evidence-card__score-max">/100</span>
                </div>
                <div className="evidence-card__score-meta">
                    <div className="evidence-card__confidence">{confidenceLabel(record.trustScore)}</div>
                    <div className="evidence-card__progress-track">
                        <div
                            className="evidence-card__progress-fill"
                            style={{ width: `${record.trustScore}%`, background: color }}
                        />
                    </div>
                </div>
            </div>

            {/* Bias pill */}
            <div className="evidence-card__row">
                <span className="evidence-card__label">Bias Level</span>
                <span className={biasClass(result.bias_level)}>{result.bias_level}</span>
            </div>

            {/* Summary */}
            <div className="evidence-card__summary">
                <span className="evidence-card__label">Summary</span>
                <p className="evidence-card__summary-text">{result.summary}</p>
            </div>

            {/* Key Facts */}
            {facts.length > 0 && (
                <div className="evidence-card__facts">
                    <span className="evidence-card__label">Key Facts</span>
                    <ul className="evidence-card__facts-list">
                        {visibleFacts.map((fact, i) => (
                            <li key={i} className="evidence-card__fact-item">
                                <span className="evidence-card__fact-dot" />
                                {fact}
                            </li>
                        ))}
                    </ul>
                    {showToggle && (
                        <button
                            className="evidence-card__toggle"
                            onClick={() => setFactsExpanded(!factsExpanded)}
                        >
                            {factsExpanded ? 'Show less' : `Show ${facts.length - 3} more`}
                        </button>
                    )}
                </div>
            )}

            {/* Footer */}
            <div className="evidence-card__footer">
                <span className="evidence-card__region">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor" />
                    </svg>
                    {record.region}
                </span>
                <ShareButton record={record} />
            </div>
        </div>
    );
}
