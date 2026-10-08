import { format } from "date-fns";
import { parseApiDate } from "@/shared/lib/format";
import type { Meeting, ScheduleRequest, UpdateMeetingRequest, UpdatePmiRequest } from "@/shared/types/api";
import type { ScheduleFormValues } from "../types";
import { randomPasscode } from "./passcode";
import { DEFAULT_DURATION } from "./plan";
import { from24Hour, nextHalfHour, to24Hour } from "./time";
import { instantToWallClock, wallClockToInstant } from "./zonedTime";

const COMMON_DEFAULTS = {
  recurring: false,
  meetingIdMode: "auto",
  waitingRoom: false,
  hostVideo: "on",
  participantVideo: "on",
  joinBeforeHost: true,
  muteUponEntry: false,
} as const satisfies Partial<ScheduleFormValues>;

/** New meeting: "My Meeting", today at the next half-hour, plan duration, random passcode (PRD §7.6.3). */
export function createFormValues(now: Date, timezone: string): ScheduleFormValues {
  const start = nextHalfHour(now);
  return {
    ...COMMON_DEFAULTS,
    customTimes: [],
    invitees: [],
    topic: "My Meeting",
    description: "",
    descriptionOpen: false,
    date: format(start, "yyyy-MM-dd"),
    ...from24Hour(start.getHours(), start.getMinutes()),
    durationHours: DEFAULT_DURATION.hours,
    durationMinutes: DEFAULT_DURATION.minutes,
    timezone,
    passcodeEnabled: true,
    passcode: randomPasscode(),
  };
}

/** Edit: every field prefilled from the stored meeting, shown in the meeting's own time zone. */
export function editFormValues(meeting: Meeting): ScheduleFormValues {
  const clock = instantToWallClock(parseApiDate(meeting.start_time ?? new Date().toISOString()), meeting.timezone);
  const { time, meridiem } = from24Hour(clock.hours, clock.minutes);
  return {
    ...COMMON_DEFAULTS,
    topic: meeting.topic,
    description: meeting.description ?? "",
    descriptionOpen: Boolean(meeting.description),
    date: clock.date,
    time,
    meridiem,
    customTimes: [time],
    durationHours: String(Math.floor(meeting.duration_minutes / 60)),
    durationMinutes: String(meeting.duration_minutes % 60),
    timezone: meeting.timezone,
    recurring: meeting.is_recurring,
    invitees: meeting.invitees,
    meetingIdMode: meeting.uses_pmi ? "pmi" : "auto",
    passcodeEnabled: meeting.passcode !== null,
    passcode: meeting.passcode ?? randomPasscode(),
    waitingRoom: meeting.waiting_room,
    hostVideo: meeting.host_video_on ? "on" : "off",
    participantVideo: meeting.participant_video_on ? "on" : "off",
    joinBeforeHost: meeting.join_before_host,
    muteUponEntry: meeting.mute_upon_entry,
  };
}

/** `2026-10-08T11:00` (wall clock in `timezone`). */
export const startLocal = (values: ScheduleFormValues): string => `${values.date}T${to24Hour(values.time, values.meridiem)}`;

/** The start as an instant, for the "already passed" check. */
export const startInstant = (values: ScheduleFormValues): Date =>
  wallClockToInstant(values.date, to24Hour(values.time, values.meridiem), values.timezone);

/** The settings the PMI form edits (also part of every scheduled meeting). */
export const toPmiRequest = (values: ScheduleFormValues): Required<UpdatePmiRequest> => ({
  passcode: values.passcodeEnabled ? values.passcode : null,
  waiting_room: values.waitingRoom,
  join_before_host: values.joinBeforeHost,
  mute_upon_entry: values.muteUponEntry,
  host_video_on: values.hostVideo === "on",
  participant_video_on: values.participantVideo === "on",
});

/** Every editable field of a scheduled meeting (the meeting number never changes). */
const meetingFields = (values: ScheduleFormValues): Omit<ScheduleRequest, "use_pmi"> => ({
  ...toPmiRequest(values),
  topic: values.topic.trim(),
  description: values.descriptionOpen && values.description.trim() ? values.description : null,
  start_local: startLocal(values),
  timezone: values.timezone,
  duration_minutes: Number(values.durationHours) * 60 + Number(values.durationMinutes),
  is_recurring: values.recurring,
  invitees: values.invitees,
});

/** PATCH body: every editable field (the API diffs the invitee list itself). */
export const toUpdateRequest = (values: ScheduleFormValues): UpdateMeetingRequest => meetingFields(values);

/** POST body (`use_pmi` from the Meeting ID radios). */
export const toScheduleRequest = (values: ScheduleFormValues): ScheduleRequest => ({
  ...meetingFields(values),
  use_pmi: values.meetingIdMode === "pmi",
});
