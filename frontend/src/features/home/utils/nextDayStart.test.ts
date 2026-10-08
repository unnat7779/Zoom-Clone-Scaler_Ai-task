import { describe, expect, it } from "vitest";
import { nextDayStartIso } from "./nextDayStart";

describe("nextDayStartIso", () => {
  it("is the UTC instant of the next local midnight", () => {
    expect(nextDayStartIso(new Date(2026, 9, 8, 23, 59))).toBe("2026-10-09T04:00:00.000Z");
  });

  it("follows the DST change (EDT → EST on Nov 1 2026)", () => {
    expect(nextDayStartIso(new Date(2026, 9, 31, 12))).toBe("2026-11-01T04:00:00.000Z");
    expect(nextDayStartIso(new Date(2026, 10, 1, 12))).toBe("2026-11-02T05:00:00.000Z");
  });
});
