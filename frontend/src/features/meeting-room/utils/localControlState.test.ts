import { describe, expect, it } from "vitest";
import { audioControlState, videoControlState } from "./localControlState";

describe("audioControlState", () => {
  it("shows Join Audio while the microphone request is pending, whatever else is known", () => {
    expect(audioControlState({ joining: true, blocked: true, muted: true })).toBe("joining");
    expect(audioControlState({ joining: true, blocked: false, muted: false })).toBe("joining");
  });

  it("then the disallowed state, then Unmute / Mute", () => {
    expect(audioControlState({ joining: false, blocked: true, muted: false })).toBe("blocked");
    expect(audioControlState({ joining: false, blocked: false, muted: true })).toBe("muted");
    expect(audioControlState({ joining: false, blocked: false, muted: false })).toBe("live");
  });
});

describe("videoControlState", () => {
  it("shows the spinner while the camera opens, then blocked, on or off", () => {
    expect(videoControlState({ starting: true, blocked: true, on: false })).toBe("starting");
    expect(videoControlState({ starting: false, blocked: true, on: false })).toBe("blocked");
    expect(videoControlState({ starting: false, blocked: false, on: true })).toBe("on");
    expect(videoControlState({ starting: false, blocked: false, on: false })).toBe("off");
  });
});
