import { useState } from 'react';
import type { HistoryRecord } from '../lib/types';

interface TrustMapProps {
    records: HistoryRecord[];
}

const REGIONS = [
    'North America',
    'Europe',
    'East Asia',
    'South Asia',
    'Middle East',
    'Africa',
    'Latin America',
    'Oceania',
    'Other',
] as const;

type Region = typeof REGIONS[number];

function regionColor(avg: number | null): string {
    if (avg === null) return 'var(--gray-200)';
    if (avg >= 70) return 'rgba(16, 185, 129, 0.25)';
    if (avg >= 40) return 'rgba(245, 158, 11, 0.25)';
    return 'rgba(239, 68, 68, 0.25)';
}

function regionBorder(avg: number | null): string {
    if (avg === null) return 'var(--gray-300)';
    if (avg >= 70) return 'var(--success-500)';
    if (avg >= 40) return 'var(--warning-500)';
    return '#ef4444';
}

function regionTextColor(avg: number | null): string {
    if (avg === null) return 'var(--text-muted)';
    if (avg >= 70) return 'var(--success-500)';
    if (avg >= 40) return 'var(--warning-500)';
    return '#ef4444';
}

export default function TrustMap({ records }: TrustMapProps) {
    const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);

    if (records.length < 3) {
        return (
            <div className="trust-map glass-card">
                <div className="trust-map__header">
                    <h3 className="trust-map__title">Trust Map</h3>
                </div>
                <div className="trust-map__insufficient">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor" opacity="0.4" />
                    </svg>
                    <p>Insufficient data</p>
                    <span>Verify at least 3 articles to see the trust map</span>
                </div>
            </div>
        );
    }

    // Build per-region stats
    const regionMap: Record<Region, HistoryRecord[]> = {} as Record<Region, HistoryRecord[]>;
    REGIONS.forEach((r) => { regionMap[r] = []; });
    records.forEach((rec) => {
        const region = rec.region as Region;
        if (regionMap[region]) {
            regionMap[region].push(rec);
        } else {
            regionMap['Other'].push(rec);
        }
    });

    const regionAvg: Record<Region, number | null> = {} as Record<Region, number | null>;
    REGIONS.forEach((r) => {
        const arr = regionMap[r];
        regionAvg[r] = arr.length > 0
            ? Math.round(arr.reduce((s, x) => s + x.trustScore, 0) / arr.length)
            : null;
    });

    const selectedRecords = selectedRegion ? regionMap[selectedRegion] : [];

    return (
        <div className="trust-map glass-card">
            <div className="trust-map__header">
                <h3 className="trust-map__title">Trust Map</h3>
                {selectedRegion && (
                    <button className="trust-map__close" onClick={() => setSelectedRegion(null)} aria-label="Close breakdown">
                        ✕
                    </button>
                )}
            </div>

            <div className="trust-map__grid">
                {REGIONS.map((region) => {
                    const avg = regionAvg[region];
                    const count = regionMap[region].length;
                    const isSelected = selectedRegion === region;
                    return (
                        <button
                            key={region}
                            className={`trust-map__cell ${isSelected ? 'trust-map__cell--selected' : ''}`}
                            style={{
                                background: regionColor(avg),
                                borderColor: regionBorder(avg),
                            }}
                            onClick={() => setSelectedRegion(isSelected ? null : region)}
                            title={`${region}: ${avg !== null ? avg + '/100' : 'No data'}`}
                        >
                            <span className="trust-map__region-name">{region}</span>
                            {avg !== null ? (
                                <span className="trust-map__region-score" style={{ color: regionTextColor(avg) }}>
                                    {avg}/100
                                </span>
                            ) : (
                                <span className="trust-map__region-no-data">No data</span>
                            )}
                            {count > 0 && (
                                <span className="trust-map__region-count">{count} article{count !== 1 ? 's' : ''}</span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="trust-map__legend">
                <span className="trust-map__legend-item">
                    <span className="trust-map__legend-dot" style={{ background: 'rgba(16, 185, 129, 0.4)', border: '1px solid var(--success-500)' }} />
                    Low risk
                </span>
                <span className="trust-map__legend-item">
                    <span className="trust-map__legend-dot" style={{ background: 'rgba(245, 158, 11, 0.4)', border: '1px solid var(--warning-500)' }} />
                    Medium
                </span>
                <span className="trust-map__legend-item">
                    <span className="trust-map__legend-dot" style={{ background: 'rgba(239, 68, 68, 0.4)', border: '1px solid #ef4444' }} />
                    High risk
                </span>
                <span className="trust-map__legend-item">
                    <span className="trust-map__legend-dot" style={{ background: 'var(--gray-200)', border: '1px solid var(--gray-300)' }} />
                    No data
                </span>
            </div>

            {/* Region breakdown */}
            {selectedRegion && selectedRecords.length > 0 && (
                <div className="trust-map__breakdown">
                    <h4 className="trust-map__breakdown-title">{selectedRegion} — Articles</h4>
                    <ul className="trust-map__breakdown-list">
                        {selectedRecords.map((rec) => (
                            <li key={rec.id} className="trust-map__breakdown-item">
                                <span className="trust-map__breakdown-score" style={{ color: regionTextColor(rec.trustScore) }}>
                                    {rec.trustScore}
                                </span>
                                <span className="trust-map__breakdown-url" title={rec.url}>
                                    {rec.url.length > 60 ? rec.url.slice(0, 60) + '…' : rec.url}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
