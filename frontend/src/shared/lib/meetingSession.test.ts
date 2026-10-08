// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import type { MeetingSession } from "@/shared/types/api";
import { clearMeetingSession, loadMeetingSession, saveMeetingSession } from "./meetingSession";

const session: MeetingSession = {
  participant: {
    id: 7,
    display_name: "Alex Morgan",
    role: "host",
    is_guest: false,
    audio_muted: true,
    video_on: false,
    joined_at: "2026-10-08T15:00:00Z",
  },
  token: "signed-token",
  instance_id: 3,
};
const preferences = { audioMuted: true, videoOn: false, audioOutputId: "speaker-2" };

describe("meeting session hand-off", () => {
  it("saves per meeting number in sessionStorage with a timestamp", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-08T15:00:00Z"));
    saveMeetingSession("81234567890", session, preferences);

    expect(localStorage.length).toBe(0);
    expect(loadMeetingSession("81234567890")).toEqual({
      ...session,
      meetingNumber: "81234567890",
      preferences,
      savedAt: Date.UTC(2026, 9, 8, 15),
    });
    expect(loadMeetingSession("99999999999")).toBeNull();
  });

  it("clears only the given meeting", () => {
    saveMeetingSession("111111111", session, preferences);
    saveMeetingSession("222222222", session, preferences);
    clearMeetingSession("111111111");
    expect(loadMeetingSession("111111111")).toBeNull();
    expect(loadMeetingSession("222222222")).not.toBeNull();
  });

  it("returns null for corrupted data", () => {
    sessionStorage.setItem("zc.session.81234567890", "{oops");
    expect(loadMeetingSession("81234567890")).toBeNull();
  });

  it("does not throw when storage is unavailable", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("disabled", "SecurityError");
    });
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new DOMException("disabled", "SecurityError");
    });
    expect(() => saveMeetingSession("81234567890", session, preferences)).not.toThrow();
    expect(() => clearMeetingSession("81234567890")).not.toThrow();
  });
});
