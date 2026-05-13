import { useState, useEffect } from 'react';
import type { HistoryRecord } from './types';
import { getAll, subscribe, unsubscribe } from './historyStore';

export function useHistory(): HistoryRecord[] {
    const [records, setRecords] = useState<HistoryRecord[]>(() => getAll());

    useEffect(() => {
        const handler = (updated: HistoryRecord[]) => {
            setRecords(updated);
        };
        subscribe(handler);
        return () => {
            unsubscribe(handler);
        };
    }, []);

    return records;
}
