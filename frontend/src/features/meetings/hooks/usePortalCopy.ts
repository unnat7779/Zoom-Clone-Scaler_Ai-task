"use client";

import { useCallback } from "react";
import { copyText } from "@/shared/hooks/useClipboard";
import { useToast } from "@/shared/ui/Toast";

/** zoom.us copy: writes the text, then the green "Copied to clipboard" message at the top (PRD §5.8.13). */
export function usePortalCopy() {
  const toast = useToast();
  return useCallback(
    async (text: string) => {
      if (await copyText(text)) toast.show({ message: "Copied to clipboard", kind: "success", surface: "portal" });
    },
    [toast],
  );
}
