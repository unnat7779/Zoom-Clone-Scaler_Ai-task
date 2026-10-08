import { describe, expect, it } from "vitest";
import { FROM_PWA_PARAM, routes } from "./routes";

describe("routes", () => {
  it("builds the static paths", () => {
    expect(routes.home()).toBe("/wc/home");
    expect(routes.joinShortcut()).toBe("/wc/join");
    expect(routes.schedule()).toBe("/meeting/schedule");
  });

  it("adds fromPWA=1 only when requested", () => {
    expect(FROM_PWA_PARAM).toBe("fromPWA");
    expect(routes.room("81234567890")).toBe("/wc/81234567890/meeting");
    expect(routes.room("81234567890", { fromPWA: false })).toBe("/wc/81234567890/meeting");
    expect(routes.room("81234567890", { fromPWA: true })).toBe("/wc/81234567890/meeting?fromPWA=1");
  });

  it("keeps pwd on the pre-join page and drops empty values", () => {
    expect(routes.preJoin("81234567890", { pwd: "aB3dE5", fromPWA: true })).toBe(
      "/wc/81234567890/join?pwd=aB3dE5&fromPWA=1",
    );
    expect(routes.preJoin("81234567890", { pwd: null })).toBe("/wc/81234567890/join");
    expect(routes.preJoin("81234567890", { pwd: undefined, fromPWA: false })).toBe("/wc/81234567890/join");
  });

  it("URL-encodes pwd and path segments", () => {
    expect(routes.preJoin("81234567890", { pwd: "a+b/c=d&e" })).toBe("/wc/81234567890/join?pwd=a%2Bb%2Fc%3Dd%26e");
    expect(routes.preJoin("12 3/4")).toBe("/wc/12%203%2F4/join");
  });

  it("adds the PMI calendar-entry id to start / detail / edit", () => {
    expect(routes.start("81234567890", { fromPWA: true, id: 42 })).toBe("/wc/81234567890/start?fromPWA=1&id=42");
    expect(routes.start("81234567890")).toBe("/wc/81234567890/start");
    expect(routes.meetingDetail("81234567890", { id: 7 })).toBe("/meeting/81234567890?id=7");
    expect(routes.meetingEdit("81234567890")).toBe("/meeting/81234567890/edit");
    expect(routes.meetingEdit("81234567890", { id: 7 })).toBe("/meeting/81234567890/edit?id=7");
  });

  it("keeps id=0 (a falsy but valid id)", () => {
    expect(routes.meetingDetail("81234567890", { id: 0 })).toBe("/meeting/81234567890?id=0");
  });

  it("builds the Meetings tab and left-page queries", () => {
    expect(routes.meetings()).toBe("/wc/meetings");
    expect(routes.meetings({ tab: "previous", select: "81234567890-3" })).toBe(
      "/wc/meetings?tab=previous&select=81234567890-3",
    );
    expect(routes.left("81234567890", { reason: "removed" })).toBe("/wc/81234567890/left?reason=removed");
    expect(routes.left("81234567890", { reason: "ended", pwd: "x" })).toBe("/wc/81234567890/left?reason=ended&pwd=x");
  });
});
