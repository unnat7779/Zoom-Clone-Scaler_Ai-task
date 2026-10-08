"use client";

/**
 * Opens one device (mic or camera) while `enabled`, re-opens it when `deviceId` changes
 * or `retry()` is called, and stops the tracks on disable / change / unmount.
 * A request that has not answered after ACQUIRE_TIMEOUT_MS reports "unavailable" (the
 * blocked icons instead of an endless spinner); a late answer still replaces that status.
 */
import { useCallback, useEffect, useState } from "react";
import { acquireStream, classifyMediaError, mediaFailure, stopStream } from "./acquireStream";
import type { MediaFailure, MediaKind, MediaPermission } from "./mediaTypes";

const ACQUIRE_TIMEOUT_MS = 8000;

interface AcquireResult {
  key: string;
  stream: MediaStream | null;
  status: MediaPermission;
  failure: MediaFailure | null;
}

export interface DeviceStream {
  /** live stream, or null while pending / disabled / failed */
  stream: MediaStream | null;
  /** status of the current request; when disabled, the last known permission */
  status: MediaPermission;
  /** why the current request failed (null while pending, granted or disabled) */
  failure: MediaFailure | null;
  /** ask again (e.g. after the user fixed a denied permission) */
  retry: () => void;
}

export function useDeviceStream(kind: MediaKind, enabled: boolean, deviceId?: string, fakeLabel?: string): DeviceStream {
  // Every retry and every re-enable is a new request, so a stopped stream is never reused.
  const [request, setRequest] = useState(0);
  const [wasEnabled, setWasEnabled] = useState(enabled);
  if (enabled !== wasEnabled) {
    setWasEnabled(enabled);
    if (enabled) setRequest((count) => count + 1);
  }
  const [result, setResult] = useState<AcquireResult | null>(null);
  const key = enabled ? `${deviceId ?? "default"}#${request}` : null;

  useEffect(() => {
    if (!key) return;
    let cancelled = false;
    let opened: MediaStream | null = null;
    const timeout = window.setTimeout(() => {
      setResult((current) => (current?.key === key ? current : { key, stream: null, status: "unavailable", failure: "timeout" }));
    }, ACQUIRE_TIMEOUT_MS);
    acquireStream(kind, deviceId, fakeLabel)
      .then((stream) => {
        if (cancelled) return stopStream(stream);
        opened = stream;
        setResult({ key, stream, status: "granted", failure: null });
      })
      .catch((error: unknown) => {
        if (!cancelled) setResult({ key, stream: null, status: classifyMediaError(error), failure: mediaFailure(error) });
      })
      .finally(() => window.clearTimeout(timeout));
    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      stopStream(opened);
    };
  }, [key, kind, deviceId, fakeLabel]);

  const retry = useCallback(() => setRequest((count) => count + 1), []);
  const current = result && result.key === key ? result : null;
  if (!key) return { stream: null, status: result?.status ?? "pending", failure: null, retry };
  return { stream: current?.stream ?? null, status: current?.status ?? "pending", failure: current?.failure ?? null, retry };
}
