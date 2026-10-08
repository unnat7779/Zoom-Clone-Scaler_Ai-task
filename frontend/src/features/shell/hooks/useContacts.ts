"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/lib/api/queryKeys";
import { listUsers } from "@/shared/lib/api/users";

const CONTACTS_LIMIT = 50;

/** Seeded users listed on the static Contacts page (PRD §6.8). */
export function useContacts() {
  return useQuery({
    queryKey: queryKeys.users("", CONTACTS_LIMIT),
    queryFn: ({ signal }) => listUsers({ limit: CONTACTS_LIMIT }, signal),
  });
}
