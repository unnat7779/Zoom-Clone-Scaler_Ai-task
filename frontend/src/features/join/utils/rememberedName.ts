import { STORAGE_KEYS, readStorage, writeStorage } from "@/shared/lib/storage";

/** Name saved by the pre-join "Remember my name for future meetings", or null. */
export function getRememberedName(): string | null {
  const name = readStorage<string | null>(STORAGE_KEYS.displayName, null);
  return typeof name === "string" && name.trim() ? name : null;
}

/** Saves the display name; pass null to forget it. */
export function setRememberedName(name: string | null): void {
  writeStorage(STORAGE_KEYS.displayName, name?.trim() ? name.trim() : null);
}
