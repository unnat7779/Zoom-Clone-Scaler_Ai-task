import { describe, expect, it } from "vitest";
import type { MeetingValidation } from "@/shared/types/api";
import { getPreJoinStage, isWaitingForHost, needsPasscode } from "./preJoinStage";

const validation = (overrides: Partial<MeetingValidation> = {}): MeetingValidation => ({
  exists: true,
  topic: "Design review",
  is_live: true,
  has_host: true,
  requires_passcode: false,
  passcode_ok: true,
  join_before_host: false,
  start_time: null,
  is_recurring: false,
  duration_minutes: null,
  participant_video_on: true,
  mute_upon_entry: false,
  ...overrides,
});

describe("getPreJoinStage", () => {
  it("is loading until validate answers, and unreachable when it failed", () => {
    expect(getPreJoinStage(undefined, false)).toBe("loading");
    expect(getPreJoinStage(undefined, true)).toBe("unreachable");
  });

  it("shows the invalid page for an unknown number", () => {
    expect(getPreJoinStage(validation({ exists: false, is_live: false }), false)).toBe("invalid");
  });

  it("shows the form for any existing meeting (Zoom asks for the name first, then holds the guest)", () => {
    expect(getPreJoinStage(validation({ is_live: false }), false)).toBe("form");
    expect(getPreJoinStage(validation({ is_live: false, join_before_host: true }), false)).toBe("form");
    expect(getPreJoinStage(validation({ is_live: true }), false)).toBe("form");
  });

  it("holds the guest for the host only when the meeting is not live and join-before-host is off", () => {
    expect(isWaitingForHost(validation({ is_live: false }))).toBe(true);
    expect(isWaitingForHost(validation({ is_live: false, join_before_host: true }))).toBe(false);
    expect(isWaitingForHost(validation({ is_live: true }))).toBe(false);
  });

  it("prefers cached validation data over a later refetch failure", () => {
    expect(getPreJoinStage(validation(), true)).toBe("form");
  });
});

describe("isWaitingForHost / needsPasscode", () => {
  it("never waits for a meeting that does not exist", () => {
    expect(isWaitingForHost(validation({ exists: false, is_live: false }))).toBe(false);
  });

  it("asks for the passcode only when the link's pwd did not unlock it", () => {
    expect(needsPasscode(validation({ requires_passcode: true, passcode_ok: false }))).toBe(true);
    expect(needsPasscode(validation({ requires_passcode: true, passcode_ok: true }))).toBe(false);
    expect(needsPasscode(validation({ requires_passcode: false, passcode_ok: true }))).toBe(false);
  });
});
