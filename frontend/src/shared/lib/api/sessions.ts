import type {
  EndMeetingRequest,
  InstanceDetail,
  JoinMeetingRequest,
  MeetingSession,
  StartMeetingRequest,
} from "@/shared/types/api";
import { env } from "../env";
import { apiFetch } from "./client";

const path = (number: string, action: "start" | "join" | "end") =>
  `/meetings/${encodeURIComponent(number)}/${action}`;

/**
 * Host path: opens an instance if none; attendee role if another browser already hosts it.
 * `id` selects a `uses_pmi` calendar entry. Errors: 403 REMOVED, 404, 409 MEETING_FULL.
 */
export const startMeeting = (number: string, body: StartMeetingRequest, id?: number) =>
  apiFetch<MeetingSession>(path(number, "start"), { method: "POST", body, query: { id } });

/**
 * Attendee path. Errors: 404 MEETING_NOT_FOUND, 403 WRONG_PASSCODE / REMOVED,
 * 409 MEETING_NOT_STARTED / MEETING_FULL.
 */
export const joinMeeting = (number: string, body: JoinMeetingRequest) =>
  apiFetch<MeetingSession>(path(number, "join"), { method: "POST", body });

/** Host only (401 UNAUTHORIZED, 403 NOT_HOST). */
export const endMeeting = (number: string, body: EndMeetingRequest) =>
  apiFetch<void>(path(number, "end"), { method: "POST", body });

/** WebSocket URL for signalling: `${NEXT_PUBLIC_WS_URL}/ws/meetings/{number}?token=…`. */
export const meetingSocketUrl = (number: string, token: string) =>
  `${env.wsUrl}/ws/meetings/${encodeURIComponent(number)}?token=${encodeURIComponent(token)}`;

/** `GET /api/instances/{uuid}` — Meetings → Previous detail (404 INSTANCE_NOT_FOUND). */
export const getInstance = (uuid: string, signal?: AbortSignal) =>
  apiFetch<InstanceDetail>(`/instances/${encodeURIComponent(uuid)}`, { signal });
