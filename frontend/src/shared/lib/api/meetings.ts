import type {
  InstanceListItem,
  InstantMeetingRequest,
  InstantMeetingResponse,
  InvitationResponse,
  Meeting,
  MeetingListItem,
  MeetingValidation,
  ScheduleRequest,
  UpdateMeetingRequest,
  UpdatePmiRequest,
} from "@/shared/types/api";
import { apiFetch } from "./client";

/** `?id=` disambiguates calendar entries that run on the PMI number. */
export interface MeetingRef {
  number: string;
  id?: number;
}

const meetingPath = (number: string, suffix = "") => `/meetings/${encodeURIComponent(number)}${suffix}`;

/** `GET /api/meetings?view=upcoming[&from=ISO]` — Meetings tab Upcoming list (from = start of local today). */
export const listUpcomingMeetings = (from?: string, signal?: AbortSignal) =>
  apiFetch<MeetingListItem[]>("/meetings", { query: { view: "upcoming", from }, signal });

/** `GET /api/meetings?view=day&date=YYYY-MM-DD[&tz=IANA]` — Home widget day. */
export const listDayMeetings = (date: string, tz?: string, signal?: AbortSignal) =>
  apiFetch<MeetingListItem[]>("/meetings", { query: { view: "day", date, tz }, signal });

/** `GET /api/meetings?view=previous&limit=50` — ended instances (Recent / Previous). */
export const listPreviousMeetings = (limit = 50, signal?: AbortSignal) =>
  apiFetch<InstanceListItem[]>("/meetings", { query: { view: "previous", limit }, signal });

export const getPmiMeeting = (signal?: AbortSignal) => apiFetch<Meeting>("/meetings/pmi", { signal });

export const updatePmiMeeting = (body: UpdatePmiRequest) =>
  apiFetch<Meeting>("/meetings/pmi", { method: "PATCH", body });

/** Creates the meeting (unless PMI) and a live instance. */
export const createInstantMeeting = (body: InstantMeetingRequest = {}) =>
  apiFetch<InstantMeetingResponse>("/meetings/instant", { method: "POST", body });

export const scheduleMeeting = (body: ScheduleRequest) =>
  apiFetch<Meeting>("/meetings", { method: "POST", body });

/** 404 `MEETING_NOT_FOUND` for unknown or deleted meetings. */
export const getMeeting = ({ number, id }: MeetingRef, signal?: AbortSignal) =>
  apiFetch<Meeting>(meetingPath(number), { query: { id }, signal });

/** 400 `NOT_SCHEDULED` (instant/PMI rows), 409 `MEETING_LIVE` while the meeting runs, 422. */
export const updateMeeting = ({ number, id }: MeetingRef, body: UpdateMeetingRequest) =>
  apiFetch<Meeting>(meetingPath(number), { method: "PATCH", query: { id }, body });

/** Soft delete. 409 `MEETING_LIVE`, 400 `PMI_NOT_DELETABLE`. */
export const deleteMeeting = ({ number, id }: MeetingRef) =>
  apiFetch<void>(meetingPath(number), { method: "DELETE", query: { id } });

export const getMeetingInvitation = ({ number, id }: MeetingRef, signal?: AbortSignal) =>
  apiFetch<InvitationResponse>(meetingPath(number, "/invitation"), { query: { id }, signal });

/** Pre-join existence / passcode check; never 404 (`exists: false`), never leaks the passcode. */
export const validateMeeting = (number: string, pwd?: string | null, signal?: AbortSignal) =>
  apiFetch<MeetingValidation>(meetingPath(number, "/validate"), { query: { pwd }, signal });
