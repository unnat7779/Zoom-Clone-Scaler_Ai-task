/** The key fields of a `KeyboardEvent` the global search shortcut looks at. */
export type ShortcutKeys = Pick<KeyboardEvent, "key" | "metaKey" | "ctrlKey" | "altKey" | "shiftKey">;

/**
 * ⌘K (macOS) or Ctrl+K (everywhere else) opens the global Search dialog (PRD §6.4 [M]).
 * Both modifiers are accepted on every platform; Alt / Shift combinations are left to the browser.
 */
export function isSearchShortcut({ key, metaKey, ctrlKey, altKey, shiftKey }: ShortcutKeys): boolean {
  return key.toLowerCase() === "k" && metaKey !== ctrlKey && !altKey && !shiftKey;
}
