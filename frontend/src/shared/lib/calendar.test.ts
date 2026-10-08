import { describe, expect, it } from "vitest";
import { WEEKDAYS, monthGrid, parseDateKey, parseDateKeyOrNull } from "./calendar";
import { toDateKey } from "./format";

const keysOf = (days: Date[]) => days.map(toDateKey);

describe("monthGrid", () => {
  const october = monthGrid(new Date(2026, 9, 1));

  it("always has 6 weeks starting on the Sunday on or before the 1st", () => {
    expect(october).toHaveLength(42);
    expect(keysOf(october)[0]).toBe("2026-09-27");
    expect(october[0]?.getDay()).toBe(0);
    expect(keysOf(october).at(-1)).toBe("2026-11-07");
  });

  it("covers the whole month, whichever day of it is passed", () => {
    expect(keysOf(monthGrid(new Date(2026, 9, 31, 23, 59)))).toEqual(keysOf(october));
    expect(keysOf(october)).toContain("2026-10-01");
    expect(keysOf(october)).toContain("2026-10-31");
  });

  it("starts on the 1st itself when the month begins on a Sunday", () => {
    expect(keysOf(monthGrid(new Date(2026, 1, 15)))[0]).toBe("2026-02-01");
  });

  it.each([
    ["November (fall back on the 1st)", new Date(2026, 10, 1), ["2026-11-01", "2026-11-02", "2026-11-03"]],
    ["March (spring forward on the 8th)", new Date(2026, 2, 1), ["2026-03-01", "2026-03-02", "2026-03-03"]],
  ])("keeps one local-midnight cell per calendar day across the DST change in %s", (_, month, firstKeys) => {
    const days = monthGrid(month);
    const keys = keysOf(days);
    expect(new Set(keys).size).toBe(42);
    expect(keys.slice(0, 3)).toEqual(firstKeys);
    for (const day of days) expect(day.getHours(), toDateKey(day)).toBe(0);
  });
});

describe("parseDateKey", () => {
  it("round-trips YYYY-MM-DD through local midnight", () => {
    expect(toDateKey(parseDateKey("2026-03-08"))).toBe("2026-03-08");
    expect(toDateKey(parseDateKey("2026-11-01"))).toBe("2026-11-01");
    expect(parseDateKey("2026-10-07")).toEqual(new Date(2026, 9, 7));
  });

  it("returns an Invalid Date for a malformed key", () => {
    expect(Number.isNaN(parseDateKey("10/07/2026").getTime())).toBe(true);
    expect(Number.isNaN(parseDateKey("2026-13-01").getTime())).toBe(true);
  });
});

describe("parseDateKeyOrNull", () => {
  it("returns local midnight of a valid key", () => {
    expect(parseDateKeyOrNull("2026-10-08")).toEqual(new Date(2026, 9, 8));
  });

  it.each([null, undefined, "", "2026-1-8", "2026-10-08T00:00", "2026-02-30", "2026-13-01", "not-a-date"])(
    "rejects %j",
    (key) => {
      expect(parseDateKeyOrNull(key)).toBeNull();
    },
  );
});

describe("WEEKDAYS", () => {
  it("is Sunday-first with initials and full names", () => {
    expect(WEEKDAYS.map((weekday) => weekday.short).join("")).toBe("SMTWTFS");
    expect(WEEKDAYS.map((weekday) => weekday.name)).toEqual([
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ]);
  });
});
