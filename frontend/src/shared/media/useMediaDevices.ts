"use client";

/**
 * Microphone / speaker / camera lists for the device menus. Labels are empty until a
 * permission is granted, so Zoom's "Unrecognized microphone1" style names are used then.
 */
import { useEffect, useState } from "react";
import { warnOnFailure } from "@/shared/lib/logger";
import { FAKE_DEVICES, isFakeMediaEnabled } from "./fakeMedia";
import type { MediaDeviceLists, MediaDeviceOption } from "./mediaTypes";

const EMPTY: MediaDeviceLists = { microphones: [], speakers: [], cameras: [] };

const FALLBACK_NAMES: Record<MediaDeviceKind, string> = {
  audioinput: "microphone",
  audiooutput: "speaker",
  videoinput: "camera",
};

function toOptions(devices: MediaDeviceInfo[], kind: MediaDeviceKind): MediaDeviceOption[] {
  return devices
    .filter((device) => device.kind === kind)
    .map((device, index) => ({
      deviceId: device.deviceId,
      label: device.label || `Unrecognized ${FALLBACK_NAMES[kind]}${index + 1}`,
    }));
}

async function listDevices(): Promise<MediaDeviceLists> {
  if (isFakeMediaEnabled()) return FAKE_DEVICES;
  if (!navigator.mediaDevices?.enumerateDevices) return EMPTY;
  const devices = await navigator.mediaDevices.enumerateDevices();
  return {
    microphones: toOptions(devices, "audioinput"),
    speakers: toOptions(devices, "audiooutput"),
    cameras: toOptions(devices, "videoinput"),
  };
}

/** Re-reads the lists on `devicechange` and whenever `refreshKey` changes (e.g. after a grant). */
export function useMediaDevices(refreshKey?: unknown): MediaDeviceLists {
  const [devices, setDevices] = useState<MediaDeviceLists>(EMPTY);

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      listDevices()
        .then((lists) => {
          if (!cancelled) setDevices(lists);
        })
        .catch(warnOnFailure("media: listing devices failed"));
    };
    load();
    navigator.mediaDevices?.addEventListener?.("devicechange", load);
    return () => {
      cancelled = true;
      navigator.mediaDevices?.removeEventListener?.("devicechange", load);
    };
  }, [refreshKey]);

  return devices;
}
