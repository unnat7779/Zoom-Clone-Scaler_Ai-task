// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { readStorage, subscribeStorage, writeStorage } from "./storage";

describe("readStorage / writeStorage", () => {
  it("round-trips JSON values", () => {
    writeStorage("zc.test", { a: 1, list: ["x"] });
    expect(localStorage.getItem("zc.test")).toBe('{"a":1,"list":["x"]}');
    expect(readStorage("zc.test", null)).toEqual({ a: 1, list: ["x"] });
  });

  it("returns the fallback for a missing key or malformed JSON", () => {
    expect(readStorage("zc.missing", "fallback")).toBe("fallback");
    localStorage.setItem("zc.test", "{not json");
    expect(readStorage("zc.test", 42)).toBe(42);
  });

  it("removes the key when the value is null", () => {
    writeStorage("zc.test", "value");
    writeStorage("zc.test", null);
    expect(localStorage.getItem("zc.test")).toBeNull();
  });

  it("never throws when storage is full or disabled", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("quota", "QuotaExceededError");
    });
    expect(() => writeStorage("zc.test", "value")).not.toThrow();
  });
});

describe("subscribeStorage", () => {
  it("fires for writes of the same key in this tab and in other tabs", () => {
    const onChange = vi.fn();
    const unsubscribe = subscribeStorage("zc.watched", onChange);

    writeStorage("zc.watched", 1);
    writeStorage("zc.other", 1);
    window.dispatchEvent(new StorageEvent("storage", { key: "zc.watched" }));
    window.dispatchEvent(new StorageEvent("storage", { key: "zc.other" }));
    expect(onChange).toHaveBeenCalledTimes(2);

    unsubscribe();
    writeStorage("zc.watched", 2);
    expect(onChange).toHaveBeenCalledTimes(2);
  });
});
