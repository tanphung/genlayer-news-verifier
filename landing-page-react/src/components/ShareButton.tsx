import { useState } from 'react';
import type { HistoryRecord } from '../lib/types';

interface ShareButtonProps {
    record: HistoryRecord;
}

function buildShareText(record: HistoryRecord): string {
    return [
        `NewsVerify Result`,
        `URL: ${record.url}`,
        `Trust Score: ${record.trustScore}/100`,
        `Verdict: ${record.verdict}`,
        `Summary: ${record.result.summary}`,
        ``,
        `Verify news with AI: https://newsverify.app`,
    ].join('\n');
}

export default function ShareButton({ record }: ShareButtonProps) {
    const [copied, setCopied] = useState(false);

    const share = async () => {
        const text = buildShareText(record);
        const shareData: ShareData = {
            title: 'NewsVerify Result',
            text,
            url: record.url,
        };

        // Try Web Share API first
        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
                return;
            } catch {
                // Falls through to clipboard
            }
        }

        // Fallback: clipboard API
        if (navigator.clipboard && navigator.clipboard.writeText) {
            try {
                await navigator.clipboard.writeText(text);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
                return;
            } catch {
                // Falls through to execCommand
            }
        }

        // Final fallback: execCommand
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        try {
            document.execCommand('copy');
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } finally {
            document.body.removeChild(textarea);
        }
    };

    return (
        <button
            className="share-button btn-secondary"
            onClick={share}
            title="Share result"
        >
            {copied ? (
                <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Copied!
                </>
            ) : (
                <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Share
                </>
            )}
        </button>
    );
}
