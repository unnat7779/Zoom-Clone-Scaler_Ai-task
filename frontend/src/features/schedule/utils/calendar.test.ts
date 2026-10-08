import { describe, expect, it } from "vitest";
import { decadeStart, formatScheduleDate } from "./calendar";

// The day grid and date keys moved to `@/shared/lib/calendar` and `@/shared/ui/DayGrid` (tested next to them).

describe("decadeStart", () => {
  it("starts the decade on the year ending in 0", () => {
    expect(decadeStart(2026)).toBe(2020);
    expect(decadeStart(2030)).toBe(2030);
    expect(decadeStart(2029)).toBe(2020);
  });
});

describe("formatScheduleDate", () => {
  it("pads month and day", () => {
    expect(formatScheduleDate(new Date(2026, 0, 5))).toBe("01/05/2026");
  });
});
