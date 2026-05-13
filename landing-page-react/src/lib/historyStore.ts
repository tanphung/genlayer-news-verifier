import type { HistoryRecord, Verdict, VerificationResult } from './types';

const STORAGE_KEY = 'nv_history';
type Listener = (records: HistoryRecord[]) => void;
const listeners = new Set<Listener>();

function notify(records: HistoryRecord[]): void {
    listeners.forEach((cb) => cb(records));
}

export function getAll(): HistoryRecord[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        return JSON.parse(raw) as HistoryRecord[];
    } catch {
        return [];
    }
}

function save(records: HistoryRecord[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    notify(records);
}

function computeVerdict(trustScore: number): Verdict {
    if (trustScore >= 70) return 'Credible';
    if (trustScore >= 40) return 'Questionable';
    return 'Unreliable';
}

function computeRegion(url: string): string {
    try {
        const hostname = new URL(url).hostname;
        const parts = hostname.split('.');
        const tld = parts[parts.length - 1].toLowerCase();
        const tldMap: Record<string, string> = {
            us: 'North America',
            ca: 'North America',
            mx: 'Latin America',
            br: 'Latin America',
            ar: 'Latin America',
            cl: 'Latin America',
            co: 'Latin America',
            gb: 'Europe',
            uk: 'Europe',
            de: 'Europe',
            fr: 'Europe',
            it: 'Europe',
            es: 'Europe',
            nl: 'Europe',
            pl: 'Europe',
            se: 'Europe',
            no: 'Europe',
            fi: 'Europe',
            dk: 'Europe',
            ru: 'Europe',
            jp: 'East Asia',
            kr: 'East Asia',
            cn: 'East Asia',
            tw: 'East Asia',
            hk: 'East Asia',
            sg: 'East Asia',
            in: 'South Asia',
            pk: 'South Asia',
            bd: 'South Asia',
            lk: 'South Asia',
            sa: 'Middle East',
            ae: 'Middle East',
            eg: 'Middle East',
            il: 'Middle East',
            tr: 'Middle East',
            ir: 'Middle East',
            ng: 'Africa',
            za: 'Africa',
            ke: 'Africa',
            et: 'Africa',
            gh: 'Africa',
            au: 'Oceania',
            nz: 'Oceania',
        };
        if (tldMap[tld]) return tldMap[tld];
        // com/net/org/io — treat as North America by default
        return 'Other';
    } catch {
        return 'Other';
    }
}

export function addRecord(url: string, result: VerificationResult): HistoryRecord {
    const records = getAll();
    const record: HistoryRecord = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        url,
        timestamp: Date.now(),
        trustScore: result.trust_score,
        verdict: computeVerdict(result.trust_score),
        biasSummary: result.bias_level,
        result,
        region: computeRegion(url),
    };
    save([record, ...records]);
    return record;
}

export function removeRecord(id: string): void {
    const records = getAll().filter((r) => r.id !== id);
    save(records);
}

export function clearAll(): void {
    save([]);
}

export function subscribe(cb: Listener): void {
    listeners.add(cb);
}

export function unsubscribe(cb: Listener): void {
    listeners.delete(cb);
}
