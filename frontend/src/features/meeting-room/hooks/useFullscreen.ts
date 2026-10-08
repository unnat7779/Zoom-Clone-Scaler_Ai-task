"use client";

import { type RefObject, useCallback, useEffect, useState } from "react";
import { warnOnFailure } from "@/shared/lib/logger";

/** Fullscreen API on the room container (View menu → Fullscreen / Exit Fullscreen). */
export function useFullscreen(ref: RefObject<HTMLElement | null>) {
  const [isFullscreen, setIsFullscreen] = useState(() => typeof document !== "undefined" && document.fullscreenElement !== null);

  useEffect(() => {
    const onChange = () => setIsFullscreen(document.fullscreenElement !== null && document.fullscreenElement === ref.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, [ref]);

  const toggle = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen().catch(warnOnFailure("room: exit fullscreen failed"));
    else void ref.current?.requestFullscreen().catch(warnOnFailure("room: fullscreen refused"));
  }, [ref]);

  return { isFullscreen, toggle };
}
