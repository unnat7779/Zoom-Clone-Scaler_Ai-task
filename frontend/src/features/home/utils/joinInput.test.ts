import { describe, expect, it } from "vitest";
import { formatHistoryNumber, formatProgressive, isJoinReady, normalizeJoinInput, parsePastedJoin } from "./joinInput";

const APP_ORIGIN = "http://localhost:3000";

describe("formatProgressive", () => {
  it.each([
    ["1", "1"],
    ["123", "123"],
    ["1234", "123 4"],
    ["123456", "123 456"],
    ["1234567", "123 456 7"],
    ["123456789", "123 456 789"],
    ["1234567890", "123 456 7890"],
    ["12345678901", "123 4567 8901"],
  ])("formats %s as %s", (digits, expected) => {
    expect(formatProgressive(digits)).toBe(expected);
  });
});

describe("normalizeJoinInput", () => {
  it("re-formats digits as they are typed, ignoring the user's own spaces", () => {
    expect(normalizeJoinInput("812 3")).toBe("812 3");
    expect(normalizeJoinInput("8123456 7")).toBe("812 345 67");
    expect(normalizeJoinInput("   ")).toBe("");
  });

  it("caps meeting IDs at 11 digits", () => {
    expect(normalizeJoinInput("123456789012345")).toBe("123 4567 8901");
  });

  it("keeps personal link names, capped at 40 characters", () => {
    expect(normalizeJoinInput("john.doe-1_x")).toBe("john.doe-1_x");
    expect(normalizeJoinInput("john doe")).toBe("johndoe");
    expect(normalizeJoinInput("a".repeat(45))).toBe("a".repeat(40));
  });

  it.each(["john@doe", "abc/def", "ünïcode", "812?pwd"])("rejects a change containing disallowed characters (%s)", (raw) => {
    expect(normalizeJoinInput(raw)).toBeNull();
  });
});

describe("isJoinReady", () => {
  it.each([
    ["123 456 78", false],
    ["123 456 789", true],
    ["123 456 7890", true],
    ["123 4567 8901", true],
    ["123456789012", false],
  ])("meeting ID %s → %s", (value, ready) => {
    expect(isJoinReady(value)).toBe(ready);
  });

  it.each([
    ["abcd", false],
    ["abcde", true],
    [`a${"b".repeat(39)}`, true],
    [`a${"b".repeat(40)}`, false],
    ["1abcde", false],
    ["_abcde", false],
    [".abcde", false],
    ["John.Doe-1_x", true],
    ["", false],
  ])("personal link name %j → %s", (value, ready) => {
    expect(isJoinReady(value)).toBe(ready);
  });
});

describe("formatHistoryNumber", () => {
  it("puts a space after 3 characters and before the last 4", () => {
    expect(formatHistoryNumber("81098765432")).toBe("810 9876 5432");
    expect(formatHistoryNumber("1234567890")).toBe("123 456 7890");
    expect(formatHistoryNumber("123456789")).toBe("123 45 6789");
    expect(formatHistoryNumber("1234567")).toBe("1234567");
  });
});

describe("parsePastedJoin", () => {
  it("keeps the number and every query param of a Zoom invite link", () => {
    expect(parsePastedJoin("https://us05web.zoom.us/j/81234567890?pwd=aB3.dE5&uname=x", APP_ORIGIN)).toEqual({
      value: "812 3456 7890",
      params: { pwd: "aB3.dE5", uname: "x" },
    });
  });

  it("accepts our own invite links (any scheme on the app origin)", () => {
    expect(parsePastedJoin(`${APP_ORIGIN}/j/123456789?pwd=XyZ`, APP_ORIGIN)).toEqual({
      value: "123 456 789",
      params: { pwd: "XyZ" },
    });
  });

  it.each([
    ["https://zoom.us/wc/join/1234567890", "123 456 7890"],
    ["https://zoom.us/wc/1234567890/join?pwd=p", "123 456 7890"],
    ["https://zoom.us/wc/1234567890/start", "123 456 7890"],
    ["https://zoom.us/s/81234567890?zak=token", "812 3456 7890"],
    ["https://zoomgov.com/j/81234567890", "812 3456 7890"],
    ["https://zoom.us/my/john.doe", "john.doe"],
  ])("recognises %s", (url, value) => {
    expect(parsePastedJoin(url, APP_ORIGIN).value).toBe(value);
  });

  it("ignores surrounding whitespace and fragments", () => {
    expect(parsePastedJoin("  https://zoom.us/j/81234567890?pwd=abc#success \n", APP_ORIGIN)).toEqual({
      value: "812 3456 7890",
      params: { pwd: "abc" },
    });
  });

  it("drops the params of links from other hosts or plain http Zoom links", () => {
    expect(parsePastedJoin("https://evil.example.com/j/81234567890?pwd=steal", APP_ORIGIN)).toEqual({
      value: "812 3456 7890",
      params: {},
    });
    expect(parsePastedJoin("http://zoom.us/j/81234567890?pwd=abc", APP_ORIGIN)).toEqual({
      value: "812 3456 7890",
      params: {},
    });
  });

  it("formats a pasted plain number and strips disallowed characters", () => {
    expect(parsePastedJoin("812 3456 7890", APP_ORIGIN)).toEqual({ value: "812 3456 7890", params: {} });
    expect(parsePastedJoin("john.doe!", APP_ORIGIN)).toEqual({ value: "john.doe", params: {} });
    expect(parsePastedJoin("123456789012345", APP_ORIGIN).value).toBe("123 4567 8901");
  });
});
