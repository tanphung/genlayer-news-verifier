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
        const hostname = new URL(url).hostname.toLowerCase().replace(/^www\./, '');
        const parts = hostname.split('.');
        const tld = parts[parts.length - 1];

        // ── 1. Country-code TLD (fast path) ──────────────────────────────────
        const tldMap: Record<string, string> = {
            // North America
            us: 'North America', ca: 'North America',
            // Latin America
            mx: 'Latin America', br: 'Latin America', ar: 'Latin America',
            cl: 'Latin America', co: 'Latin America', pe: 'Latin America',
            ve: 'Latin America', uy: 'Latin America', py: 'Latin America',
            bo: 'Latin America', ec: 'Latin America', gt: 'Latin America',
            // Europe
            gb: 'Europe', uk: 'Europe', de: 'Europe', fr: 'Europe',
            it: 'Europe', es: 'Europe', nl: 'Europe', pl: 'Europe',
            se: 'Europe', no: 'Europe', fi: 'Europe', dk: 'Europe',
            ru: 'Europe', ua: 'Europe', be: 'Europe', ch: 'Europe',
            at: 'Europe', cz: 'Europe', hu: 'Europe', ro: 'Europe',
            pt: 'Europe', gr: 'Europe', sk: 'Europe', hr: 'Europe',
            // East Asia
            jp: 'East Asia', kr: 'East Asia', cn: 'East Asia',
            tw: 'East Asia', hk: 'East Asia', sg: 'East Asia',
            // South Asia
            in: 'South Asia', pk: 'South Asia', bd: 'South Asia',
            lk: 'South Asia', np: 'South Asia',
            // Middle East
            sa: 'Middle East', ae: 'Middle East', eg: 'Middle East',
            il: 'Middle East', tr: 'Middle East', ir: 'Middle East',
            qa: 'Middle East', kw: 'Middle East', jo: 'Middle East',
            lb: 'Middle East', iq: 'Middle East', bh: 'Middle East',
            // Africa
            ng: 'Africa', za: 'Africa', ke: 'Africa', et: 'Africa',
            gh: 'Africa', tz: 'Africa', ug: 'Africa', ma: 'Africa',
            cm: 'Africa', sn: 'Africa', ci: 'Africa',
            // Oceania
            au: 'Oceania', nz: 'Oceania',
        };
        if (tldMap[tld]) return tldMap[tld];

        // ── 2. Second-level domain name for generic TLDs (.com/.net/.org…) ───
        // Use the second-to-last label, e.g. "nytimes" from "nytimes.com"
        const sld = parts.length >= 2 ? parts[parts.length - 2] : '';

        const sldMap: Record<string, string> = {
            // ── North America — US ──
            cnn: 'North America', foxnews: 'North America', nytimes: 'North America',
            washingtonpost: 'North America', wsj: 'North America',
            usatoday: 'North America', nbcnews: 'North America',
            abcnews: 'North America', cbsnews: 'North America',
            msnbc: 'North America', apnews: 'North America',
            npr: 'North America', politico: 'North America',
            thehill: 'North America', axios: 'North America',
            bloomberg: 'North America', businessinsider: 'North America',
            huffpost: 'North America', buzzfeed: 'North America',
            vox: 'North America', vice: 'North America',
            slate: 'North America', salon: 'North America',
            newsweek: 'North America', time: 'North America',
            forbes: 'North America', fortune: 'North America',
            theverge: 'North America', wired: 'North America',
            techcrunch: 'North America', engadget: 'North America',
            gizmodo: 'North America', cnet: 'North America',
            pcmag: 'North America', arstechnica: 'North America',
            ign: 'North America', latimes: 'North America',
            nypost: 'North America', breitbart: 'North America',
            theatlantic: 'North America', newyorker: 'North America',
            rollingstone: 'North America', thedailybeast: 'North America',
            motherjones: 'North America', reason: 'North America',
            nationalreview: 'North America', thenation: 'North America',
            // ── North America — Canada ──
            cbc: 'North America', globeandmail: 'North America',
            nationalpost: 'North America', torontostar: 'North America',
            // ── Europe — UK ──
            bbc: 'Europe', theguardian: 'Europe', dailymail: 'Europe',
            thetimes: 'Europe', telegraph: 'Europe', independent: 'Europe',
            mirror: 'Europe', express: 'Europe', metro: 'Europe',
            sky: 'Europe', thesun: 'Europe', eveningstandard: 'Europe',
            inews: 'Europe', spectator: 'Europe', economist: 'Europe',
            newstatesman: 'Europe', prospect: 'Europe',
            // ── Europe — Germany ──
            spiegel: 'Europe', zeit: 'Europe', focus: 'Europe',
            bild: 'Europe', welt: 'Europe', faz: 'Europe',
            sueddeutsche: 'Europe', stern: 'Europe', handelsblatt: 'Europe',
            // ── Europe — France ──
            lemonde: 'Europe', lefigaro: 'Europe', liberation: 'Europe',
            lexpress: 'Europe', lepoint: 'Europe', leparisien: 'Europe',
            // ── Europe — Others ──
            corriere: 'Europe', repubblica: 'Europe', elpais: 'Europe',
            elmundo: 'Europe', lavanguardia: 'Europe', rtve: 'Europe',
            nos: 'Europe', nu: 'Europe', svd: 'Europe', dn: 'Europe',
            // ── Europe — Russia ──
            rt: 'Europe', ria: 'Europe', tass: 'Europe', interfax: 'Europe',
            meduza: 'Europe', kommersant: 'Europe',
            // ── Middle East ──
            aljazeera: 'Middle East', arabnews: 'Middle East',
            gulfnews: 'Middle East', khaleejitimes: 'Middle East',
            alarabiya: 'Middle East', middleeasteye: 'Middle East',
            haaretz: 'Middle East', timesofisrael: 'Middle East',
            jpost: 'Middle East', presstv: 'Middle East',
            // ── East Asia — Japan ──
            nhk: 'East Asia', asahi: 'East Asia', mainichi: 'East Asia',
            yomiuri: 'East Asia', japantimes: 'East Asia', nikkei: 'East Asia',
            // ── East Asia — Korea ──
            koreaherald: 'East Asia', koreatimes: 'East Asia',
            yonhapnews: 'East Asia', chosun: 'East Asia',
            // ── East Asia — China / HK / SG / SEA ──
            scmp: 'East Asia', channelnewsasia: 'East Asia',
            straitstimes: 'East Asia', todayonline: 'East Asia',
            chinadaily: 'East Asia', globaltimes: 'East Asia',
            // ── South Asia — India ──
            hindustantimes: 'South Asia', thehindu: 'South Asia',
            ndtv: 'South Asia', indiatoday: 'South Asia',
            firstpost: 'South Asia', scroll: 'South Asia',
            thewire: 'South Asia', livemint: 'South Asia',
            economictimes: 'South Asia', timesofindia: 'South Asia',
            theprint: 'South Asia', quint: 'South Asia',
            // ── South Asia — Pakistan / Bangladesh ──
            dawn: 'South Asia', geo: 'South Asia', arynews: 'South Asia',
            // ── Africa ──
            premiumtimesng: 'Africa', punchng: 'Africa',
            vanguardngr: 'Africa', dailymaverick: 'Africa',
            timeslive: 'Africa', businessdayng: 'Africa',
            // ── Latin America ──
            folha: 'Latin America', estadao: 'Latin America',
            infobae: 'Latin America', clarin: 'Latin America',
            lanacion: 'Latin America', eluniversal: 'Latin America',
            // ── Oceania ──
            smh: 'Oceania', theage: 'Oceania', heraldsun: 'Oceania',
            couriermail: 'Oceania', nzherald: 'Oceania',
        };
        if (sldMap[sld]) return sldMap[sld];

        // ── 3. Generic TLD fallback — most .com/.net/.org are English/NA ──────
        if (['com', 'net', 'org', 'edu', 'io', 'co'].includes(tld)) return 'North America';

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
