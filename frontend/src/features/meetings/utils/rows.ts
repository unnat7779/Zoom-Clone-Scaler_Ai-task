import { formatMeetingNumber, formatTimeRange, meetingWindow, parseApiDate } from "@/shared/lib/format";
import type { InstanceListItem, MeetingListItem } from "@/shared/types/api";
import { upcomingKey } from "./grouping";

/** What a list item shows: topic → time → `Host: …` → `Meeting ID: …` (PRD §7.4.2). */
export interface MeetingRow {
  key: string;
  topic: string;
  time: string;
  host: string;
  number: string;
}

/** `10:00 AM - 10:40 AM` from a start and a duration. */
export const scheduledTimeRange = (startIso: string, durationMinutes: number): string => {
  const { start, end } = meetingWindow(startIso, durationMinutes);
  return formatTimeRange(start, end);
};

export const toUpcomingRow = (item: MeetingListItem): MeetingRow => ({
  key: upcomingKey(item),
  topic: item.topic,
  time: scheduledTimeRange(item.start_time, item.duration_minutes),
  host: item.host_name,
  number: formatMeetingNumber(item.meeting_number),
});

/** Previous rows show the actual start–end of the instance. */
export const toPreviousRow = (item: InstanceListItem): MeetingRow => ({
  key: item.uuid,
  topic: item.topic,
  time: formatTimeRange(parseApiDate(item.started_at), parseApiDate(item.ended_at)),
  host: item.host_name,
  number: formatMeetingNumber(item.meeting_number),
});
