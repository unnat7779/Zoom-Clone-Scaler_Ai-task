import { describe, expect, it } from "vitest";
import type { Participant } from "@/shared/types/api";
import type { WelcomeMeeting } from "@/shared/types/realtime";
import { type RoomAction, type RoomState, initialRoomState, isTerminalPhase, roomReducer } from "./roomReducer";

const person = (id: number, joinedSecond: number, overrides: Partial<Participant> = {}): Participant => ({
  id,
  display_name: `Person ${id}`,
  role: "attendee",
  is_guest: true,
  audio_muted: false,
  video_on: true,
  joined_at: `2026-10-08T15:00:${String(joinedSecond).padStart(2, "0")}Z`,
  ...overrides,
});

const MEETING: WelcomeMeeting = {
  number: "81234567890",
  topic: "Design review",
  host_name: "Alex Morgan",
  invite_url: "http://localhost:3000/j/81234567890?pwd=x",
  passcode: "aB3dE5",
  numeric_passcode: "123456",
  start_time: null,
  duration_minutes: 60,
};

const stream = (id: string) => ({ id }) as MediaStream;

const welcome = (self: Participant, others: Participant[]): RoomAction => ({
  type: "welcome",
  self,
  participants: others,
  meeting: MEETING,
  settings: { allow_unmute: false, mute_on_entry: true },
});

const reduce = (actions: RoomAction[], state: RoomState = initialRoomState) => actions.reduce(roomReducer, state);

const host = person(1, 0, { role: "host", is_guest: false });
const guest = person(2, 5);
const late = person(3, 9);

describe("roomReducer", () => {
  it("goes live on welcome with self merged into the roster in join order", () => {
    const state = reduce([welcome(guest, [late, host])]);
    expect(state.phase).toBe("live");
    expect(state.selfId).toBe(2);
    expect(state.participants.map((p) => p.id)).toEqual([1, 2, 3]);
    expect(state.meeting).toBe(MEETING);
    expect(state.settings).toEqual({ allow_unmute: false, mute_on_entry: true });
  });

  it("breaks join-time ties by id", () => {
    const state = reduce([welcome(person(9, 1), [person(4, 1), person(6, 1)])]);
    expect(state.participants.map((p) => p.id)).toEqual([4, 6, 9]);
  });

  it("drops stale streams and connection states when a reconnect welcome arrives", () => {
    const state = reduce([
      welcome(host, [guest]),
      { type: "stream", participantId: 2, stream: stream("old") },
      { type: "connection", participantId: 2, state: "connected" },
      { type: "phase", phase: "reconnecting" },
      welcome(host, [guest]),
    ]);
    expect(state).toMatchObject({ phase: "live", streams: {}, connections: {} });
  });

  it("upserts participants: adds newcomers in join order and replaces updates in place", () => {
    const state = reduce([
      welcome(host, [late]),
      { type: "upsert", participant: guest },
      { type: "upsert", participant: { ...late, audio_muted: true, display_name: "Renamed" } },
    ]);
    expect(state.participants.map((p) => p.id)).toEqual([1, 2, 3]);
    expect(state.participants[2]).toMatchObject({ audio_muted: true, display_name: "Renamed" });
  });

  it("removes a participant together with their stream and connection", () => {
    const state = reduce([
      welcome(host, [guest, late]),
      { type: "stream", participantId: 2, stream: stream("a") },
      { type: "stream", participantId: 3, stream: stream("b") },
      { type: "connection", participantId: 2, state: "connected" },
      { type: "remove", participantId: 2 },
    ]);
    expect(state.participants.map((p) => p.id)).toEqual([1, 3]);
    expect(Object.keys(state.streams)).toEqual(["3"]);
    expect(state.connections).toEqual({});
  });

  it("swaps the host role on hostChanged", () => {
    const state = reduce([welcome(host, [guest, late]), { type: "hostChanged", hostId: 3, previousHostId: 1 }]);
    expect(state.participants.map((p) => [p.id, p.role])).toEqual([
      [1, "attendee"],
      [2, "attendee"],
      [3, "host"],
    ]);
  });

  it("updates settings from settings_updated", () => {
    const state = reduce([welcome(host, []), { type: "settings", settings: { allow_unmute: true, mute_on_entry: false } }]);
    expect(state.settings).toEqual({ allow_unmute: true, mute_on_entry: false });
  });

  describe("terminal phases", () => {
    it.each(["ended", "removed", "duplicate", "left", "failed"] as const)("%s is final", (phase) => {
      expect(isTerminalPhase(phase)).toBe(true);
      const state = reduce([welcome(host, []), { type: "phase", phase }]);
      expect(reduce([{ type: "phase", phase: "reconnecting" }, welcome(host, [guest])], state).phase).toBe(phase);
    });

    it.each(["connecting", "live", "reconnecting"] as const)("%s is not final", (phase) => {
      expect(isTerminalPhase(phase)).toBe(false);
    });

    it("returns the same object when a phase change is ignored", () => {
      const ended = reduce([{ type: "phase", phase: "ended" }]);
      expect(roomReducer(ended, { type: "phase", phase: "live" })).toBe(ended);
    });
  });
});
