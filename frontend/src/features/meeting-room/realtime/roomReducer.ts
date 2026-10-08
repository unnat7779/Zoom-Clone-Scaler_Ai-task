/** Room state driven by the signalling channel and the peer connections. */
import type { Participant } from "@/shared/types/api";
import type { MeetingSettings, WelcomeMeeting } from "@/shared/types/realtime";

export type RoomPhase =
  /** waiting for `welcome` */
  | "connecting"
  | "live"
  | "reconnecting"
  /** the host ended the meeting (dialog) */
  | "ended"
  | "removed"
  /** this browser joined from another tab */
  | "duplicate"
  /** we left or ended it ourselves */
  | "left"
  /** the connection could not be (re)established */
  | "failed";

const TERMINAL: ReadonlySet<RoomPhase> = new Set(["ended", "removed", "duplicate", "left", "failed"]);
export const isTerminalPhase = (phase: RoomPhase) => TERMINAL.has(phase);

export interface RoomState {
  phase: RoomPhase;
  selfId: number | null;
  /** everyone in the meeting, self included, in join order */
  participants: Participant[];
  meeting: WelcomeMeeting | null;
  settings: MeetingSettings;
  /** remote media per participant id */
  streams: Record<number, MediaStream>;
  connections: Record<number, RTCPeerConnectionState>;
}

export type RoomAction =
  | { type: "welcome"; self: Participant; participants: Participant[]; meeting: WelcomeMeeting; settings: MeetingSettings }
  | { type: "upsert"; participant: Participant }
  | { type: "remove"; participantId: number }
  | { type: "hostChanged"; hostId: number; previousHostId: number }
  | { type: "settings"; settings: MeetingSettings }
  | { type: "stream"; participantId: number; stream: MediaStream }
  | { type: "connection"; participantId: number; state: RTCPeerConnectionState }
  | { type: "phase"; phase: RoomPhase };

export const initialRoomState: RoomState = {
  phase: "connecting",
  selfId: null,
  participants: [],
  meeting: null,
  settings: { allow_unmute: true, mute_on_entry: false },
  streams: {},
  connections: {},
};

/** "Am I the host": the roster once `welcome` arrived, before that the role of the start / join response. */
export function selectIsHost(state: RoomState, entryRole: Participant["role"]): boolean {
  const self = state.participants.find((participant) => participant.id === state.selfId);
  return (self?.role ?? entryRole) === "host";
}

const byJoinTime =(a: Participant, b: Participant) => a.joined_at.localeCompare(b.joined_at) || a.id - b.id;

function upsert(list: Participant[], participant: Participant): Participant[] {
  const others = list.filter((item) => item.id !== participant.id);
  return [...others, participant].sort(byJoinTime);
}

function omit<T>(record: Record<number, T>, id: number): Record<number, T> {
  const rest = { ...record };
  delete rest[id];
  return rest;
}

export function roomReducer(state: RoomState, action: RoomAction): RoomState {
  switch (action.type) {
    case "welcome":
      return {
        ...state,
        phase: isTerminalPhase(state.phase) ? state.phase : "live",
        selfId: action.self.id,
        participants: [action.self, ...action.participants].sort(byJoinTime),
        meeting: action.meeting,
        settings: action.settings,
        streams: {},
        connections: {},
      };
    case "upsert":
      return { ...state, participants: upsert(state.participants, action.participant) };
    case "remove":
      return {
        ...state,
        participants: state.participants.filter((item) => item.id !== action.participantId),
        streams: omit(state.streams, action.participantId),
        connections: omit(state.connections, action.participantId),
      };
    case "hostChanged":
      return {
        ...state,
        participants: state.participants.map((item) =>
          item.id === action.hostId
            ? { ...item, role: "host" }
            : item.id === action.previousHostId
              ? { ...item, role: "attendee" }
              : item,
        ),
      };
    case "settings":
      return { ...state, settings: action.settings };
    case "stream":
      return { ...state, streams: { ...state.streams, [action.participantId]: action.stream } };
    case "connection":
      return { ...state, connections: { ...state.connections, [action.participantId]: action.state } };
    case "phase":
      return isTerminalPhase(state.phase) ? state : { ...state, phase: action.phase };
  }
}
