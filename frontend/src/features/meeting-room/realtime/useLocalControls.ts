"use client";

import { useCallback } from "react";
import { announceRoomEvent } from "../utils/announceRoomEvent";
import { useRoomContext } from "./roomContext";
import { selectIsHost } from "./roomReducer";

/**
 * This participant's microphone and camera. Toggling updates the local tracks;
 * `useRoomConnection` publishes the new state as `media_state`.
 */
export function useLocalControls() {
  const { media, connection, toasts, session } = useRoomContext();
  const { settings } = connection.state;
  const isHost = selectIsHost(connection.state, session.participant.role);
  const { ready, videoPending, audioMuted, videoOn, blocked, audioStream, videoStream, setAudioMuted, setVideoOn, retry } = media;
  const audioBlocked = blocked.audio && !audioStream;
  const videoBlocked = blocked.video && !videoStream;
  // spec 05 §5.3 [J]: "Join Audio" until the microphone request settles (the browser prompt is open)
  const audioJoining = !ready;

  const setMuted = useCallback(
    (muted: boolean) => {
      // Join Audio while the microphone request is pending: ask again (Zoom starts its join-audio flow)
      if (audioJoining || audioBlocked) return retry("audio");
      if (!muted && !isHost && !settings.allow_unmute) return announceRoomEvent(toasts, { type: "unmuteRefused" });
      setAudioMuted(muted);
    },
    [audioJoining, audioBlocked, isHost, settings.allow_unmute, retry, setAudioMuted, toasts],
  );

  const setVideo = useCallback(
    (on: boolean) => {
      if (videoPending) return; // the camera is still opening (Video is disabled)
      if (videoBlocked) return retry("video");
      setVideoOn(on);
    },
    [videoPending, videoBlocked, retry, setVideoOn],
  );

  return {
    audioMuted,
    videoOn,
    audioJoining,
    videoStarting: videoPending,
    audioBlocked,
    videoBlocked,
    /** microphone stream (audio-level meter) */
    audioStream,
    /** camera stream for the self view; null while the video is off */
    selfVideoStream: videoStream,
    setMuted,
    toggleAudio: () => setMuted(!audioMuted),
    setVideo,
    toggleVideo: () => setVideo(!videoOn),
    retry,
  };
}
