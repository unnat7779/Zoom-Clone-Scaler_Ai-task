/**
 * Request bodies of the REST API — mirror of backend/app/schemas/{schedule,entry,meeting}.py.
 * Re-exported by ./api.ts; import them from "@/shared/types/api".
 */

/** `POST /api/meetings`. Omitted optional fields take the backend defaults shown. */
export interface ScheduleRequest {
  topic: string;
  description?: string | null;
  /** wall-clock start in `timezone`, e.g. "2026-10-08T11:00" (no offset) */
  start_local: string;
  timezone: string;
  duration_minutes: number;
  is_recurring?: boolean;
  use_pmi?: boolean;
  /** omitted → random passcode; null → no passcode */
  passcode?: string | null;
  waiting_room?: boolean;
  /** default true */
  join_before_host?: boolean;
  mute_upon_entry?: boolean;
  /** default true */
  host_video_on?: boolean;
  /** default true */
  participant_video_on?: boolean;
  invitees?: string[];
}

/** `PATCH /api/meetings/{number}` — partial; `use_pmi` cannot change. */
export type UpdateMeetingRequest = Partial<Omit<ScheduleRequest, "use_pmi">>;

/** `PATCH /api/meetings/pmi` */
export interface UpdatePmiRequest {
  passcode?: string | null;
  waiting_room?: boolean;
  join_before_host?: boolean;
  mute_upon_entry?: boolean;
  host_video_on?: boolean;
  participant_video_on?: boolean;
}

export interface InstantMeetingRequest {
  use_pmi?: boolean;
}

export interface StartMeetingRequest {
  client_id: string;
  display_name: string;
}

export interface JoinMeetingRequest {
  client_id: string;
  display_name: string;
  /** invite token from `?pwd=` */
  pwd?: string | null;
  passcode?: string | null;
  /** default true */
  audio_muted?: boolean;
  /** default false */
  video_on?: boolean;
}

export interface EndMeetingRequest {
  token: string;
}
