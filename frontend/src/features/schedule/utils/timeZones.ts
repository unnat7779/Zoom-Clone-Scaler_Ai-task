import { TIME_ZONES } from "./timeZoneData";

export interface TimeZoneOption {
  value: string;
  /** `(GMT+5:30) India` */
  label: string;
}

/** `GMT+05:30` / `GMT-7` / `GMT` → `(GMT+5:30)` / `(GMT-7:00)` / `(GMT+0:00)` (hour not zero-padded). */
function gmtPrefix(zone: string, at: Date): string {
  let name = "GMT";
  try {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: zone, timeZoneName: "longOffset" }).formatToParts(at);
    name = parts.find((part) => part.type === "timeZoneName")?.value ?? "GMT";
  } catch {
    /* an id the browser does not know: show it as UTC */
  }
  const match = /GMT([+-])(\d{1,2})(?::(\d{2}))?/.exec(name);
  if (!match) return "(GMT+0:00)";
  return `(GMT${match[1]}${Number(match[2])}:${match[3] ?? "00"})`;
}

/** The 149 options with the offset that applies at `at` (Los Angeles is `(GMT-7:00)` in October). */
export const timeZoneOptions = (at: Date): TimeZoneOption[] =>
  TIME_ZONES.map(([value, label]) => ({ value, label: `${gmtPrefix(value, at)} ${label}` }));

/**
 * Default zone [D]: the browser's IANA zone when Zoom lists it, else the first
 * entry with the same current offset, else the user's stored zone.
 */
export function defaultTimeZone(browserZone: string, fallback: string, at: Date): string {
  if (TIME_ZONES.some(([value]) => value === browserZone)) return browserZone;
  const offset = gmtPrefix(browserZone, at);
  return TIME_ZONES.find(([value]) => gmtPrefix(value, at) === offset)?.[0] ?? fallback;
}
