"use client";

import { MtgMicOnIcon } from "@/shared/icons/generated/MtgMicOnIcon";
import styles from "./AudioLevelIcon.module.css";
import { useAudioLevel } from "./useAudioLevel";

/**
 * `.audio-voip-active-icon` (08-prejoin-and-live-media.md, PRD §7.10.4): the white
 * unmuted-mic outline whose capsule fills `#23D959` from the bottom with the input
 * level. Used by the pre-join controls and the room toolbar; only this icon
 * re-renders on every level change.
 */
export function AudioLevelIcon({ stream }: { stream: MediaStream | null }) {
  const level = useAudioLevel(stream);
  return (
    <span className={styles.icon}>
      <MtgMicOnIcon />
      <span className={styles.inner} aria-hidden>
        <span className={styles.level} style={{ height: `${Math.round(level * 100)}%` }} />
      </span>
    </span>
  );
}
