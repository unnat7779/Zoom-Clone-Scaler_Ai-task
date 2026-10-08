import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Participant } from "@/shared/types/api";
import type { ServerMessage } from "@/shared/types/realtime";
import { createMessageHandler } from "./messageHandler";
import type { PeerManager } from "./peerManager";
import { type RoomAction, type RoomState, initialRoomState, roomReducer } from "./roomReducer";
import type { SignalingClient } from "./signalingClient";

const person = (id: number, overrides: Partial<Participant> = {}): Participant => ({
  id,
  display_name: `Person ${id}`,
  role: "attendee",
  is_guest: true,
  audio_muted: false,
  video_on: true,
  joined_at: `2026-10-08T15:00:0${id}Z`,
  ...overrides,
});

const welcome = (self: Participant, participants: Participant[]): ServerMessage => ({
  type: "welcome",
  self,
  participants,
  meeting: {
    number: "81234567890",
    topic: "Design review",
    host_name: "Person 1",
    invite_url: "http://localhost:3000/j/81234567890",
    passcode: null,
    numeric_passcode: null,
    start_time: null,
    duration_minutes: 60,
  },
  settings: { allow_unmute: true, mute_on_entry: false },
});

/** A handler wired to fakes; dispatch runs the real reducer so `state()` stays realistic. */
function setup() {
  let state: RoomState = initialRoomState;
  let muted = false;
  let leaving = false;
  const peers = {
    closeAll: vi.fn(),
    closePeer: vi.fn(),
    connectTo: vi.fn(() => Promise.resolve()),
    handleOffer: vi.fn(() => Promise.resolve()),
    handleAnswer: vi.fn(() => Promise.resolve()),
    handleIce: vi.fn(() => Promise.resolve()),
  };
  const client = { close: vi.fn() };
  const media = {
    isAudioMuted: () => muted,
    setAudioMuted: vi.fn((value: boolean) => {
      muted = value;
    }),
    setVideoOn: vi.fn(),
    release: vi.fn(),
  };
  const dispatch = vi.fn((action: RoomAction) => {
    state = roomReducer(state, action);
  });
  const emit = vi.fn();
  const handler = createMessageHandler({
    dispatch,
    peers: peers as unknown as PeerManager,
    client: client as unknown as SignalingClient,
    state: () => state,
    isLeaving: () => leaving,
    media,
    emit,
  });
  return {
    handle: handler.handle,
    dispose: handler.dispose,
    peers,
    client,
    media,
    dispatch,
    emit,
    state: () => state,
    setLeaving: (value: boolean) => {
      leaving = value;
    },
  };
}

const host = person(1, { role: "host", is_guest: false });
const guest = person(2, { audio_muted: true, video_on: false });
const other = person(3);

