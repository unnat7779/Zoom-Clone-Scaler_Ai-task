/**
 * Server → client protocol handling (PRD §9.2): roster updates, WebRTC
 * signalling, host transfer and the host commands' effects on this client.
 */
import type { Dispatch } from "react";
import { logger, warnOnFailure } from "@/shared/lib/logger";
import type { RealtimeErrorCode, ServerMessage } from "@/shared/types/realtime";
import type { PeerManager } from "./peerManager";
import type { RoomAction, RoomPhase, RoomState } from "./roomReducer";
import type { SignalingClient } from "./signalingClient";

/** Things the UI announces with a room toast. */
export type RoomEvent =
  | { type: "hostNow" }
  | { type: "hostIs"; name: string }
  | { type: "forceMuted"; all: boolean }
  | { type: "unmuteRefused" }
  | { type: "reconnecting" }
  | { type: "reconnected" }
  /** End Meeting for All could not reach the server: the meeting goes on */
  | { type: "endFailed" };

export interface LocalMediaControls {
  isAudioMuted: () => boolean;
  setAudioMuted: (muted: boolean) => void;
  setVideoOn: (on: boolean) => void;
  release: () => void;
}

export interface MessageContext {
  dispatch: Dispatch<RoomAction>;
  peers: PeerManager;
  client: SignalingClient;
  /** latest committed room state */
  state: () => RoomState;
  /** true once this tab started leaving / ending on its own */
  isLeaving: () => boolean;
  media: LocalMediaControls;
  emit: (event: RoomEvent) => void;
}

/** mute_all sends `force_mute` then `settings_updated`; wait briefly to tell the two toasts apart. */
const MUTE_ALL_WINDOW_MS = 250;

export interface MessageHandler {
  handle: (message: ServerMessage) => void;
  /** clears pending timers (the room unmounted) */
  dispose: () => void;
}

export function createMessageHandler(ctx: MessageContext): MessageHandler {
  let welcomed = false;
  let forceMuteTimer: ReturnType<typeof setTimeout> | null = null;

  const clearForceMuteTimer = () => {
    if (forceMuteTimer) clearTimeout(forceMuteTimer);
    forceMuteTimer = null;
  };

  const finish = (phase: RoomPhase) => {
    clearForceMuteTimer();
    ctx.client.close();
    ctx.peers.closeAll();
    ctx.media.release();
    ctx.dispatch({ type: "phase", phase });
  };

  const onError = (code: RealtimeErrorCode, text: string) => {
    if (code === "DUPLICATE_SESSION") finish("duplicate");
    else if (code === "REMOVED") finish("removed");
    else if (code === "UNAUTHORIZED") finish("failed");
    else if (code === "NOT_HOST" && !ctx.media.isAudioMuted()) {
      ctx.media.setAudioMuted(true);
      ctx.emit({ type: "unmuteRefused" });
    } else logger.warn(`signalling: server error ${code}`, text);
  };

  const nameOf = (id: number) => ctx.state().participants.find((item) => item.id === id)?.display_name;

  const handle = (message: ServerMessage) => {
    switch (message.type) {
      case "welcome":
        ctx.peers.closeAll();
        ctx.dispatch({ type: "welcome", self: message.self, participants: message.participants, meeting: message.meeting, settings: message.settings });
        ctx.media.setAudioMuted(message.self.audio_muted);
        ctx.media.setVideoOn(message.self.video_on);
        for (const participant of message.participants) {
          void ctx.peers.connectTo(participant.id).catch(warnOnFailure(`webrtc: offer to participant ${participant.id} failed`));
        }
        if (welcomed) ctx.emit({ type: "reconnected" });
        else if (message.self.role === "host") ctx.emit({ type: "hostNow" });
        welcomed = true;
        return;
      case "participant_joined":
        // a known id reconnected: it will send fresh offers
        ctx.peers.closePeer(message.participant.id);
        ctx.dispatch({ type: "upsert", participant: message.participant });
        return;
      case "participant_updated":
        ctx.dispatch({ type: "upsert", participant: message.participant });
        return;
      case "participant_left":
        ctx.peers.closePeer(message.participant_id);
        ctx.dispatch({ type: "remove", participantId: message.participant_id });
        return;
      case "offer":
        void ctx.peers.handleOffer(message.from, message.sdp).catch(warnOnFailure(`webrtc: answering participant ${message.from} failed`));
        return;
      case "answer":
        void ctx.peers.handleAnswer(message.from, message.sdp).catch(warnOnFailure(`webrtc: answer of participant ${message.from} rejected`));
        return;
      case "ice":
        void ctx.peers.handleIce(message.from, message.candidate).catch(warnOnFailure(`webrtc: ICE candidate of ${message.from} rejected`));
        return;
      case "host_changed": {
        ctx.dispatch({ type: "hostChanged", hostId: message.host_id, previousHostId: message.previous_host_id });
        const name = nameOf(message.host_id);
        if (message.host_id === ctx.state().selfId) ctx.emit({ type: "hostNow" });
        else if (name) ctx.emit({ type: "hostIs", name });
        return;
      }
      case "settings_updated":
        ctx.dispatch({ type: "settings", settings: { allow_unmute: message.allow_unmute, mute_on_entry: message.mute_on_entry } });
        if (forceMuteTimer) {
          clearForceMuteTimer();
          ctx.emit({ type: "forceMuted", all: true });
        }
        return;
      case "force_mute":
        ctx.media.setAudioMuted(true);
        clearForceMuteTimer();
        forceMuteTimer = setTimeout(() => {
          forceMuteTimer = null;
          ctx.emit({ type: "forceMuted", all: false });
        }, MUTE_ALL_WINDOW_MS);
        return;
      case "removed":
        finish("removed");
        return;
      case "meeting_ended":
        if (!ctx.isLeaving()) finish("ended");
        return;
      case "error":
        onError(message.code, message.message);
        return;
      case "pong":
        return;
    }
  };

  return { handle, dispose: clearForceMuteTimer };
}
