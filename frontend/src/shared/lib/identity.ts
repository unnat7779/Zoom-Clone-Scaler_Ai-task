/**
 * Browser identity (PRD §3). Every browser is the default user; the meeting
 * role comes from the entry path. Browser-only: call from effects/handlers.
 */
import { STORAGE_KEYS, readStorage, writeStorage } from "./storage";

let memoryClientId: string | null = null;

/** Persistent UUID v4 for this browser (`localStorage['zc.client_id']`). */
export function getClientId(): string {
  const stored = readStorage<string | null>(STORAGE_KEYS.clientId, null);
  if (stored) return stored;
  const created = memoryClientId ?? crypto.randomUUID();
  memoryClientId = created;
  writeStorage(STORAGE_KEYS.clientId, created);
  return created;
}
