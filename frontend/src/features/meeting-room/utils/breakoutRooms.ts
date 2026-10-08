/**
 * "Create Breakout Rooms" window (spec 05 §13.5) — Static UI; only the hint under the
 * choices follows the inputs, as in Zoom ("0 participants per room" with the host alone).
 */
export const MIN_ROOMS = 1;
export const MAX_ROOMS = 50;

/** Keeps a typed / stepped room count inside 1–50 (anything unparsable → 1). */
export function clampRoomCount(value: number): number {
  if (!Number.isFinite(value)) return MIN_ROOMS;
  return Math.min(MAX_ROOMS, Math.max(MIN_ROOMS, Math.trunc(value)));
}

/**
 * Hint for `attendees` people (the host is not assigned) spread over `rooms` rooms [D wording
 * for uneven splits]: "2 participants per room", or "1-2 participants per room".
 */
export function participantsPerRoomLabel(attendees: number, rooms: number): string {
  const count = clampRoomCount(rooms);
  const low = Math.floor(Math.max(0, attendees) / count);
  const high = Math.ceil(Math.max(0, attendees) / count);
  return `${low === high ? low : `${low}-${high}`} participants per room`;
}
