import { describe, expect, it } from "vitest";
import { MIN_FULL_TOOLBAR, type MidItem, isCompactToolbar, splitToolbar } from "./toolbarOverflow";

const HOST: MidItem[] = ["participants", "chat", "react", "share", "hostTools"];
const ATTENDEE: MidItem[] = ["participants", "chat", "react", "share"];

describe("splitToolbar", () => {
  it("keeps every button inline on a wide stage", () => {
    expect(splitToolbar(HOST, 1366, false)).toEqual({ inline: HOST, overflow: [], promoted: null });
    expect(splitToolbar(HOST, Number.POSITIVE_INFINITY, false).overflow).toEqual([]);
  });

  it("moves Host tools into More first (panel open → 880px stage)", () => {
    expect(splitToolbar(HOST, 907, false).overflow).toEqual([]);
    expect(splitToolbar(HOST, 906, false).overflow).toEqual(["hostTools"]);
    expect(splitToolbar(HOST, 880, false)).toEqual({ inline: ["participants", "chat", "react", "share"], overflow: ["hostTools"], promoted: null });
  });

  it("then Share, React and Chat, keeping the inline order", () => {
    expect(splitToolbar(HOST, 800, false)).toEqual({ inline: ["participants", "chat", "react"], overflow: ["hostTools", "share"], promoted: null });
    expect(splitToolbar(HOST, 768, false).overflow).toEqual(["hostTools", "share"]);
  });

  it("skips items that are not present (attendees have no Host tools)", () => {
    expect(splitToolbar(ATTENDEE, 880, false).overflow).toEqual([]);
    expect(splitToolbar(ATTENDEE, 800, false).overflow).toEqual(["share"]);
  });

  it("keeps only Participants and Chat in the middle of the compact bar, at any width", () => {
    for (const width of [300, 360, 375, 767, 852]) {
      expect(splitToolbar(HOST, width, true)).toEqual({ inline: ["participants", "chat"], overflow: ["react", "share", "hostTools"], promoted: null });
      expect(splitToolbar(ATTENDEE, width, true)).toEqual({ inline: ["participants", "chat"], overflow: ["react", "share"], promoted: null });
    }
  });

  it("shows a promoted More item after the middle buttons without overflowing more of them", () => {
    expect(splitToolbar(HOST, 1280, false, "breakout")).toEqual({ inline: HOST, overflow: [], promoted: "breakout" });
    // room-33 / room-34: panel open → Host tools in More, Breakout Rooms still promoted next to Share
    expect(splitToolbar(HOST, 880, false, "breakout")).toEqual({
      inline: ["participants", "chat", "react", "share"],
      overflow: ["hostTools"],
      promoted: "breakout",
    });
    expect(splitToolbar(ATTENDEE, 880, false, "captions")).toEqual({ inline: ATTENDEE, overflow: [], promoted: "captions" });
  });

  it("drops the promoted button when it does not fit, and always on the compact phone bar", () => {
    // in-shell 768 viewport → 682 stage: Participants + Chat + More + divider + Show Captions (125) is too wide
    expect(splitToolbar(HOST, 682, false, "captions")).toMatchObject({ inline: ["participants", "chat"], promoted: null });
    expect(splitToolbar(HOST, 885, false, "stopIncomingVideo").promoted).toBeNull();
    expect(splitToolbar(HOST, 886, false, "stopIncomingVideo").promoted).toBe("stopIncomingVideo");
    expect(splitToolbar(HOST, 767, true, "settings").promoted).toBeNull();
  });

  it("uses the compact bar on phones and on stages too narrow for the smallest full-size bar", () => {
    expect(MIN_FULL_TOOLBAR).toBe(443);
    expect(isCompactToolbar(1366, false)).toBe(false);
    // iPad mini portrait with a side panel: 768 − 400 = 368
    expect(isCompactToolbar(368, false)).toBe(true);
    expect(isCompactToolbar(442, false)).toBe(true);
    expect(isCompactToolbar(443, false)).toBe(false);
    // not measured yet → full-size, like the inline-everything first render
    expect(isCompactToolbar(0, false)).toBe(false);
    expect(isCompactToolbar(852, true)).toBe(true);
  });

  it("does not mutate the input list", () => {
    const items = [...HOST];
    splitToolbar(items, 375, false);
    expect(items).toEqual(HOST);
  });
});
