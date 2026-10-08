"use client";

import { useCallback } from "react";
import { isApiError } from "@/shared/lib/api";
import { useToast } from "@/shared/ui/Toast";

const FALLBACK_MESSAGE = "Something went wrong. Please try again.";

/** Save failures on the portal pages (PRD §7.6.7 [D]): the API message in zoom.us's error message bar. */
export function useSaveErrorToast() {
  const toast = useToast();
  return useCallback(
    (error: Error) => toast.show({ message: isApiError(error) ? error.message : FALLBACK_MESSAGE, kind: "error", surface: "portal" }),
    [toast],
  );
}
