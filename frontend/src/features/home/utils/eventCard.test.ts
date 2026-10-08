import { describe, expect, it } from "vitest";
import type { MeetingListItem } from "@/shared/types/api";
import { getEventCardStatus, isSeparatedFromPast } from "./eventCard";

const START = Date.UTC(2026, 9, 8, 15, 0);
const MINUTE = 60_000;

const meeting = (overrides: Partial<MeetingListItem> = {}): MeetingListItem => ({
  id: 1,
  meeting_number: "81234567890",
  type: "scheduled",
  uses_pmi: false,
  topic: "Design review",
  start_time: new Date(START).toISOString(),
  duration_minutes: 40,
  timezone: "America/New_York",
  host_name: "Alex Morgan",
  is_live: false,
  has_instance: false,
  has_host: false,
  ...overrides,
});

const at = (offsetMs: number) => new Date(START + offsetMs);

describe("getEventCardStatus", () => {
  it.each([
    ["more than 15 min before", -15 * MINUTE - 1, "upcoming", null, null],
    ["exactly 15 min before", -15 * MINUTE, "coming", "Starting soon", "Start"],
    ["1 ms before the start", -1, "coming", "Starting soon", "Start"],
    ["at the start", 0, "now", "Now", "Start"],
    ["at the scheduled end", 40 * MINUTE, "now", "Now", "Start"],
    ["just after the end", 40 * MINUTE + 1, "past", null, null],
  ] as const)("%s → %s", (_, offset, state, statusLabel, action) => {
    expect(getEventCardStatus(meeting(), at(offset))).toEqual({ state, statusLabel, action });
  });

  it("keeps the Start pill for 15 minutes after the start of a short meeting that already ended", () => {
    const short = meeting({ duration_minutes: 10 });
    expect(getEventCardStatus(short, at(12 * MINUTE))).toEqual({ state: "past", statusLabel: null, action: "Start" });
    expect(getEventCardStatus(short, at(15 * MINUTE))).toMatchObject({ action: "Start" });
    expect(getEventCardStatus(short, at(15 * MINUTE + 1))).toMatchObject({ action: null });
  });

  it("marks a past meeting that ran as joined", () => {
    expect(getEventCardStatus(meeting({ has_instance: true }), at(2 * 60 * MINUTE)).state).toBe("pastJoined");
  });

  it("treats a live meeting as Now even outside its window", () => {
    expect(getEventCardStatus(meeting({ is_live: true }), at(-60 * MINUTE)).state).toBe("now");
    expect(getEventCardStatus(meeting({ is_live: true }), at(5 * 60 * MINUTE))).toEqual({
      state: "now",
      statusLabel: "Now",
      action: "Start",
    });
  });

  it("offers Join only when another browser hosts the live meeting", () => {
    expect(getEventCardStatus(meeting({ is_live: true, has_host: true }), at(MINUTE)).action).toBe("Join");
    expect(getEventCardStatus(meeting({ is_live: false, has_host: true }), at(MINUTE)).action).toBe("Start");
  });
});

describe("isSeparatedFromPast", () => {
  it("separates only the first non-past card after a never-joined past card", () => {
    expect(isSeparatedFromPast("past", "upcoming")).toBe(true);
    expect(isSeparatedFromPast("past", "pastJoined")).toBe(true);
    expect(isSeparatedFromPast("past", "past")).toBe(false);
    expect(isSeparatedFromPast("pastJoined", "upcoming")).toBe(false);
    expect(isSeparatedFromPast(undefined, "now")).toBe(false);
  });
});
