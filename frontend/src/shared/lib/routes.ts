/**
 * Route builders (PRD §4.1). Always navigate through these so query
 * parameters (`fromPWA`, `pwd`, `tab`, `select`, `id`) stay consistent.
 */
/** Zoom's own flag: render the meeting routes inside the Workplace shell. */
export const FROM_PWA_PARAM = "fromPWA";

type Query = Record<string, string | number | boolean | null | undefined>;

function withQuery(path: string, query: Query = {}): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === false) continue;
    params.set(key, value === true ? "1" : String(value));
  }
  const search = params.toString();
  return search ? `${path}?${search}` : path;
}

const wc = (number: string, page: string) => `/wc/${encodeURIComponent(number)}/${page}`;

export interface InShellOption {
  /** true → `?fromPWA=1` (header + rail stay visible) */
  fromPWA?: boolean;
}

export const routes = {
  home: () => "/wc/home",
  /** Opens Home with the Join modal (`/wc/join`). */
  joinShortcut: () => "/wc/join",
  meetings: (query: { tab?: "upcoming" | "previous"; select?: string } = {}) => withQuery("/wc/meetings", query),
  teamChat: () => "/wc/team-chat",
  contacts: () => "/wc/contacts",
  preJoin: (number: string, query: InShellOption & { pwd?: string | null } = {}) =>
    withQuery(wc(number, "join"), { pwd: query.pwd, [FROM_PWA_PARAM]: query.fromPWA }),
  /** `id` addresses a calendar entry that runs on the PMI number (`uses_pmi`, PRD §10.4). */
  start: (number: string, query: InShellOption & { id?: number } = {}) =>
    withQuery(wc(number, "start"), { [FROM_PWA_PARAM]: query.fromPWA, id: query.id }),
  room: (number: string, query: InShellOption = {}) => withQuery(wc(number, "meeting"), { [FROM_PWA_PARAM]: query.fromPWA }),
  /** Full-viewport left page (PRD §7.11): `reason` picks the message, `pwd` lets "Rejoin" skip the passcode. */
  left: (number: string, query: { reason?: string; pwd?: string | null } = {}) =>
    withQuery(wc(number, "left"), { reason: query.reason, pwd: query.pwd }),
  schedule: () => "/meeting/schedule",
  meetingDetail: (number: string, query: { id?: number } = {}) => withQuery(`/meeting/${encodeURIComponent(number)}`, query),
  meetingEdit: (number: string, query: { id?: number } = {}) =>
    withQuery(`/meeting/${encodeURIComponent(number)}/edit`, query),
} as const;
