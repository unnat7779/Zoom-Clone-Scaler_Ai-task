"use client";

import { useMediaElement } from "../../hooks/useMediaElement";

/** Plays one remote participant's audio (hidden <audio>, routed to the chosen speaker). */
export function RemoteAudio({ stream, sinkId }: { stream: MediaStream; sinkId?: string }) {
  const ref = useMediaElement<HTMLAudioElement>(stream, sinkId);
  return <audio ref={ref} autoPlay hidden />;
}
