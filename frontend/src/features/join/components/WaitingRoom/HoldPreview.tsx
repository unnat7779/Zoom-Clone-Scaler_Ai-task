"use client";

import clsx from "clsx";
import { PreviewVideo } from "../PreviewCard/PreviewVideo";
import styles from "./HoldPreview.module.css";

interface HoldPreviewProps {
  /** the camera picked on the pre-join page; null = video off → the display name */
  stream: MediaStream | null;
  name: string;
  /** in the shell the panel's "‹ Back" sits at the top-left, so the preview goes below it [D] */
  inShell: boolean;
}

/** `.waiting-room-preview`: 240×146 self view at (24,24), radius 8, while the guest waits. */
export function HoldPreview({ stream, name, inShell }: HoldPreviewProps) {
  return (
    <div className={clsx(styles.preview, inShell && styles.inShell)}>
      {stream ? <PreviewVideo stream={stream} /> : <span className={styles.name}>{name}</span>}
    </div>
  );
}
