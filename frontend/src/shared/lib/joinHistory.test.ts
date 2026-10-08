// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import {
  JOIN_HISTORY_LIMIT,
  addJoinHistoryEntry,
  readJoinHistory,
  sanitizeJoinHistory,
} from "./joinHistory";
import { STORAGE_KEYS } from "./storage";

const entry = (n: number) => ({ number: String(81234567800 + n), topic: `Meeting ${n}` });

describe("join history", () => {
  it("starts empty", () => {
    expect(readJoinHistory()).toEqual([]);
  });

  it("puts the newest entry first", () => {
    addJoinHistoryEntry(entry(1));
    addJoinHistoryEntry(entry(2));
    expect(readJoinHistory()).toEqual([entry(2), entry(1)]);
  });

  it("keeps one row per meeting number, moved to the top with the latest topic", () => {
    addJoinHistoryEntry(entry(1));
    addJoinHistoryEntry(entry(2));
    addJoinHistoryEntry({ number: entry(1).number, topic: "Renamed" });
    expect(readJoinHistory()).toEqual([{ number: entry(1).number, topic: "Renamed" }, entry(2)]);
  });

  it(`caps the list at ${JOIN_HISTORY_LIMIT} rows, dropping the oldest`, () => {
    for (let n = 1; n <= JOIN_HISTORY_LIMIT + 3; n += 1) addJoinHistoryEntry(entry(n));
    const history = readJoinHistory();
    expect(history).toHaveLength(JOIN_HISTORY_LIMIT);
    expect(history[0]).toEqual(entry(JOIN_HISTORY_LIMIT + 3));
    expect(history.at(-1)).toEqual(entry(4));
  });

  it("survives malformed storage", () => {
    localStorage.setItem(STORAGE_KEYS.joinHistory, "not json");
    expect(readJoinHistory()).toEqual([]);

    localStorage.setItem(STORAGE_KEYS.joinHistory, JSON.stringify({ number: "1" }));
    expect(readJoinHistory()).toEqual([]);

    localStorage.setItem(STORAGE_KEYS.joinHistory, JSON.stringify([entry(1), null, "x", { number: 5, topic: "t" }]));
    expect(readJoinHistory()).toEqual([entry(1)]);
    addJoinHistoryEntry(entry(2));
    expect(readJoinHistory()).toEqual([entry(2), entry(1)]);
  });
});

describe("sanitizeJoinHistory", () => {
  it("drops rows without string number and topic and truncates to the limit", () => {
    const rows = [...Array.from({ length: 25 }, (_, n) => entry(n)), { number: "1" }];
    expect(sanitizeJoinHistory(rows)).toHaveLength(JOIN_HISTORY_LIMIT);
    expect(sanitizeJoinHistory([{ number: "1", topic: 2 }, { topic: "x" }])).toEqual([]);
    expect(sanitizeJoinHistory(undefined)).toEqual([]);
  });
});
