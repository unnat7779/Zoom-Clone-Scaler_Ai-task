"use client";

import { useEffect, useRef } from "react";
import { logger, warnOnFailure } from "@/shared/lib/logger";

/**
 * Binds a MediaStream to a <video>/<audio> element and keeps it playing. When the
 * browser blocks autoplay (no user gesture yet), playback resumes on the next click/key.
 * `sinkId` routes audio to the chosen speaker where `setSinkId` exists.
 */
export function useMediaElement<T extends HTMLMediaElement>(stream: MediaStream | null, sinkId?: string) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    element.srcObject = stream;
    if (!stream) return;
    // NotAllowedError = autoplay blocked until a gesture (retried below); anything else is worth a log
    const play = () =>
      void element.play().catch((error: unknown) => {
        if (!(error instanceof DOMException && ["NotAllowedError", "AbortError"].includes(error.name))) logger.warn("media: playback failed", error);
      });
    const retry = () => {
      if (element.paused) play();
    };
    play();
    window.addEventListener("pointerdown", retry, { capture: true });
    window.addEventListener("keydown", retry, { capture: true });
    return () => {
      window.removeEventListener("pointerdown", retry, { capture: true });
      window.removeEventListener("keydown", retry, { capture: true });
    };
  }, [stream]);

  // the speaker chosen on the pre-join page or in the Audio menu / Settings (PRD §8.6.2)
  useEffect(() => {
    const element = ref.current as (T & { setSinkId?: (id: string) => Promise<void> }) | null;
    if (!element?.setSinkId || sinkId === undefined) return;
    void element.setSinkId(sinkId).catch((error: unknown) => {
      logger.warn(`media: speaker ${sinkId} unavailable, using the default output`, error);
      void element.setSinkId?.("").catch(warnOnFailure("media: default speaker unavailable"));
    });
  }, [sinkId]);

  return ref;
}
