"use client";

import { useEffect, useState } from "react";
import { type LevelMeter, createLevelMeter } from "@/shared/media";
import type { Participant } from "@/shared/types/api";

/** RMS above which a participant counts as talking, and for how long (PRD §8.3.2 [D]). */
const SPEAKING_RMS = 0.02;
const HOLD_MS = 300;
const POLL_MS = 100;

/**
 * Id of the remote participant who most recently talked for ≥ 300 ms (null until
 * someone does). Self is excluded, as with Zoom's default "Show me as the active
 * speaker when I talk" = off. Muted participants are not measured.
 */
export function useActiveSpeaker(streams: Record<number, MediaStream>, participants: Participant[], selfId: number | null) {
  const [speakerId, setSpeakerId] = useState<number | null>(null);
  const audibleKey = participants
    .filter((participant) => participant.id !== selfId && !participant.audio_muted)
    .map((participant) => participant.id)
    .join(",");

  useEffect(() => {
    const meters = new Map<number, LevelMeter>();
    for (const id of audibleKey ? audibleKey.split(",").map(Number) : []) {
      const stream = streams[id];
      if (stream?.getAudioTracks().length) meters.set(id, createLevelMeter(stream));
    }
    if (meters.size === 0) return;
    const talkingSince = new Map<number, number>();
    const promoted = new Set<number>();
    const timer = setInterval(() => {
      const now = performance.now();
      for (const [id, meter] of meters) {
        if (meter.rms() <= SPEAKING_RMS) {
          talkingSince.delete(id);
          promoted.delete(id);
          continue;
        }
        const since = talkingSince.get(id) ?? now;
        talkingSince.set(id, since);
        if (now - since >= HOLD_MS && !promoted.has(id)) {
          promoted.add(id);
          setSpeakerId(id);
        }
      }
    }, POLL_MS);
    return () => {
      clearInterval(timer);
      for (const meter of meters.values()) meter.dispose();
    };
  }, [streams, audibleKey]);

  return speakerId;
}
