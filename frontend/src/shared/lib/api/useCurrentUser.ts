"use client";

import { useQuery } from "@tanstack/react-query";
import type { User } from "@/shared/types/api";
import { queryKeys } from "./queryKeys";
import { getMe } from "./users";

/** Seeded default user (PRD §3) — shown only when the backend cannot be reached. */
const FALLBACK_USER: User = {
  id: 1,
  display_name: "Unnat Agrawal",
  email: "agrawanunnat.ieee@gmail.com",
  pmi: "5123456789",
  pmi_formatted: "512 345 6789",
  timezone: "Asia/Kolkata",
  avatar_color: "#9053C2",
  initials: "UA",
};

/**
 * The signed-in (default) user from `GET /api/me`. `user` is null while the
 * first request is in flight (the header keeps its right slot empty, PRD §6.1).
 */
export function useCurrentUser() {
  const query = useQuery({ queryKey: queryKeys.me, queryFn: ({ signal }) => getMe(signal), staleTime: Infinity });
  const user = query.data ?? (query.isError ? FALLBACK_USER : null);
  return { user, isLoading: query.isPending, isError: query.isError };
}
