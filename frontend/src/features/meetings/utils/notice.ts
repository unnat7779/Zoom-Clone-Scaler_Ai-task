/** Meetings-tab detail time notice (PRD §7.4.4, Zoom's JS, recomputed every second). */

const MINUTE = 60_000;

export interface TimeNotice {
  text: string;
  /** "now" renders red (#FD4C4C); "info" blue (#0E72ED) */
  tone: "info" | "now";
}

export function getTimeNotice(start: Date, durationMinutes: number, isLive: boolean, now: Date): TimeNotice | null {
  if (isLive) return { text: "In Progress", tone: "info" };
  const untilStart = start.getTime() - now.getTime();
  if (untilStart > MINUTE && untilStart <= 30 * MINUTE) {
    const minutes = Math.floor(untilStart / MINUTE);
    return { text: minutes > 1 ? `Starts in ${minutes} minutes` : "Starts in 1 minute", tone: "info" };
  }
  if (untilStart > 0 && untilStart <= MINUTE) return { text: "Starts in 1 minute", tone: "info" };
  const end = start.getTime() + durationMinutes * MINUTE;
  if (untilStart <= 0 && now.getTime() <= end) return { text: "NOW", tone: "now" };
  return null;
}
