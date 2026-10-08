import { meetingRefOf, startHref } from "@/features/meetings";
import { routes } from "@/shared/lib/routes";
import type { MeetingListItem } from "@/shared/types/api";

/**
 * Card action: Start (host path, `?id=` for calendar entries on the PMI number) or Join when
 * another browser already hosts the live meeting (PRD §7.1.8).
 */
export const cardActionHref = (item: MeetingListItem, action: "Start" | "Join"): string =>
  action === "Join" ? routes.preJoin(item.meeting_number, { fromPWA: true }) : startHref(meetingRefOf(item));
