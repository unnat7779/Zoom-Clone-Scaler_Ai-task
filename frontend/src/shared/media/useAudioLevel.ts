"use client";

import { useEffect, useState } from "react";
import { createLevelMeter, rmsToLevel } from "./levelMeter";

/** ignore changes smaller than this so the meter does not re-render on noise */
const MIN_STEP = 0.01;

/**
 * Microphone level 0..1 for the audio-level meter (PRD §7.10.4): AnalyserNode RMS,
 * sampled every animation frame. 0 while `enabled` is false (muted) or there is no audio track.
 */
export function useAudioLevel(stream: MediaStream | null, enabled = true): number {
  const [level, setLevel] = useState(0);
  const active = enabled && Boolean(stream?.getAudioTracks().length);

  useEffect(() => {
    if (!active || !stream) return;
    const meter = createLevelMeter(stream);
    let frame = 0;
    let last = -1;
    const tick = () => {
      const next = rmsToLevel(meter.rms());
      if (Math.abs(next - last) >= MIN_STEP) {
        last = next;
        setLevel(next);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      meter.dispose();
    };
  }, [active, stream]);

  return active ? level : 0;
}
