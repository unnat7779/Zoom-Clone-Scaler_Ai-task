import { describe, expect, it } from "vitest";
import { type ShortcutKeys, isSearchShortcut } from "./searchShortcut";

const keys = (overrides: Partial<ShortcutKeys>): ShortcutKeys => ({
  key: "k",
  metaKey: false,
  ctrlKey: false,
  altKey: false,
  shiftKey: false,
  ...overrides,
});

describe("isSearchShortcut", () => {
  it("accepts ⌘K and Ctrl+K", () => {
    expect(isSearchShortcut(keys({ metaKey: true }))).toBe(true);
    expect(isSearchShortcut(keys({ ctrlKey: true }))).toBe(true);
  });

  it("ignores the key's case (Caps Lock)", () => {
    expect(isSearchShortcut(keys({ key: "K", metaKey: true }))).toBe(true);
  });

  it("needs exactly one of ⌘ / Ctrl", () => {
    expect(isSearchShortcut(keys({}))).toBe(false);
    expect(isSearchShortcut(keys({ metaKey: true, ctrlKey: true }))).toBe(false);
  });

  it("leaves Alt and Shift combinations and other keys alone", () => {
    expect(isSearchShortcut(keys({ metaKey: true, shiftKey: true }))).toBe(false);
    expect(isSearchShortcut(keys({ ctrlKey: true, altKey: true }))).toBe(false);
    expect(isSearchShortcut(keys({ key: "j", metaKey: true }))).toBe(false);
  });
});
