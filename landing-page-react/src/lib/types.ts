export type Verdict = 'Credible' | 'Questionable' | 'Unreliable' | 'Unknown';

export interface VerificationResult {
    trust_score: number;
    summary: string;
    bias_level: 'Low' | 'Medium' | 'High' | 'Unknown';
    key_facts: string[];
}

export interface HistoryRecord {
    id: string;
    url: string;
    timestamp: number;
    trustScore: number;
    verdict: Verdict;
    biasSummary: string;
    result: VerificationResult;
    region: string;
}
