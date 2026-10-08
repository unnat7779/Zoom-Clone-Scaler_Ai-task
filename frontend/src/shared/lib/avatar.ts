/**
 * Avatar helpers (PRD §5.8.14). Colours are token keys, never hex values:
 * the Avatar component maps a key to `var(--avatar-<key>)` / `var(--mc-avatar-<n>)`.
 */

/** Workplace / portal palette, in Zoom's order. The current user is always "purple". */
export const WORKPLACE_AVATAR_COLORS = ["green", "purple", "teal", "steel", "gray", "orange", "yellow", "red"] as const;
export type WorkplaceAvatarColor = (typeof WORKPLACE_AVATAR_COLORS)[number];

/** Meeting-client palette: 1 = self (#8E44AD), 2 = guest (#D35400), 3–8 others. */
export const MEETING_AVATAR_COLORS = ["mc1", "mc2", "mc3", "mc4", "mc5", "mc6", "mc7", "mc8"] as const;
export type MeetingAvatarColor = (typeof MEETING_AVATAR_COLORS)[number];

export type AvatarColor = WorkplaceAvatarColor | MeetingAvatarColor;

/** "Alex Morgan" → "AM", "Chrome Guest" → "CG", "priya" → "P". */
export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

/** Stable non-negative 32-bit hash (djb2). */
export function hashSeed(seed: string | number): number {
  let hash = 5381;
  for (const char of String(seed)) hash = ((hash << 5) + hash + char.charCodeAt(0)) | 0;
  return Math.abs(hash);
}

export const pickWorkplaceAvatarColor = (seed: string | number): WorkplaceAvatarColor =>
  WORKPLACE_AVATAR_COLORS[hashSeed(seed) % WORKPLACE_AVATAR_COLORS.length] ?? "purple";

export const pickMeetingAvatarColor = (seed: string | number): MeetingAvatarColor =>
  MEETING_AVATAR_COLORS[hashSeed(seed) % MEETING_AVATAR_COLORS.length] ?? "mc1";

const WORKPLACE_HEX: Record<string, WorkplaceAvatarColor> = {
  "#247F40": "green",
  "#9053C2": "purple",
  "#007C7C": "teal",
  "#2974A8": "steel",
  "#555B62": "gray",
  "#9D3B0F": "orange",
  "#B36200": "yellow",
  "#DA1639": "red",
};

/** Maps the API's `avatar_color` hex (e.g. `User.avatar_color`) to a palette key. */
export const avatarColorFromHex = (hex: string | null | undefined): WorkplaceAvatarColor =>
  (hex && WORKPLACE_HEX[hex.toUpperCase()]) || "purple";
