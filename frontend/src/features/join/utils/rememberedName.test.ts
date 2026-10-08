// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { STORAGE_KEYS } from "@/shared/lib/storage";
import { getRememberedName, setRememberedName } from "./rememberedName";

describe("remembered display name", () => {
  it("stores a trimmed name and forgets blank ones", () => {
    setRememberedName("  Alex Morgan  ");
    expect(getRememberedName()).toBe("Alex Morgan");

    setRememberedName("   ");
    expect(localStorage.getItem(STORAGE_KEYS.displayName)).toBeNull();
    expect(getRememberedName()).toBeNull();
  });

  it("ignores a hand-edited non-string value", () => {
    localStorage.setItem(STORAGE_KEYS.displayName, "123");
    expect(getRememberedName()).toBeNull();
  });
});
