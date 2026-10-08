import { describe, expect, it, vi } from "vitest";
import { getAppUrl } from "./env";

describe("getAppUrl", () => {
  it("uses the configured public origin without a trailing slash", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://zoom.example.com//");
    expect(getAppUrl()).toBe("https://zoom.example.com");
  });

  it("falls back to localhost outside the browser", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "");
    expect(getAppUrl()).toBe("http://localhost:3000");
  });
});
