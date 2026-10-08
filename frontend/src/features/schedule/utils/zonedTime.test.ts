import { describe, expect, it } from "vitest";
import { instantToWallClock, wallClockToInstant } from "./zonedTime";

const iso = (date: string, time: string, zone: string) => wallClockToInstant(date, time, zone).toISOString();

describe("wallClockToInstant", () => {
  it.each([
    ["Asia/Kolkata", "2026-10-08", "11:00", "2026-10-08T05:30:00.000Z"],
    ["Asia/Kathmandu", "2026-10-08", "11:00", "2026-10-08T05:15:00.000Z"],
    ["America/Los_Angeles", "2026-10-08", "11:00", "2026-10-08T18:00:00.000Z"],
    ["America/Los_Angeles", "2026-01-15", "11:00", "2026-01-15T19:00:00.000Z"],
    ["UTC", "2026-10-08", "00:00", "2026-10-08T00:00:00.000Z"],
    ["Pacific/Kiritimati", "2026-10-08", "09:00", "2026-10-07T19:00:00.000Z"],
    ["Pacific/Pago_Pago", "2026-10-08", "23:45", "2026-10-09T10:45:00.000Z"],
    ["Australia/Lord_Howe", "2026-10-08", "12:00", "2026-10-08T01:00:00.000Z"],
    ["Australia/Lord_Howe", "2026-06-01", "12:00", "2026-06-01T01:30:00.000Z"],
  ])("%s %s %s → %s", (zone, date, time, expected) => {
    expect(iso(date, time, zone)).toBe(expected);
  });

  it("is independent of the browser's own zone", () => {
    // the test process runs in America/New_York; Tokyo has no DST
    expect(iso("2026-03-08", "02:30", "Asia/Tokyo")).toBe("2026-03-07T17:30:00.000Z");
  });

  it("uses the offset in effect on the target day, not today's", () => {
    expect(iso("2026-03-07", "12:00", "America/New_York")).toBe("2026-03-07T17:00:00.000Z"); // EST
    expect(iso("2026-03-09", "12:00", "America/New_York")).toBe("2026-03-09T16:00:00.000Z"); // EDT
    expect(iso("2026-03-08", "03:00", "America/New_York")).toBe("2026-03-08T07:00:00.000Z"); // first EDT minute
    expect(iso("2026-03-08", "01:59", "America/New_York")).toBe("2026-03-08T06:59:00.000Z"); // last EST minute
  });

  it("picks the first (daylight) occurrence of an ambiguous fall-back time, like the backend", () => {
    expect(iso("2026-11-01", "01:30", "America/New_York")).toBe("2026-11-01T05:30:00.000Z");
    expect(iso("2026-11-01", "02:00", "America/New_York")).toBe("2026-11-01T07:00:00.000Z");
  });

  it("maps a nonexistent spring-forward time with the pre-jump offset, like the backend (fold=0)", () => {
    // 02:00–02:59 do not exist on 2026-03-08 in New York: 02:30 EST = 03:30 EDT
    expect(iso("2026-03-08", "02:30", "America/New_York")).toBe("2026-03-08T07:30:00.000Z");
    expect(iso("2026-03-08", "02:00", "America/New_York")).toBe("2026-03-08T07:00:00.000Z");
    expect(instantToWallClock(wallClockToInstant("2026-03-08", "02:30", "America/New_York"), "America/New_York")).toEqual({
      date: "2026-03-08",
      hours: 3,
      minutes: 30,
    });
    // London skips 01:00–01:59 on 2026-03-29: 01:30 GMT = 02:30 BST
    expect(iso("2026-03-29", "01:30", "Europe/London")).toBe("2026-03-29T01:30:00.000Z");
  });

  it("round-trips every quarter hour across both 2026 DST changes", () => {
    const zones = ["America/New_York", "Europe/London", "Australia/Sydney", "Asia/Kolkata"];
    const days = ["2026-03-08", "2026-03-29", "2026-10-04", "2026-10-25", "2026-11-01"];
    for (const zone of zones) {
      for (const date of days) {
        for (let minute = 0; minute < 24 * 60; minute += 15) {
          const hours = Math.floor(minute / 60);
          const minutes = minute % 60;
          const time = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
          const instant = wallClockToInstant(date, time, zone);
          const clock = instantToWallClock(instant, zone);
          // times inside a spring-forward gap do not exist: they move forward by the skipped hour
          if (clock.date !== date || clock.hours !== hours || clock.minutes !== minutes) {
            const skipped = clock.date === date && clock.hours * 60 + clock.minutes - minute === 60;
            expect(skipped, `${zone} ${date} ${time} → ${JSON.stringify(clock)}`).toBe(true);
          }
        }
      }
    }
  });
});

describe("instantToWallClock", () => {
  it("reads the wall clock of another zone, crossing the date line", () => {
    const instant = new Date("2026-10-08T20:00:00Z");
    expect(instantToWallClock(instant, "Asia/Tokyo")).toEqual({ date: "2026-10-09", hours: 5, minutes: 0 });
    expect(instantToWallClock(instant, "Pacific/Pago_Pago")).toEqual({ date: "2026-10-08", hours: 9, minutes: 0 });
  });

  it("reports midnight as hour 0, never 24", () => {
    expect(instantToWallClock(new Date("2026-10-08T04:00:00Z"), "America/New_York")).toEqual({
      date: "2026-10-08",
      hours: 0,
      minutes: 0,
    });
  });

  it("pads single-digit months and days", () => {
    expect(instantToWallClock(new Date("2026-01-05T12:07:00Z"), "UTC")).toEqual({ date: "2026-01-05", hours: 12, minutes: 7 });
  });
});
