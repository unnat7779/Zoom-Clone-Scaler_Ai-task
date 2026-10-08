import { describe, expect, it, vi } from "vitest";
import {
  formatClockTime,
  formatLongDate,
  formatMeetingNumber,
  formatRelativeDayLabel,
  formatTimeRange,
  meetingWindow,
  parseApiDate,
  relativeDayName,
  toDateKey,
} from "./format";

/** Local (America/New_York, see vitest.config.ts) wall-clock date; month is 1-based. */
const local = (year: number, month: number, day: number, hours = 0, minutes = 0, seconds = 0, ms = 0) =>
  new Date(year, month - 1, day, hours, minutes, seconds, ms);

describe("formatMeetingNumber", () => {
  it.each([
    ["123456789", "123 456 789"],
    ["1234567890", "123 456 7890"],
    ["81234567890", "812 3456 7890"],
  ])("groups %s as %s", (input, expected) => {
    expect(formatMeetingNumber(input)).toBe(expected);
  });

  it("accepts numbers and already-formatted strings", () => {
    expect(formatMeetingNumber(81234567890)).toBe("812 3456 7890");
    expect(formatMeetingNumber("812 3456 7890")).toBe("812 3456 7890");
    expect(formatMeetingNumber("812-345-6789")).toBe("812 345 6789");
  });

  it.each(["", "12345678", "123456789012", "abc"])("returns the bare digits of an unsupported length (%j)", (input) => {
    expect(formatMeetingNumber(input)).toBe(input.replace(/\D/g, ""));
  });
});

describe("clock and date formatters", () => {
  it("formats the clock in 12-hour time without a leading zero", () => {
    expect(formatClockTime(local(2026, 10, 7, 23, 6))).toBe("11:06 PM");
    expect(formatClockTime(local(2026, 10, 7, 0, 0))).toBe("12:00 AM");
    expect(formatClockTime(local(2026, 10, 7, 12, 0))).toBe("12:00 PM");
    expect(formatClockTime(local(2026, 10, 7, 9, 5))).toBe("9:05 AM");
  });

  it("formats the long Home date", () => {
    expect(formatLongDate(local(2026, 10, 7, 23, 59))).toBe("Wednesday, October 7");
  });

  it("formats a time range, including one that crosses midnight", () => {
    expect(formatTimeRange(local(2026, 10, 7, 10), local(2026, 10, 7, 10, 40))).toBe("10:00 AM - 10:40 AM");
    expect(formatTimeRange(local(2026, 10, 7, 23, 30), local(2026, 10, 8, 0, 30))).toBe("11:30 PM - 12:30 AM");
  });

  it("parses API instants as UTC and renders them in the local zone", () => {
    const start = parseApiDate("2026-10-08T15:00:00Z");
    expect(start.getTime()).toBe(Date.UTC(2026, 9, 8, 15));
    expect(formatClockTime(start)).toBe("11:00 AM"); // EDT = UTC-4
    expect(toDateKey(parseApiDate("2026-10-08T03:30:00Z"))).toBe("2026-10-07"); // still the 7th locally
  });
});

describe("formatRelativeDayLabel", () => {
  const now = local(2026, 10, 7, 14, 0);

  it.each([
    [local(2026, 10, 7, 0, 0), "Today, Oct 7"],
    [local(2026, 10, 7, 23, 59, 59), "Today, Oct 7"],
    [local(2026, 10, 8, 0, 0), "Tomorrow, Oct 8"],
    [local(2026, 10, 6, 23, 59), "Yesterday, Oct 6"],
    [local(2026, 10, 9, 9, 0), "Fri, Oct 9"],
    [local(2026, 10, 5, 9, 0), "Mon, Oct 5"],
  ])("labels %s relative to Oct 7 2pm", (date, expected) => {
    expect(formatRelativeDayLabel(date, now)).toBe(expected);
  });

  it("compares calendar days, not 24-hour distances, around midnight", () => {
    const justBeforeMidnight = local(2026, 10, 7, 23, 59, 59, 999);
    expect(formatRelativeDayLabel(local(2026, 10, 8, 0, 0), justBeforeMidnight)).toBe("Tomorrow, Oct 8");
    expect(formatRelativeDayLabel(local(2026, 10, 9, 0, 0), justBeforeMidnight)).toBe("Fri, Oct 9");

    const justAfterMidnight = local(2026, 10, 8, 0, 0, 0, 1);
    expect(formatRelativeDayLabel(local(2026, 10, 7, 23, 59), justAfterMidnight)).toBe("Yesterday, Oct 7");
    expect(formatRelativeDayLabel(local(2026, 10, 8, 23, 59), justAfterMidnight)).toBe("Today, Oct 8");
  });

  it("handles year boundaries and the 25-hour DST fall-back day", () => {
    expect(formatRelativeDayLabel(local(2027, 1, 1, 0, 15), local(2026, 12, 31, 23, 30))).toBe("Tomorrow, Jan 1");
    expect(formatRelativeDayLabel(local(2026, 12, 31, 23, 30), local(2027, 1, 1, 0, 15))).toBe("Yesterday, Dec 31");
    // Nov 1 2026 has 25 hours in New York: 23:30 on Oct 31 → 23:30 on Nov 1 is still "tomorrow".
    expect(formatRelativeDayLabel(local(2026, 11, 1, 23, 30), local(2026, 10, 31, 23, 30))).toBe("Tomorrow, Nov 1");
  });

  it("defaults `now` to the current time", () => {
    vi.useFakeTimers();
    vi.setSystemTime(local(2026, 10, 7, 23, 59));
    expect(formatRelativeDayLabel(local(2026, 10, 8, 0, 1))).toBe("Tomorrow, Oct 8");
  });
});

describe("relativeDayName", () => {
  const now = local(2026, 12, 31, 22, 0);

  it("names today, tomorrow and yesterday by calendar day", () => {
    expect(relativeDayName(local(2026, 12, 31, 0, 0), now)).toBe("Today");
    expect(relativeDayName(local(2027, 1, 1, 23, 59), now)).toBe("Tomorrow");
    expect(relativeDayName(local(2026, 12, 30, 0, 0), now)).toBe("Yesterday");
    expect(relativeDayName(local(2027, 1, 2, 0, 0), now)).toBeNull();
  });

  it("only uses the allowed names", () => {
    expect(relativeDayName(local(2026, 12, 30, 8), now, ["Today", "Tomorrow"])).toBeNull();
    expect(relativeDayName(local(2027, 1, 1, 8), now, ["Today", "Yesterday"])).toBeNull();
    expect(relativeDayName(local(2026, 12, 31, 8), now, ["Today", "Yesterday"])).toBe("Today");
  });
});

describe("meetingWindow", () => {
  it("ends duration minutes after the API start", () => {
    const { start, end } = meetingWindow("2026-10-08T15:00:00Z", 90);
    expect(start.getTime()).toBe(Date.UTC(2026, 9, 8, 15));
    expect(end.getTime()).toBe(Date.UTC(2026, 9, 8, 16, 30));
  });

  it("counts real minutes across the DST fall-back (Nov 1 2026, New York)", () => {
    const { end } = meetingWindow("2026-11-01T05:30:00Z", 60); // 1:30 AM EDT
    expect(formatClockTime(end)).toBe("1:30 AM"); // the second 1:30, now EST
  });
});
