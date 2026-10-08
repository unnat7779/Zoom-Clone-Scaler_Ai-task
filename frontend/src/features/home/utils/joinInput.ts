/**
 * Join-modal input rules, ported from Zoom's PWA (PRD §7.2.4–7.2.5, 04-join.md §2.5–2.6).
 * Meeting IDs are 9–11 digits (progressively formatted, capped at 11); a Personal Link
 * Name is 5–40 characters of `[a-zA-Z0-9._-]` starting with a letter.
 */

const DIGITS = /^\d+$/;
const ALLOWED = /^[a-zA-Z0-9.\-_]+$/;
const MEETING_ID = /^\d{9,11}$/;
const LINK_NAME = /^[a-zA-Z][a-zA-Z0-9.\-_]{4,39}$/;
const DISALLOWED_CHARS = /[^a-zA-Z0-9.\-_]/g;
/** Zoom's own hosts (and subdomains) only, so `zoom.attacker.example` is not treated as an invite link. */
const ZOOM_HOST = /(^|\.)zoom(gov|dev)?\.(us|com)$/;
const MEETING_PATH = /^\/(j|s|w|my)\//;
const WC_PATTERNS = [
  /^\/wc\/join\/(\d{9,11})/,
  /^\/wc\/(\d{9,11})\/join/,
  /^\/wc\/start\/(\d{9,11})/,
  /^\/wc\/(\d{9,11})\/start/,
  /^\/wc\/my\/(.+)/,
];

const MAX_DIGITS = 11;
const MAX_LINK_NAME = 40;

export const stripSpaces = (value: string): string => value.replace(/\s/g, "");

/** 1–3 digits as is · 4–6 `123 45` · 7–10 `123 456 7890` · 11 `123 4567 8901`. */
export function formatProgressive(digits: string): string {
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  if (digits.length <= 10) return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`;
}

/** New field value for a change, or null when Zoom rejects the change (previous value kept). */
export function normalizeJoinInput(raw: string): string | null {
  const value = stripSpaces(raw);
  if (value === "") return "";
  if (DIGITS.test(value)) return formatProgressive(value.slice(0, MAX_DIGITS));
  if (ALLOWED.test(value)) return value.slice(0, MAX_LINK_NAME);
  return null;
}

/** Join is enabled for 9–11 digits or a valid Personal Link Name. */
export function isJoinReady(value: string): boolean {
  const compact = stripSpaces(value);
  return MEETING_ID.test(compact) || LINK_NAME.test(compact);
}

/** History rows: a space after 3 characters and before the last 4 (`810 9876 5432`). */
export const formatHistoryNumber = (number: string): string =>
  number.length > 7 ? `${number.slice(0, 3)} ${number.slice(3, -4)} ${number.slice(-4)}` : number;

function meetingFromPath(pathname: string): string | null {
  if (MEETING_PATH.test(pathname)) return pathname.split("/").filter(Boolean).pop() ?? null;
  for (const pattern of WC_PATTERNS) {
    const match = pattern.exec(pathname);
    if (match?.[1]) return match[1];
  }
  return null;
}

function parseInviteUrl(text: string, appOrigin: string): URL | null {
  try {
    const url = new URL(text.trim());
    const zoomLink = url.protocol === "https:" && ZOOM_HOST.test(url.hostname);
    return zoomLink || url.origin === appOrigin ? url : null;
  } catch {
    return null;
  }
}

interface PastedJoinValue {
  /** field value after the normal setter (formatting, caps); null when nothing usable was pasted */
  value: string | null;
  /** every query param of a recognised invite link (e.g. `{ pwd }`), else empty */
  params: Record<string, string>;
}

/**
 * Paste rule: an invite link of ours (`appOrigin`) or Zoom's keeps its number and query params;
 * anything else keeps the last path segment. Disallowed characters are then dropped.
 */
export function parsePastedJoin(text: string, appOrigin: string): PastedJoinValue {
  const url = parseInviteUrl(text, appOrigin);
  const number = url ? meetingFromPath(url.pathname) : null;
  const params = url && number ? Object.fromEntries(url.searchParams) : {};
  const raw = number ?? (text.split("?")[0]?.split("/").pop() || text);
  return { value: normalizeJoinInput(raw.replace(DISALLOWED_CHARS, "")), params };
}
