/** Wall-clock ↔ instant conversions in an IANA zone (no date-fns-tz dependency). */

export interface WallClock {
  /** `YYYY-MM-DD` */
  date: string;
  hours: number;
  minutes: number;
}

function zoneParts(instant: Date, zone: string): Record<string, number> {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(instant);
  return Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, Number(part.value)]));
}

/** Offset of `zone` from UTC at `instant`, in ms. */
function zoneOffset(instant: Date, zone: string): number {
  const p = zoneParts(instant, zone);
  const asUtc = Date.UTC(p.year ?? 1970, (p.month ?? 1) - 1, p.day ?? 1, p.hour ?? 0, p.minute ?? 0, p.second ?? 0);
  return asUtc - Math.floor(instant.getTime() / 1000) * 1000;
}

const DAY_MS = 86_400_000;

/**
 * The instant at which `zone` shows `date` + `HH:mm`, resolved like the backend's
 * `datetime.replace(tzinfo=ZoneInfo(zone))` (fold=0): an ambiguous time (fall back) takes its first
 * occurrence, and a time inside a spring-forward gap uses the offset from before the jump, so
 * 02:30 on a 02:00 to 03:00 day becomes 03:30 in the new offset.
 */
export function wallClockToInstant(date: string, time24: string, zone: string): Date {
  const [year, month, day] = date.split("-").map(Number);
  const [hours, minutes] = time24.split(":").map(Number);
  const wall = Date.UTC(year ?? 1970, (month ?? 1) - 1, day ?? 1, hours ?? 0, minutes ?? 0);
  const before = zoneOffset(new Date(wall - DAY_MS), zone);
  const after = zoneOffset(new Date(wall + DAY_MS), zone);
  const early = wall - before;
  const late = wall - after;
  const earlyValid = zoneOffset(new Date(early), zone) === before;
  const lateValid = zoneOffset(new Date(late), zone) === after;
  // both valid: ambiguous, first occurrence; neither: inside the gap, pre-transition offset
  return new Date(earlyValid || !lateValid ? early : late);
}

/** What a clock in `zone` shows at `instant`. */
export function instantToWallClock(instant: Date, zone: string): WallClock {
  const p = zoneParts(instant, zone);
  const pad = (value: number | undefined) => String(value ?? 0).padStart(2, "0");
  return { date: `${p.year}-${pad(p.month)}-${pad(p.day)}`, hours: p.hour ?? 0, minutes: p.minute ?? 0 };
}
