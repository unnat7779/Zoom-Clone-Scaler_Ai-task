"use client";

import { useCallback, useEffect, useRef, useState } from "react";

function legacyCopy(text: string): boolean {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  try {
    return document.execCommand("copy");
  } finally {
    textarea.remove();
  }
}

/** Writes text to the clipboard (with a fallback for insecure origins). */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to the legacy path */
  }
  return legacyCopy(text);
}

/**
 * `copy(text)` resolves true on success; `copied` stays true for `resetAfter`
 * ms (drive "Copied!" tooltips / check icons with it).
 */
export function useClipboard({ resetAfter = 2000 }: { resetAfter?: number } = {}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const copy = useCallback(
    async (text: string) => {
      const ok = await copyText(text);
      setCopied(ok);
      if (timer.current) clearTimeout(timer.current);
      if (ok) timer.current = setTimeout(() => setCopied(false), resetAfter);
      return ok;
    },
    [resetAfter],
  );

  return { copy, copied };
}
