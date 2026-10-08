/** getUserMedia for one kind of device (real or synthetic) and error classification. */
import { createFakeAudioStream, createFakeVideoStream, isFakeMediaEnabled } from "./fakeMedia";
import type { MediaFailure, MediaKind, MediaPermission } from "./mediaTypes";

const VIDEO_CONSTRAINTS: MediaTrackConstraints = { width: { ideal: 1280 }, height: { ideal: 720 } };

const PERMISSION_NAMES: Record<MediaKind, string> = { audio: "microphone", video: "camera" };

/**
 * true when the browser already reports the permission as blocked. Some browsers (the
 * desktop app's built-in browser) then never settle getUserMedia, so it is not called.
 */
async function isPermissionDenied(kind: MediaKind): Promise<boolean> {
  try {
    const status = await navigator.permissions?.query({ name: PERMISSION_NAMES[kind] as PermissionName });
    return status?.state === "denied";
  } catch {
    return false; // the permission name is not supported (Firefox, Safari): just ask
  }
}

/** Opens the microphone or the camera; `fakeLabel` is drawn on the synthetic camera. */
export async function acquireStream(kind: MediaKind, deviceId?: string, fakeLabel?: string): Promise<MediaStream> {
  if (isFakeMediaEnabled()) return kind === "audio" ? createFakeAudioStream() : createFakeVideoStream(fakeLabel);
  if (!navigator.mediaDevices?.getUserMedia) throw new DOMException("Media devices unavailable", "NotFoundError");
  if (await isPermissionDenied(kind)) throw new DOMException("Permission denied", "NotAllowedError");
  const device: MediaTrackConstraints = deviceId ? { deviceId: { exact: deviceId } } : {};
  const constraints: MediaStreamConstraints =
    kind === "audio" ? { audio: deviceId ? device : true } : { video: { ...VIDEO_CONSTRAINTS, ...device } };
  return navigator.mediaDevices.getUserMedia(constraints);
}

/** getUserMedia error → why: refused, device busy (NotReadableError / AbortError) or missing. */
export function mediaFailure(error: unknown): Exclude<MediaFailure, "timeout"> {
  const name = error instanceof DOMException ? error.name : "";
  if (name === "NotAllowedError" || name === "SecurityError") return "denied";
  if (name === "NotReadableError" || name === "AbortError" || name === "TrackStartError") return "busy";
  return "notFound";
}

/** NotAllowedError / SecurityError → denied; everything else (no device, busy) → unavailable. */
export function classifyMediaError(error: unknown): Exclude<MediaPermission, "pending" | "granted"> {
  return mediaFailure(error) === "denied" ? "denied" : "unavailable";
}

export function stopStream(stream: MediaStream | null): void {
  stream?.getTracks().forEach((track) => track.stop());
}

/** deviceId of the stream's first track (what the browser actually opened); none for synthetic media. */
export function streamDeviceId(stream: MediaStream | null): string | undefined {
  if (isFakeMediaEnabled()) return undefined;
  return stream?.getTracks()[0]?.getSettings().deviceId;
}
