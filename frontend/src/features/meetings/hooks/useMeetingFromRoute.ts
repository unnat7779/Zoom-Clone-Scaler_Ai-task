"use client";

import { useSearchParams } from "next/navigation";
import { isApiError } from "@/shared/lib/api";
import { useMeetingDetail } from "../api/meetingQueries";

/**
 * The meeting of `/meeting/{number}[?id=]` and `/meeting/{number}/edit` (PRD §7.7–7.8).
 * `notFound` (unknown, deleted or malformed number) → Zoom's "Invalid meeting ID" page;
 * `failed` (server or network error) → a retry state instead of a wrong "invalid" page.
 */
export function useMeetingFromRoute(number: string) {
  const id = Number(useSearchParams().get("id")) || undefined;
  const query = useMeetingDetail({ number, id });
  const { error, refetch } = query;
  const notFound = isApiError(error) && (error.code === "MEETING_NOT_FOUND" || error.status === 404 || error.status === 422);
  return {
    meeting: query.data,
    notFound,
    failed: Boolean(error) && !notFound,
    retry: () => void refetch(),
  };
}
