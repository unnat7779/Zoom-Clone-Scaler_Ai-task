/**
 * WebSocket protocol of `/ws/meetings/{number}?token=…` — mirror of
 * backend/app/realtime/protocol.py (PRD §9.2). Every message is JSON
 * `{"type": …}`. The realtime client itself belongs to features/meeting-room.
 */
import type { IsoDateTime, Participant } from "./api";

/* ---------------------------------------------------------- client → server */

export type HostCommand =
  | { command: "mute_all"; allow_unmute: boolean }
  | { command: "mute"; target: number }
  | { command: "remove"; target: number };

export type ClientMessage =
  | { type: "offer" | "answer"; to: number; /** plain SDP text */ sdp: string }
  | { type: "ice"; to: number; /** RTCIceCandidateInit; null = end of candidates */ candidate: RTCIceCandidateInit | null }
  | { type: "media_state"; audio_muted: boolean; video_on: boolean }
  | { type: "leave" }
  /** every 20 s; the server closes sockets silent for 45 s */
  | { type: "ping" }
  | ({ type: "host_command" } & HostCommand);

/* ---------------------------------------------------------- server → client */

export interface WelcomeMeeting {
  number: string;
  topic: string;
  host_name: string;
  invite_url: string;
  passcode: string | null;
  /** phone passcode for the info popover */
  numeric_passcode: string | null;
  start_time: IsoDateTime | null;
  duration_minutes: number;
}

export interface MeetingSettings {
  allow_unmute: boolean;
  mute_on_entry: boolean;
}

export type LeaveReason = "left" | "removed" | "disconnected";

export type RealtimeErrorCode = "UNAUTHORIZED" | "REMOVED" | "DUPLICATE_SESSION" | "NOT_HOST" | "BAD_MESSAGE";

export type ServerMessage =
  | {
      type: "welcome";
      self: Participant;
      /** everyone already connected, EXCLUDING `self` */
      participants: Participant[];
      meeting: WelcomeMeeting;
      settings: MeetingSettings;
    }
  /** a `participant_joined` for a known id means that participant reconnected */
  | { type: "participant_joined"; participant: Participant }
  | { type: "participant_updated"; participant: Participant }
  | { type: "participant_left"; participant_id: number; reason: LeaveReason }
  | { type: "offer" | "answer"; from: number; to: number; sdp: string }
  | { type: "ice"; from: number; to: number; candidate: RTCIceCandidateInit | null }
  | { type: "host_changed"; host_id: number; previous_host_id: number }
  /** `by` = host participant id; null when the meeting had already ended */
  | { type: "meeting_ended"; by: number | null }
  | { type: "force_mute"; by: number }
  | { type: "removed"; by: number }
  | ({ type: "settings_updated" } & MeetingSettings)
  | { type: "error"; code: RealtimeErrorCode; message: string }
  | { type: "pong" };

/** WebSocket close codes used by the server (`backend/app/realtime/hub.py`). */
export const WS_CLOSE = {
  /** an older socket of the same participant was replaced by a reconnect */
  replaced: 4000,
  unauthorized: 4401,
  removed: 4403,
  idleTimeout: 4408,
  duplicateSession: 4409,
} as const;
