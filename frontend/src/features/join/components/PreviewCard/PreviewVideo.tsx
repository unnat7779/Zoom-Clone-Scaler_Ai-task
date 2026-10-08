"use client";

import { useCallback } from "react";
import styles from "./PreviewCard.module.css";

/** Mirrored local camera, `object-fit: cover` over the whole card. */
export function PreviewVideo({ stream }: { stream: MediaStream }) {
  const attach = useCallback(
    (video: HTMLVideoElement | null) => {
      if (video && video.srcObject !== stream) video.srcObject = stream;
    },
    [stream],
  );
  return <video ref={attach} className={styles.video} autoPlay muted playsInline aria-label="Your video preview" />;
}
