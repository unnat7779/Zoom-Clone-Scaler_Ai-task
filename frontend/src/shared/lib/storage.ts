/**
 * Safe localStorage access (SSR, private mode and quota errors never throw).
 * Values are JSON encoded. Keys used by the app live in `STORAGE_KEYS`.
 */

export const STORAGE_KEYS = {
  clientId: "zc.client_id",
  displayName: "zc.display_name",
  joinHistory: "zc.join_history",
  /** New-meeting popover "Use my Personal Meeting ID (PMI)" (PRD §7.1.4) */
  usePmi: "zc.use_pmi",
} as const;

const STORAGE_EVENT = "zc-storage";

function getStorage(): Storage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

export function readStorage<T>(key: string, fallback: T): T {
  const raw = getStorage()?.getItem(key);
  if (raw === null || raw === undefined) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T | null): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    if (value === null) storage.removeItem(key);
    else storage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: key }));
  } catch {
    /* quota exceeded or storage disabled: keep the in-memory value only */
  }
}

/** Subscribes to changes of `key` from this tab (writeStorage) and other tabs. */
export function subscribeStorage(key: string, onChange: () => void): () => void {
  const onLocal = (event: Event) => {
    if ((event as CustomEvent<string>).detail === key) onChange();
  };
  const onOther = (event: StorageEvent) => {
    if (event.key === key) onChange();
  };
  window.addEventListener(STORAGE_EVENT, onLocal);
  window.addEventListener("storage", onOther);
  return () => {
    window.removeEventListener(STORAGE_EVENT, onLocal);
    window.removeEventListener("storage", onOther);
  };
}
