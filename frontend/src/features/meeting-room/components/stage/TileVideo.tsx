"use client";

import clsx from "clsx";
import { useMediaElement } from "../../hooks/useMediaElement";
import styles from "./VideoTile.module.css";

/** Camera picture of a tile; muted (audio plays through RemoteAudio), self view mirrored. */
export function TileVideo({ stream, mirrored }: { stream: MediaStream; mirrored: boolean }) {
  const ref = useMediaElement<HTMLVideoElement>(stream);
  return <video ref={ref} className={clsx(styles.video, mirrored && styles.mirrored)} autoPlay playsInline muted />;
}
