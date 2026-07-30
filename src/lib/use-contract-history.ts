import { useCallback, useEffect, useState } from "react";
import type { PurchaseContract } from "./warrant-contract";

export interface HistoryEntry {
  id: string;
  request: string;
  item: string;
  signed: boolean;
  failedClauses: string[];
  verifiedAt: string;
}

const KEY = "warrant.history.v1";
const LIMIT = 12;

function read(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function useContractHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setHistory(read());
  }, []);

  const persist = useCallback((next: HistoryEntry[]) => {
    setHistory(next);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* storage full or blocked — history is best-effort */
    }
  }, []);

  const save = useCallback(
    (contract: PurchaseContract) => {
      const entry: HistoryEntry = {
        id: contract.verificationId ?? `local-${Date.now()}`,
        request: contract.intent,
        item: contract.item,
        signed: contract.signed,
        failedClauses: contract.conditions.filter((c) => c.status !== "pass").map((c) => c.label),
        verifiedAt: contract.verifiedAt ?? new Date().toISOString(),
      };
      persist([entry, ...read().filter((e) => e.request !== entry.request)].slice(0, LIMIT));
    },
    [persist],
  );

  const remove = useCallback((id: string) => persist(read().filter((e) => e.id !== id)), [persist]);
  const clear = useCallback(() => persist([]), [persist]);

  return { history, save, remove, clear };
}
