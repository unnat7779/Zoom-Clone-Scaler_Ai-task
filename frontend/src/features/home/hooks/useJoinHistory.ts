"use client";

import { useMemo } from "react";
import { useLocalStorage } from "@/shared/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/shared/lib/storage";
import { sanitizeJoinHistory } from "@/shared/lib/joinHistory";

const EMPTY: unknown[] = [];

/** Join-modal meeting history (`localStorage['zc.join_history']`) and Clear History (PRD §7.2.6). */
export function useJoinHistory() {
  const [stored, setStored] = useLocalStorage<unknown>(STORAGE_KEYS.joinHistory, EMPTY);
  const history = useMemo(() => sanitizeJoinHistory(stored), [stored]);
  return { history, clear: () => setStored(null) };
}
