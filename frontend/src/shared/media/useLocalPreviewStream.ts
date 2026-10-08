"use client";

/**
 * Local microphone + camera (pre-join preview and meeting room). They are opened
 * separately, so one denied permission never blocks the other (PRD §7.10.3);
 * disabling a kind stops its tracks.
 */
import { useDeviceStream } from "./useDeviceStream";
import type { MediaFailure, MediaPermission } from "./mediaTypes";

export interface DeviceRequest {
  enabled: boolean;
  /** undefined → the browser's default device */
  deviceId?: string;
}

export interface LocalPreviewRequest {
  audio: DeviceRequest;
  video: DeviceRequest;
  /** text drawn on the synthetic camera (`NEXT_PUBLIC_FAKE_MEDIA=1`) */
  fakeLabel?: string;
}

export interface LocalPreviewStream {
  audioStream: MediaStream | null;
  videoStream: MediaStream | null;
  audioStatus: MediaPermission;
  videoStatus: MediaPermission;
  audioFailure: MediaFailure | null;
  videoFailure: MediaFailure | null;
  retryAudio: () => void;
  retryVideo: () => void;
}

export function useLocalPreviewStream({ audio, video, fakeLabel }: LocalPreviewRequest): LocalPreviewStream {
  const microphone = useDeviceStream("audio", audio.enabled, audio.deviceId);
  const camera = useDeviceStream("video", video.enabled, video.deviceId, fakeLabel);
  return {
    audioStream: microphone.stream,
    videoStream: camera.stream,
    audioStatus: microphone.status,
    videoStatus: camera.status,
    audioFailure: microphone.failure,
    videoFailure: camera.failure,
    retryAudio: microphone.retry,
    retryVideo: camera.retry,
  };
}
