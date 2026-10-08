import { USERS_DEFAULT_LIMIT } from "./users";

/**
 * TanStack Query keys, shared so that mutations in one feature invalidate
 * the lists of another (e.g. Schedule → Home day view + Meetings Upcoming).
 * Invalidate a whole family with `queryClient.invalidateQueries({ queryKey: queryKeys.meetings.all })`.
 */
export const queryKeys = {
  me: ["me"] as const,
  /** the limit is part of the key: Contacts (50) never shares an entry with the 8-user lookups */
  users: (q = "", limit = USERS_DEFAULT_LIMIT) => ["users", q, limit] as const,
  meetings: {
    all: ["meetings"] as const,
    upcoming: (from: string) => ["meetings", "upcoming", from] as const,
    day: (date: string, tz: string) => ["meetings", "day", date, tz] as const,
    previous: (limit = 50) => ["meetings", "previous", limit] as const,
    pmi: ["meetings", "pmi"] as const,
    detail: (number: string, id?: number) => ["meetings", "detail", number, id ?? null] as const,
    invitation: (number: string, id?: number) => ["meetings", "invitation", number, id ?? null] as const,
    validation: (number: string, pwd?: string | null) => ["meetings", "validate", number, pwd ?? null] as const,
  },
  instance: (uuid: string) => ["instances", uuid] as const,
};
