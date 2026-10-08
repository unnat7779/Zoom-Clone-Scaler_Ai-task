import type { WorkplaceAvatarColor } from "@/shared/lib/avatar";

/**
 * zoom-ui `zoom-avatar--sm` colour of an invitee, picked by its initial (03-schedule.md §5.7:
 * "T" → gray #555B62, "N" → orange #9D3B0F). Zoom's full table was not captured: this order puts
 * those two letters right by char code [D].
 */
const BY_INITIAL: readonly WorkplaceAvatarColor[] = ["green", "purple", "teal", "steel", "gray", "yellow", "orange", "red"];

export const inviteeAvatarColor = (text: string): WorkplaceAvatarColor =>
  BY_INITIAL[text.trim().toUpperCase().charCodeAt(0) % BY_INITIAL.length] ?? "gray";
