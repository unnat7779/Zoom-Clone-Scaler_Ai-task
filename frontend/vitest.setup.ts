import { afterEach, vi } from "vitest";

const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
if (zone !== "America/New_York") {
  throw new Error(`Tests expect TZ=America/New_York (set in vitest.config.ts), got ${zone}`);
}

afterEach(() => {
  vi.useRealTimers();
  if (typeof window !== "undefined") {
    window.localStorage.clear();
    window.sessionStorage.clear();
  }
});
