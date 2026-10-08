/**
 * Join-modal history (PRD §7.2.6): `localStorage['zc.join_history']`, newest first,
 * one row per meeting number, at most 20 rows. Written by the pre-join page after a
 * successful join and read/cleared by the Join Meeting modal.
 */
import { STORAGE_KEYS, readStorage, writeStorage } from "./storage";

export interface JoinHistoryEntry {
  /** digits only, e.g. "81234567890" */
  number: string;
  topic: string;
}

export const JOIN_HISTORY_LIMIT = 20;

const isEntry = (value: unknown): value is JoinHistoryEntry =>
  typeof value === "object" &&
  value !== null &&
  typeof (value as JoinHistoryEntry).number === "string" &&
  typeof (value as JoinHistoryEntry).topic === "string";

/** Drops malformed rows (the list lives in localStorage and may be edited by hand). */
export const sanitizeJoinHistory = (value: unknown): JoinHistoryEntry[] =>
  Array.isArray(value) ? value.filter(isEntry).slice(0, JOIN_HISTORY_LIMIT) : [];

export const readJoinHistory = (): JoinHistoryEntry[] =>
  sanitizeJoinHistory(readStorage<unknown>(STORAGE_KEYS.joinHistory, []));

export function addJoinHistoryEntry(entry: JoinHistoryEntry): void {
  const next = [entry, ...readJoinHistory().filter((item) => item.number !== entry.number)];
  writeStorage(STORAGE_KEYS.joinHistory, next.slice(0, JOIN_HISTORY_LIMIT));
}
