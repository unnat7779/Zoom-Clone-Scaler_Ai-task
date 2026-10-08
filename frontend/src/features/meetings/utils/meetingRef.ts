import type { MeetingRef } from "@/shared/lib/api";
import { routes } from "@/shared/lib/routes";

/** What identifies a meeting definition: list rows and `Meeting` carry `id`, ended instances `meeting_id`. */
type MeetingIdentity = { meeting_number: string; uses_pmi: boolean } & ({ id: number } | { meeting_id: number });

/**
 * API / route reference of a meeting: `?id=` only for calendar entries that run on the PMI
 * number (`uses_pmi`, PRD §7.8, §10.4); every other number is unique on its own.
 */
export function meetingRefOf(meeting: MeetingIdentity): MeetingRef {
  const id = "id" in meeting ? meeting.id : meeting.meeting_id;
  return { number: meeting.meeting_number, id: meeting.uses_pmi ? id : undefined };
}

/** Host path inside the shell: `/wc/{n}/start?fromPWA=1[&id=]` (PRD §7.4.5, §7.8.3). */
export const startHref = (ref: MeetingRef): string => routes.start(ref.number, { fromPWA: true, id: ref.id });
