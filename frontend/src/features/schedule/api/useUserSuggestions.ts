"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { listUsers, queryKeys } from "@/shared/lib/api";

/** `GET /api/users?q=&limit=8` (PRD §10.4); contacts barely change, so a minute of cache. */
const SUGGESTION_LIMIT = 8;
const SUGGESTION_STALE_MS = 60_000;

/** Seeded contacts matching the typed invitee text (`GET /api/users?q=`), while the menu is open. */
export function useUserSuggestions(query: string) {
  const q = query.trim();
  return useQuery({
    queryKey: queryKeys.users(q, SUGGESTION_LIMIT),
    queryFn: ({ signal }) => listUsers({ q, limit: SUGGESTION_LIMIT }, signal),
    enabled: q.length > 0,
    placeholderData: keepPreviousData,
    staleTime: SUGGESTION_STALE_MS,
  });
}
