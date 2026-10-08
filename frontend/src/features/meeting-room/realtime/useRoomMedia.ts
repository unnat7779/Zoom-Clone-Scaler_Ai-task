"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { type MediaKind, isBlocked, useLocalPreviewStream } from "@/shared/media";
import { useCameraProbe } from "./useCameraProbe";

export interface RoomMediaOptions {
  /** drawn on the synthetic camera (fake media) */
  displayName: string;
  initialAudioMuted: boolean;
  initialVideoOn: boolean;
  audioInputId?: string;
  videoInputId?: string;
  audioOutputId?: string;
}

export interface RoomMedia {
  /** the first microphone request has settled (granted or not); until then the toolbar shows "Join Audio" */
  ready: boolean;
  /** the camera (or the entry probe) has not answered yet: Video is disabled, as in Zoom */
  videoPending: boolean;
  audioStream: MediaStream | null;
  /** camera stream; null while the video is off (the camera is released) */
  videoStream: MediaStream | null;
  audioTrack: MediaStreamTrack | null;
  videoTrack: MediaStreamTrack | null;
  /** muted = microphone track disabled (it stays open, as in Zoom) */
  audioMuted: boolean;
  videoOn: boolean;
  /** refused or missing → "disallowed" toolbar icons and the permission bar */
  blocked: Record<MediaKind, boolean>;
  audioInputId?: string;
  videoInputId?: string;
  audioOutputId?: string;
  setAudioMuted: (muted: boolean) => void;
  setVideoOn: (on: boolean) => void;
  selectAudioInput: (deviceId: string) => void;
  selectVideoInput: (deviceId: string) => void;
  selectAudioOutput: (deviceId: string) => void;
  /** asks the browser again for a blocked microphone / camera */
  retry: (kind: MediaKind) => void;
  /** stops every track (leaving the meeting) */
  release: () => void;
}

/** Mute = disable the outgoing microphone track. */
function applyMute(track: MediaStreamTrack | null, muted: boolean): void {
  if (track) track.enabled = !muted;
}

/** Local microphone + camera of the meeting room, on top of `useLocalPreviewStream`. */
export function useRoomMedia(options: RoomMediaOptions): RoomMedia {
  const [audioMuted, setAudioMuted] = useState(options.initialAudioMuted);
  const [wantVideo, setWantVideo] = useState(options.initialVideoOn);
  const [released, setReleased] = useState(false);
  const [devices, setDevices] = useState({ audio: options.audioInputId, video: options.videoInputId, output: options.audioOutputId });
  const preview = useLocalPreviewStream({
    audio: { enabled: !released, deviceId: devices.audio },
    video: { enabled: wantVideo && !released, deviceId: devices.video },
    fakeLabel: options.displayName,
  });
  const probe = useCameraProbe(options.initialVideoOn);
  const audioTrack = preview.audioStream?.getAudioTracks()[0] ?? null;
  const videoTrack = preview.videoStream?.getVideoTracks()[0] ?? null;
  const videoStatus = wantVideo || preview.videoStatus !== "pending" ? preview.videoStatus : probe;
  // "joined" once the first microphone request settles; switching microphones later never shows "Join Audio" again
  const [audioJoined, setAudioJoined] = useState(false);
  if (!audioJoined && preview.audioStatus !== "pending") setAudioJoined(true);

  useEffect(() => applyMute(audioTrack, audioMuted), [audioTrack, audioMuted]);

  const { retryAudio, retryVideo } = preview;
  const retry = useCallback(
    (kind: MediaKind) => {
      if (kind === "audio") retryAudio();
      else if (wantVideo) retryVideo();
      else setWantVideo(true);
    },
    [retryAudio, retryVideo, wantVideo],
  );
  const select = useCallback((key: "audio" | "video" | "output", id: string) => setDevices((current) => ({ ...current, [key]: id })), []);
  const selectAudioInput = useCallback((id: string) => select("audio", id), [select]);
  const selectVideoInput = useCallback((id: string) => select("video", id), [select]);
  const selectAudioOutput = useCallback((id: string) => select("output", id), [select]);
  const release = useCallback(() => setReleased(true), []);

  const audioBlocked = isBlocked(preview.audioStatus);
  const videoBlocked = isBlocked(videoStatus);
  const videoPending = !released && videoStatus === "pending";
  const { audioStream, videoStream } = preview;
  return useMemo(
    () => ({
      ready: audioJoined,
      videoPending,
      audioStream,
      videoStream,
      audioTrack,
      videoTrack,
      audioMuted,
      videoOn: videoTrack !== null,
      blocked: { audio: audioBlocked, video: videoBlocked },
      audioInputId: devices.audio,
      videoInputId: devices.video,
      audioOutputId: devices.output,
      setAudioMuted,
      setVideoOn: setWantVideo,
      selectAudioInput,
      selectVideoInput,
      selectAudioOutput,
      retry,
      release,
    }),
    [
      audioJoined,
      videoPending,
      audioStream,
      videoStream,
      audioTrack,
      videoTrack,
      audioMuted,
      audioBlocked,
      videoBlocked,
      devices,
      selectAudioInput,
      selectVideoInput,
      selectAudioOutput,
      retry,
      release,
    ],
  );
}
