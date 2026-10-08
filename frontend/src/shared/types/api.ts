/**
 * TypeScript mirror of the FastAPI/Pydantic schemas in backend/app/schemas
 * (see backend/README.md). JSON is snake_case on purpose: keep these names
 * identical to the backend. Timestamps are UTC ISO-8601 strings; parse them
 * with `parseApiDate` (shared/lib/format).
 */

export type IsoDateTime = string;

export type MeetingType = "instant" | "scheduled" | "pmi";
export type ParticipantRole = "host" | "attendee";
export type ParticipantStatus = "in_meeting" | "left" | "removed";

/* ---------------------------------------------------------------- users */

/** `GET /api/me`, `GET /api/users` */
export interface User {
  id: number;
  display_name: string;
  email: string;
  pmi: string;
  pmi_formatted: string;
  timezone: string;
  /** hex, e.g. "#9053C2" — map with `avatarColorFromHex` */
  avatar_color: string;
  initials: string;
}

/* ------------------------------------------------------------- meetings */

/** Full meeting definition (detail page, edit form, PMI). */
export interface Meeting {
  id: number;
  meeting_number: string;
  type: MeetingType;
  uses_pmi: boolean;
  topic: string;
  description: string | null;
  /** UTC; null for instant and PMI meetings */
  start_time: IsoDateTime | null;
  duration_minutes: number;
  timezone: string;
  /** scheduled only, e.g. "Oct 8, 2026 11:00 AM India" */
  time_label: string | null;
  passcode: string | null;
  invite_url: string;
  waiting_room: boolean;
  join_before_host: boolean;
  mute_upon_entry: boolean;
  host_video_on: boolean;
  participant_video_on: boolean;
  is_recurring: boolean;
  host_id: number;
  host_name: string;
  is_live: boolean;
  invitees: string[];
  created_at: IsoDateTime;
  updated_at: IsoDateTime;
}

/** Row of Meetings → Upcoming and of the Home day view. Never carries the passcode. */
export interface MeetingListItem {
  id: number;
  meeting_number: string;
  type: MeetingType;
  uses_pmi: boolean;
  topic: string;
  /** scheduled start (UTC); for a live instant/PMI meeting, when it started */
  start_time: IsoDateTime;
  duration_minutes: number;
  timezone: string;
  host_name: string;
  is_live: boolean;
  /** at least one instance ever ran (Home "joined" card style) */
  has_instance: boolean;
  /** a live instance currently has a host in it */
  has_host: boolean;
}

/** Ended instance: Meetings → Previous and Home → Recent meetings. */
export interface InstanceListItem {
  uuid: string;
  meeting_id: number;
  meeting_number: string;
  type: MeetingType;
  uses_pmi: boolean;
  topic: string;
  host_name: string;
  started_at: IsoDateTime;
  ended_at: IsoDateTime;
  /** ended_at − started_at, rounded up, at least 1 */
  duration_minutes: number;
  /** distinct browsers (client ids) that joined */
  participant_count: number;
  /** false once the meeting definition is deleted */
  meeting_exists: boolean;
}

/** A participant inside a live meeting (REST entry responses and WebSocket). */
export interface Participant {
  id: number;
  display_name: string;
  role: ParticipantRole;
  is_guest: boolean;
  audio_muted: boolean;
  video_on: boolean;
  joined_at: IsoDateTime;
}

/** A participant of a past meeting (Meetings → Previous detail). */
export interface ParticipantRecord {
  id: number;
  display_name: string;
  role: ParticipantRole;
  is_guest: boolean;
  status: ParticipantStatus;
  joined_at: IsoDateTime;
  left_at: IsoDateTime | null;
}

/** `GET /api/instances/{uuid}` */
export interface InstanceDetail {
  instance: InstanceListItem;
  /** null when the meeting has been deleted */
  meeting: Meeting | null;
  participants: ParticipantRecord[];
}

export type * from "./apiRequests";

/* ------------------------------------------------------------ responses */

/** `POST /api/meetings/instant` (the meeting already has a live instance). */
export interface InstantMeetingResponse {
  meeting: Meeting;
  invite_url: string;
  start_url: string;
}

/** `POST /api/meetings/{number}/start|join` */
export interface MeetingSession {
  participant: Participant;
  /** signed participant token (12 h) for `/ws/meetings/{number}?token=` and `end` */
  token: string;
  instance_id: number;
}

/** `GET /api/meetings/{number}/validate` — never 404 (`exists: false`), never leaks the passcode. */
export interface MeetingValidation {
  exists: boolean;
  topic: string | null;
  is_live: boolean;
  has_host: boolean;
  requires_passcode: boolean;
  /** true when no passcode is needed or `pwd` is a valid invite token */
  passcode_ok: boolean;
  join_before_host: boolean;
  start_time: IsoDateTime | null;
  /** waiting for the host: "This is a recurring meeting" instead of the start time */
  is_recurring: boolean;
  duration_minutes: number | null;
  participant_video_on: boolean;
  /** joiners start muted (meeting option or the host's Mute All) */
  mute_upon_entry: boolean;
}

export interface InvitationResponse {
  /** CRLF line endings, ends with three CRLFs (PRD §10.5) */
  text: string;
}

export interface HealthResponse {
  ok: boolean;
}

/* --------------------------------------------------------------- errors */

export type ApiErrorCode =
  | "MEETING_NOT_FOUND"
  | "INSTANCE_NOT_FOUND"
  | "USER_NOT_FOUND"
  | "WRONG_PASSCODE"
  | "MEETING_NOT_STARTED"
  | "MEETING_FULL"
  | "MEETING_LIVE"
  | "NOT_SCHEDULED"
  | "PMI_NOT_DELETABLE"
  | "REMOVED"
  | "NOT_HOST"
  | "UNAUTHORIZED"
  | "VALIDATION_ERROR"
  /** 422: a scheduled start more than 5 minutes in the past */
  | "START_IN_PAST"
  | "INTERNAL_ERROR"
  /* client-side codes */
  | "NETWORK_ERROR"
  | "UNKNOWN_ERROR";

export interface ApiErrorBody {
  error: { code: ApiErrorCode; message: string };
}
