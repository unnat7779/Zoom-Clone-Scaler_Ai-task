import { MEETING_AVATAR_COLORS, type MeetingAvatarColor } from "@/shared/lib/avatar";
import type { Participant } from "@/shared/types/api";

/**
 * Participants-panel label appended without a space (PRD §8.8 [M]):
 * "Alex Morgan(Host, me)", "Chrome Guest(Guest)", "Chrome Guest(Me)", "Alex Morgan(Host)".
 */
export function participantLabel(participant: Participant, isSelf: boolean): string {
  const host = participant.role === "host";
  if (isSelf) return host ? "(Host, me)" : "(Me)";
  if (host) return "(Host)";
  return participant.is_guest ? "(Guest)" : "";
}

/**
 * Meeting-client avatar colour (PRD §5.8.14): the signed-in user is #8E44AD and
 * guests continue the palette in join order (first guest #D35400), the same on every screen.
 */
export function avatarColor(participant: Participant, roster: Participant[]): MeetingAvatarColor {
  if (!participant.is_guest) return "mc1";
  const guests = roster.filter((item) => item.is_guest);
  const index = Math.max(0, guests.findIndex((item) => item.id === participant.id));
  return MEETING_AVATAR_COLORS[1 + (index % (MEETING_AVATAR_COLORS.length - 1))] ?? "mc2";
}

/** Panel order (PRD §8.8): me first, then the host, then everyone else by join time. */
export function panelOrder(roster: Participant[], selfId: number | null): Participant[] {
  const self = roster.filter((item) => item.id === selfId);
  const host = roster.filter((item) => item.id !== selfId && item.role === "host");
  const others = roster.filter((item) => item.id !== selfId && item.role !== "host");
  return [...self, ...host, ...others];
}
