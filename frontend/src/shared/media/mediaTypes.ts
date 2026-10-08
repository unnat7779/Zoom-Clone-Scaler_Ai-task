/** Types shared by the live-media hooks (pre-join page and meeting room). */

export type MediaKind = "audio" | "video";

/**
 * pending: getUserMedia in flight · granted: device live or allowed ·
 * denied: permission refused · unavailable: no device / device busy / insecure context.
 */
export type MediaPermission = "pending" | "granted" | "denied" | "unavailable";

/**
 * Why a device could not be opened (the pre-join error banner): denied (permission) · notFound
 * (no such device) · busy (used by another app) · timeout (no answer, ACQUIRE_TIMEOUT_MS).
 */
export type MediaFailure = "denied" | "notFound" | "busy" | "timeout";

export interface MediaDeviceOption {
  deviceId: string;
  /** browser label, or Zoom's "Unrecognized microphone1" style name before a permission grant */
  label: string;
}

export interface MediaDeviceLists {
  microphones: MediaDeviceOption[];
  speakers: MediaDeviceOption[];
  cameras: MediaDeviceOption[];
}

/** denied / unavailable: the toolbar shows the "disallowed" icons and the permission bar. */
export const isBlocked = (status: MediaPermission): boolean => status === "denied" || status === "unavailable";
