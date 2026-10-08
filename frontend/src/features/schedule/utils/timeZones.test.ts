import { describe, expect, it } from "vitest";
import { TIME_ZONES } from "./timeZoneData";
import { defaultTimeZone, timeZoneOptions } from "./timeZones";

const OCTOBER = new Date(Date.UTC(2026, 9, 8, 12));
const JANUARY = new Date(Date.UTC(2026, 0, 15, 12));
const JUNE = new Date(Date.UTC(2026, 5, 1, 12));

const labelOf = (zone: string, at: Date) => timeZoneOptions(at).find((option) => option.value === zone)?.label;

describe("timeZoneOptions", () => {
  it.each([
    ["Asia/Kolkata", OCTOBER, "(GMT+5:30) Mumbai, Kolkata, New Delhi"],
    ["Asia/Kathmandu", OCTOBER, "(GMT+5:45) Kathmandu"],
    ["America/Los_Angeles", OCTOBER, "(GMT-7:00) Pacific Time (US and Canada)"],
    ["America/Los_Angeles", JANUARY, "(GMT-8:00) Pacific Time (US and Canada)"],
    ["America/St_Johns", OCTOBER, "(GMT-2:30) Newfoundland and Labrador"],
    ["Australia/Lord_Howe", OCTOBER, "(GMT+11:00) Lord Howe IsIand"],
    ["Australia/Lord_Howe", JUNE, "(GMT+10:30) Lord Howe IsIand"],
    ["Pacific/Auckland", OCTOBER, "(GMT+13:00) Auckland, Wellington"],
    ["UTC", OCTOBER, "(GMT+0:00) Universal Time UTC"],
    ["Europe/London", JANUARY, "(GMT+0:00) London"],
    ["Europe/London", JUNE, "(GMT+1:00) London"],
  ])("labels %s at %s as %s (hour not zero-padded, offset in effect then)", (zone, at, expected) => {
    expect(labelOf(zone, at)).toBe(expected);
  });

  it("labels all 149 zones with the offset at the given date", () => {
    const options = timeZoneOptions(OCTOBER);
    expect(options).toHaveLength(149);
    expect(new Set(options.map((option) => option.value)).size).toBe(149);
    expect(options.find((option) => option.value === "America/Los_Angeles")?.label).toBe(
      "(GMT-7:00) Pacific Time (US and Canada)",
    );
    expect(options.find((option) => option.value === "Asia/Kolkata")?.label).toBe("(GMT+5:30) Mumbai, Kolkata, New Delhi");
  });

  it("only contains zones the runtime knows", () => {
    for (const [zone] of TIME_ZONES) {
      expect(() => new Intl.DateTimeFormat("en-US", { timeZone: zone }), zone).not.toThrow();
    }
  });
});

describe("defaultTimeZone", () => {
  it("keeps a listed browser zone", () => {
    expect(defaultTimeZone("Asia/Kolkata", "UTC", OCTOBER)).toBe("Asia/Kolkata");
  });

  it("maps an unlisted zone to the first listed zone with the same current offset", () => {
    // Boise is on Mountain Daylight Time (GMT-6:00) in October
    expect(defaultTimeZone("America/Boise", "UTC", OCTOBER)).toBe("America/Edmonton");
  });

  it("falls back to the stored zone when no listed zone shares the offset", () => {
    expect(defaultTimeZone("Australia/Eucla", "Asia/Kolkata", OCTOBER)).toBe("Asia/Kolkata"); // GMT+8:45
    expect(defaultTimeZone("Pacific/Kiritimati", "Asia/Kolkata", OCTOBER)).toBe("Asia/Kolkata"); // GMT+14:00
  });

  it("treats an unknown zone id as UTC instead of throwing", () => {
    // in January the Azores are on GMT-1:00, so the first listed GMT+0:00 zone is UTC
    expect(defaultTimeZone("Not/AZone", "Asia/Kolkata", JANUARY)).toBe("UTC");
  });
});
