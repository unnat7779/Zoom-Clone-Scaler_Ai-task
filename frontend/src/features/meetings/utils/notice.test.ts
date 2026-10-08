import { describe, expect, it } from "vitest";
import { getTimeNotice } from "./notice";

const START = new Date("2026-10-08T15:00:00Z");
const MINUTE = 60_000;
const before = (ms: number) => new Date(START.getTime() - ms);

describe("getTimeNotice", () => {
  it("says In Progress for a live meeting at any time", () => {
    expect(getTimeNotice(START, 30, true, before(5 * 60 * MINUTE))).toEqual({ text: "In Progress", tone: "info" });
  });

  it.each([
    [30 * MINUTE + 1, null],
    [30 * MINUTE, "Starts in 30 minutes"],
    [2 * MINUTE + 59_000, "Starts in 2 minutes"],
    [2 * MINUTE, "Starts in 2 minutes"],
    [MINUTE + 1, "Starts in 1 minute"],
    [MINUTE, "Starts in 1 minute"],
    [1, "Starts in 1 minute"],
  ])("%i ms before the start → %j", (ms, text) => {
    expect(getTimeNotice(START, 30, false, before(ms))).toEqual(text === null ? null : { text, tone: "info" });
  });

  it("says NOW in red from the start until the scheduled end", () => {
    expect(getTimeNotice(START, 30, false, START)).toEqual({ text: "NOW", tone: "now" });
    expect(getTimeNotice(START, 30, false, before(-30 * MINUTE))).toEqual({ text: "NOW", tone: "now" });
    expect(getTimeNotice(START, 30, false, before(-30 * MINUTE - 1))).toBeNull();
  });
});
