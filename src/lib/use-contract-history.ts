import { useCallback, useEffect, useState } from "react";
import type { PurchaseContract } from "./warrant-contract";
import {
  listContracts,
  saveContract,
  deleteContract,
  clearContracts,
} from "./contracts.functions";

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

function toEntry(contract: PurchaseContract): HistoryEntry {
  return {
    id: contract.verificationId ?? `local-${Date.now()}`,
    request: contract.intent,
    item: contract.item,
    signed: contract.signed,
    failedClauses: contract.conditions.filter((c) => c.status !== "pass").map((c) => c.label),
    verifiedAt: contract.verifiedAt ?? new Date().toISOString(),
  };
}

/**
 * Signed-in users get their history from their account; everyone else keeps a
 * best-effort local copy on this device.
 */
export function useContractHistory(signedIn: boolean) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const refresh = useCallback(async () => {
    if (!signedIn) {
      setHistory(read());
      return;
    }
    try {
      setHistory(await listContracts());
    } catch {
      setHistory([]);
    }
  }, [signedIn]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const persistLocal = useCallback((next: HistoryEntry[]) => {
    setHistory(next);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* storage full or blocked — history is best-effort */
    }
  }, []);

  const save = useCallback(
    async (contract: PurchaseContract) => {
      const entry = toEntry(contract);
      if (!signedIn) {
        persistLocal([entry, ...read().filter((e) => e.request !== entry.request)].slice(0, LIMIT));
        return;
      }
      try {
        await saveContract({
          data: {
            request: entry.request,
            item: entry.item,
            signed: entry.signed,
            failedClauses: entry.failedClauses,
            verificationId: contract.verificationId,
            verifiedAt: entry.verifiedAt,
          },
        });
        await refresh();
      } catch {
        /* saving history should never break verification */
      }
    },
    [signedIn, persistLocal, refresh],
  );

  const remove = useCallback(
    async (id: string) => {
      if (!signedIn) {
        persistLocal(read().filter((e) => e.id !== id));
        return;
      }
      await deleteContract({ data: { id } });
      await refresh();
    },
    [signedIn, persistLocal, refresh],
  );

  const clear = useCallback(async () => {
    if (!signedIn) {
      persistLocal([]);
      return;
    }
    await clearContracts();
    await refresh();
  }, [signedIn, persistLocal, refresh]);

  return { history, save, remove, clear };
}
