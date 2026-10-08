"use client";

import { useEffect, useState } from "react";
import { type MediaPermission, acquireStream, classifyMediaError, stopStream } from "@/shared/media";

/**
 * Zoom asks for the camera on entry even when the video starts off (PRD §7.3.4):
 * open it once, release it immediately and remember the outcome (denied → permission bar).
 */
export function useCameraProbe(skip: boolean): MediaPermission {
  const [status, setStatus] = useState<MediaPermission>("pending");

  useEffect(() => {
    if (skip) return;
    let cancelled = false;
    acquireStream("video")
      .then((stream) => {
        stopStream(stream);
        if (!cancelled) setStatus("granted");
      })
      .catch((error: unknown) => {
        if (!cancelled) setStatus(classifyMediaError(error));
      });
    return () => {
      cancelled = true;
    };
  }, [skip]);

  return status;
}
