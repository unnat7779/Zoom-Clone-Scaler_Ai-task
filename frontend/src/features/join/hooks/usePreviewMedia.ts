"use client";

import { useState } from "react";
import type { MeetingEntryPreferences } from "@/shared/lib/meetingSession";
import {
  type MediaDeviceLists,
  type MediaPermission,
  isBlocked,
  streamDeviceId,
  useLocalPreviewStream,
  useMediaDevices,
} from "@/shared/media";
import { NO_PREVIEW_FAILURES, type PreviewError, nextPreviewFailures } from "../utils/previewError";

export interface PreviewDeviceControl {
  status: MediaPermission;
  /** what the button shows: "Mute"/"Unmute", "Stop Video"/"Start Video" (blocked: "Mute" / "Stop Video") */
  on: boolean;
  toggle: () => void;
  /** the device in use (or chosen) — ✓ in the caret menu */
  selectedId?: string;
  select: (deviceId: string) => void;
}

export interface PreviewMedia {
  audioStream: MediaStream | null;
  videoStream: MediaStream | null;
  mic: PreviewDeviceControl;
  camera: PreviewDeviceControl;
  speakerId?: string;
  selectSpeaker: (deviceId: string) => void;
  devices: MediaDeviceLists;
  /** Zoom's preview error banner (one at a time, the last failure wins) */
  error: PreviewError | null;
  /** mic/camera state and devices handed to the room (PRD §7.10.1 step 3) */
  entryPreferences: () => MeetingEntryPreferences;
}

/**
 * Pre-join mic/camera rules (PRD §7.10.1 step 2): the mic starts on unless the meeting
 * mutes on entry; the camera is opened at once to ask for permission and, once granted,
 * stays on only when the meeting starts participants with video. A blocked device keeps
 * Zoom's "Mute" / "Stop Video" labels; clicking it asks for the permission again.
 */
export function usePreviewMedia({ participantVideoOn, muteUponEntry }: { participantVideoOn: boolean; muteUponEntry: boolean }): PreviewMedia {
  const [micOn, setMicOn] = useState(!muteUponEntry);
  const [videoChoice, setVideoChoice] = useState<boolean | null>(null);
  const [micId, setMicId] = useState<string>();
  const [cameraId, setCameraId] = useState<string>();
  const [speakerId, setSpeakerId] = useState<string>();
  const [cameraKnown, setCameraKnown] = useState(false);

  const videoWanted = videoChoice ?? (cameraKnown ? participantVideoOn : true);
  const media = useLocalPreviewStream({
    audio: { enabled: true, deviceId: micId },
    video: { enabled: videoWanted, deviceId: cameraId },
  });
  // First answer to the camera probe decides the default (render-phase state sync).
  if (!cameraKnown && media.videoStatus !== "pending") setCameraKnown(true);
  const devices = useMediaDevices(`${media.audioStatus}/${media.videoStatus}`);
  const [failures, setFailures] = useState(NO_PREVIEW_FAILURES);
  const nextFailures = nextPreviewFailures(failures, media.audioFailure, media.videoFailure);
  if (nextFailures !== failures) setFailures(nextFailures);

  const mic: PreviewDeviceControl = {
    status: media.audioStatus,
    on: micOn || isBlocked(media.audioStatus),
    toggle: () => (isBlocked(media.audioStatus) ? media.retryAudio() : setMicOn((on) => !on)),
    selectedId: streamDeviceId(media.audioStream) ?? micId,
    select: setMicId,
  };
  const camera: PreviewDeviceControl = {
    status: media.videoStatus,
    on: isBlocked(media.videoStatus) || (videoWanted && media.videoStatus !== "pending"),
    toggle: () => {
      if (!isBlocked(media.videoStatus)) return setVideoChoice(!videoWanted);
      setVideoChoice(true);
      media.retryVideo();
    },
    selectedId: streamDeviceId(media.videoStream) ?? cameraId,
    select: setCameraId,
  };

  return {
    audioStream: media.audioStream,
    videoStream: media.videoStream,
    mic,
    camera,
    speakerId,
    selectSpeaker: setSpeakerId,
    devices,
    error: nextFailures.error,
    entryPreferences: () => ({
      audioMuted: !(micOn && media.audioStatus === "granted"),
      videoOn: videoWanted && media.videoStream !== null,
      audioInputId: mic.selectedId,
      videoInputId: camera.selectedId,
      audioOutputId: speakerId,
    }),
  };
}
