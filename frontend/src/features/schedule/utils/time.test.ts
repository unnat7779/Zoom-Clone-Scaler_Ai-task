import { describe, expect, it } from "vitest";
import {
  STANDARD_TIMES,
  filterTimes,
  from24Hour,
  minutesOfLabel,
  nextHalfHour,
  parseTypedTime,
  to24Hour,
  withCustomTimes,
} from "./time";

describe("STANDARD_TIMES", () => {
  it("lists 48 quarter hours from 12:00 to 11:45 without leading zeros", () => {
    expect(STANDARD_TIMES).toHaveLength(48);
    expect(STANDARD_TIMES.slice(0, 5)).toEqual(["12:00", "12:15", "12:30", "12:45", "1:00"]);
    expect(STANDARD_TIMES.at(-1)).toBe("11:45");
  });
});

describe("minutesOfLabel", () => {
  it.each([
    ["12:00", 0],
    ["12:15", 15],
    ["1:00", 60],
    ["09:10", 550],
    ["11:45", 705],
    ["garbage", 0],
  ])("%s → %i", (label, minutes) => {
    expect(minutesOfLabel(label)).toBe(minutes);
  });
});

describe("parseTypedTime", () => {
  it.each([
    ["9:10", "09:10"],
    ["09:10", "09:10"],
    ["12:05", "12:05"],
    ["9:15", "9:15"],
    ["09:15", "9:15"],
    [" 12:00 ", "12:00"],
    ["1:59", "01:59"],
  ])("accepts %j as %j", (text, expected) => {
    expect(parseTypedTime(text)).toBe(expected);
  });

  it.each(["", "abc", "13:00", "0:30", "00:00", "9:60", "9:75", "9:5", "9", "9:100", "-1:00"])("rejects %j", (text) => {
    expect(parseTypedTime(text)).toBeNull();
  });
});

describe("filterTimes", () => {
  it("returns every option for an empty query", () => {
    expect(filterTimes(STANDARD_TIMES, "  ")).toEqual(STANDARD_TIMES);
  });

  it("filters by prefix", () => {
    expect(filterTimes(STANDARD_TIMES, "3")).toEqual(["3:00", "3:15", "3:30", "3:45"]);
    expect(filterTimes(STANDARD_TIMES, "3:3")).toEqual(["3:30"]);
    expect(filterTimes(STANDARD_TIMES, "10")).toEqual(["10:00", "10:15", "10:30", "10:45"]);
    expect(filterTimes(STANDARD_TIMES, "1")).toHaveLength(16); // 1:xx, 10:xx, 11:xx, 12:xx
  });

  it("falls back to the first digit's hour for two digits without a match", () => {
    expect(filterTimes(STANDARD_TIMES, "13")).toEqual(["1:00", "1:15", "1:30", "1:45"]);
    expect(filterTimes(STANDARD_TIMES, "99")).toEqual(["9:00", "9:15", "9:30", "9:45"]);
  });

  it("returns nothing for other non-matching queries", () => {
    expect(filterTimes(STANDARD_TIMES, "3:7")).toEqual([]);
    expect(filterTimes(STANDARD_TIMES, "130")).toEqual([]);
  });
});

describe("withCustomTimes", () => {
  it("inserts free times in clock order without duplicating standard ones", () => {
    const list = withCustomTimes(["09:10", "12:05", "9:15"]);
    expect(list).toHaveLength(50);
    expect(list.slice(0, 3)).toEqual(["12:00", "12:05", "12:15"]);
    const nine = list.indexOf("9:00");
    expect(list.slice(nine, nine + 3)).toEqual(["9:00", "09:10", "9:15"]);
  });
});

describe("12 ⇄ 24-hour conversion", () => {
  it.each([
    ["12:00", "AM", "00:00"],
    ["12:30", "PM", "12:30"],
    ["9:10", "PM", "21:10"],
    ["09:10", "AM", "09:10"],
    ["11:45", "PM", "23:45"],
  ] as const)("%s %s → %s", (label, meridiem, expected) => {
    expect(to24Hour(label, meridiem)).toBe(expected);
  });

  it.each([
    [0, 0, "12:00", "AM"],
    [12, 0, "12:00", "PM"],
    [21, 10, "09:10", "PM"],
    [9, 30, "9:30", "AM"],
    [23, 45, "11:45", "PM"],
  ] as const)("%i:%i → %s %s", (hours, minutes, time, meridiem) => {
    expect(from24Hour(hours, minutes)).toEqual({ time, meridiem });
  });

  it("round-trips every minute of the day", () => {
    for (let minute = 0; minute < 24 * 60; minute += 1) {
      const hours = Math.floor(minute / 60);
      const minutes = minute % 60;
      const { time, meridiem } = from24Hour(hours, minutes);
      expect(to24Hour(time, meridiem)).toBe(`${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`);
    }
  });
});

describe("nextHalfHour", () => {
  const local = (hours: number, minutes: number, seconds = 0) => new Date(2026, 9, 7, hours, minutes, seconds, 500);

  it.each([
    [local(10, 0), new Date(2026, 9, 7, 10, 30)],
    [local(10, 29, 59), new Date(2026, 9, 7, 10, 30)],
    [local(10, 30), new Date(2026, 9, 7, 11, 0)],
    [local(10, 45), new Date(2026, 9, 7, 11, 0)],
    [local(23, 45), new Date(2026, 9, 8, 0, 0)],
  ])("%s → %s", (now, expected) => {
    expect(nextHalfHour(now)).toEqual(expected);
  });

  it("does not mutate its argument", () => {
    const now = local(10, 10);
    nextHalfHour(now);
    expect(now).toEqual(local(10, 10));
  });
});