describe("createMessageHandler", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  describe("welcome", () => {
    it("applies the roster and own media state, then offers to everyone already there", () => {
      const ctx = setup();
      ctx.handle(welcome(guest, [host, other]));

      expect(ctx.peers.closeAll).toHaveBeenCalledOnce();
      expect(ctx.state()).toMatchObject({ phase: "live", selfId: 2 });
      expect(ctx.media.setAudioMuted).toHaveBeenCalledWith(true);
      expect(ctx.media.setVideoOn).toHaveBeenCalledWith(false);
      expect(ctx.peers.connectTo.mock.calls).toEqual([[1], [3]]);
      expect(ctx.emit).not.toHaveBeenCalled();
    });

    it("announces 'You are host now' on the first welcome only, then 'reconnected'", () => {
      const ctx = setup();
      ctx.handle(welcome(host, []));
      ctx.handle(welcome(host, []));
      expect(ctx.emit.mock.calls).toEqual([[{ type: "hostNow" }], [{ type: "reconnected" }]]);
    });

    it("swallows a failed offer", async () => {
      const ctx = setup();
      ctx.peers.connectTo.mockRejectedValueOnce(new Error("ICE failed"));
      ctx.handle(welcome(host, [guest]));
      await vi.runAllTimersAsync();
      expect(ctx.state().participants).toHaveLength(2);
    });
  });

  describe("roster and signalling", () => {
    it("resets the peer of a participant who (re)joins and removes the one who left", () => {
      const ctx = setup();
      ctx.handle(welcome(host, [guest]));
      ctx.handle({ type: "participant_joined", participant: other });
      expect(ctx.peers.closePeer).toHaveBeenLastCalledWith(3);
      expect(ctx.state().participants.map((p) => p.id)).toEqual([1, 2, 3]);

      ctx.handle({ type: "participant_updated", participant: { ...other, audio_muted: true } });
      expect(ctx.state().participants[2]?.audio_muted).toBe(true);

      ctx.handle({ type: "participant_left", participant_id: 2, reason: "left" });
      expect(ctx.peers.closePeer).toHaveBeenLastCalledWith(2);
      expect(ctx.state().participants.map((p) => p.id)).toEqual([1, 3]);
    });

    it("routes offers, answers and ICE candidates to the peer manager", () => {
      const ctx = setup();
      const candidate = { candidate: "candidate:1", sdpMid: "0" };
      ctx.handle({ type: "offer", from: 2, to: 1, sdp: "offer-sdp" });
      ctx.handle({ type: "answer", from: 3, to: 1, sdp: "answer-sdp" });
      ctx.handle({ type: "ice", from: 2, to: 1, candidate });
      ctx.handle({ type: "ice", from: 2, to: 1, candidate: null });
      expect(ctx.peers.handleOffer).toHaveBeenCalledWith(2, "offer-sdp");
      expect(ctx.peers.handleAnswer).toHaveBeenCalledWith(3, "answer-sdp");
      expect(ctx.peers.handleIce.mock.calls).toEqual([
        [2, candidate],
        [2, null],
      ]);
    });
  });

  describe("host_changed", () => {
    it("tells me when I become host", () => {
      const ctx = setup();
      ctx.handle(welcome(guest, [host]));
      ctx.handle({ type: "host_changed", host_id: 2, previous_host_id: 1 });
      expect(ctx.emit).toHaveBeenLastCalledWith({ type: "hostNow" });
      expect(ctx.state().participants.find((p) => p.id === 2)?.role).toBe("host");
    });

    it("names the new host otherwise, and stays quiet for an unknown id", () => {
      const ctx = setup();
      ctx.handle(welcome(host, [guest]));
      ctx.emit.mockClear();
      ctx.handle({ type: "host_changed", host_id: 2, previous_host_id: 1 });
      expect(ctx.emit).toHaveBeenCalledWith({ type: "hostIs", name: "Person 2" });

      ctx.emit.mockClear();
      ctx.handle({ type: "host_changed", host_id: 99, previous_host_id: 2 });
      expect(ctx.emit).not.toHaveBeenCalled();
    });
  });

  describe("muting", () => {
    it("announces a single force_mute after 250 ms", () => {
      const ctx = setup();
      ctx.handle({ type: "force_mute", by: 1 });
      expect(ctx.media.setAudioMuted).toHaveBeenCalledWith(true);
      vi.advanceTimersByTime(249);
      expect(ctx.emit).not.toHaveBeenCalled();
      vi.advanceTimersByTime(1);
      expect(ctx.emit).toHaveBeenCalledExactlyOnceWith({ type: "forceMuted", all: false });
    });

    it("turns force_mute + settings_updated into one 'muted all' toast", () => {
      const ctx = setup();
      ctx.handle({ type: "force_mute", by: 1 });
      ctx.handle({ type: "settings_updated", allow_unmute: false, mute_on_entry: true });
      vi.advanceTimersByTime(1000);
      expect(ctx.emit).toHaveBeenCalledExactlyOnceWith({ type: "forceMuted", all: true });
      expect(ctx.state().settings).toEqual({ allow_unmute: false, mute_on_entry: true });
    });

    it("updates settings silently without a preceding force_mute", () => {
      const ctx = setup();
      ctx.handle({ type: "settings_updated", allow_unmute: true, mute_on_entry: false });
      vi.advanceTimersByTime(1000);
      expect(ctx.emit).not.toHaveBeenCalled();
    });

    it("re-mutes and explains when unmuting is refused (NOT_HOST)", () => {
      const ctx = setup();
      ctx.handle({ type: "error", code: "NOT_HOST", message: "" });
      expect(ctx.media.setAudioMuted).toHaveBeenCalledWith(true);
      expect(ctx.emit).toHaveBeenCalledWith({ type: "unmuteRefused" });

      ctx.emit.mockClear();
      ctx.handle({ type: "error", code: "NOT_HOST", message: "" }); // already muted
      expect(ctx.emit).not.toHaveBeenCalled();
    });
  });

  describe("leaving the meeting", () => {
    it.each([
      [{ type: "removed", by: 1 }, "removed"],
      [{ type: "meeting_ended", by: 1 }, "ended"],
      [{ type: "error", code: "DUPLICATE_SESSION", message: "" }, "duplicate"],
      [{ type: "error", code: "REMOVED", message: "" }, "removed"],
      [{ type: "error", code: "UNAUTHORIZED", message: "" }, "failed"],
    ] as [ServerMessage, string][])("%o tears everything down → %s", (message, phase) => {
      const ctx = setup();
      ctx.handle(welcome(host, [guest]));
      ctx.handle(message);
      expect(ctx.client.close).toHaveBeenCalledOnce();
      expect(ctx.peers.closeAll).toHaveBeenCalledTimes(2);
      expect(ctx.media.release).toHaveBeenCalledOnce();
      expect(ctx.state().phase).toBe(phase);
    });

    it("ignores meeting_ended while this tab is already leaving", () => {
      const ctx = setup();
      ctx.handle(welcome(host, []));
      ctx.setLeaving(true);
      ctx.handle({ type: "meeting_ended", by: 1 });
      expect(ctx.client.close).not.toHaveBeenCalled();
      expect(ctx.state().phase).toBe("live");
    });

    it("ignores BAD_MESSAGE errors and pong", () => {
      const ctx = setup();
      ctx.handle({ type: "error", code: "BAD_MESSAGE", message: "" });
      ctx.handle({ type: "pong" });
      expect(ctx.dispatch).not.toHaveBeenCalled();
      expect(ctx.client.close).not.toHaveBeenCalled();
    });

    it("drops a pending 'muted' toast when removed", () => {
      const ctx = setup();
      ctx.handle({ type: "force_mute", by: 1 });
      ctx.handle({ type: "removed", by: 1 });
      vi.advanceTimersByTime(1000);
      expect(ctx.emit).not.toHaveBeenCalled();
    });
  });
});
