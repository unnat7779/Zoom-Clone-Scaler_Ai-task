import type { MediaFailure, MediaKind } from "@/shared/media";

/**
 * Zoom's preview error banner (`kpe`, critic C3): VIDEO_FORBIDDEN, AUDIO_FORBIDDEN,
 * CAN_NOT_DETECT_CAMERA, CAMERA_TAKEN. A request that never answers shows none.
 */
export type PreviewError = "videoForbidden" | "audioForbidden" | "cameraNotFound" | "cameraBusy";

export function previewErrorFor(kind: MediaKind, failure: MediaFailure | null): PreviewError | null {
  if (failure === "denied") return kind === "video" ? "videoForbidden" : "audioForbidden";
  if (kind !== "video") return null;
  if (failure === "notFound") return "cameraNotFound";
  if (failure === "busy") return "cameraBusy";
  return null;
}

export interface PreviewFailures {
  audio: MediaFailure | null;
  video: MediaFailure | null;
  /** the banner shown */
  error: PreviewError | null;
}

export const NO_PREVIEW_FAILURES: PreviewFailures = { audio: null, video: null, error: null };

/**
 * One banner at a time, and the failure set last wins (Zoom's `setError`): a newly failed device
 * replaces the banner; when its device recovers, the other device's error (if any) shows again.
 * Returns `previous` itself when nothing changed.
 */
export function nextPreviewFailures(previous: PreviewFailures, audio: MediaFailure | null, video: MediaFailure | null): PreviewFailures {
  if (previous.audio === audio && previous.video === video) return previous;
  const fromVideo = previewErrorFor("video", video);
  const fromAudio = previewErrorFor("audio", audio);
  const changedVideo = previous.video !== video && fromVideo;
  const changedAudio = previous.audio !== audio && fromAudio;
  const kept = previous.error !== null && (previous.error === fromVideo || previous.error === fromAudio) ? previous.error : null;
  return { audio, video, error: changedVideo || changedAudio || kept || fromVideo || fromAudio || null };
}
