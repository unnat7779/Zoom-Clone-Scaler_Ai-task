"use client";

import type { PreviewMedia } from "../../hooks/usePreviewMedia";
import { AvatarPlaceholder } from "./AvatarPlaceholder";
import { BackgroundsButton } from "./BackgroundsButton";
import { PreviewControls } from "./PreviewControls";
import { PreviewErrorBanner } from "./PreviewErrorBanner";
import { PreviewVideo } from "./PreviewVideo";
import styles from "./PreviewCard.module.css";

/**
 * `.preview-video` 700×394 (PRD §7.10.2): mirrored self view (or the avatar placeholder),
 * the Mute / Video control pill, "Backgrounds" once the camera is available, and Zoom's
 * camera / microphone error banner at the top.
 */
export function PreviewCard({ media }: { media: PreviewMedia }) {
  return (
    <div className={styles.card}>
      {media.videoStream ? <PreviewVideo stream={media.videoStream} /> : <AvatarPlaceholder />}
      <PreviewControls media={media} />
      {media.camera.status === "granted" ? <BackgroundsButton /> : null}
      {media.error ? <PreviewErrorBanner error={media.error} /> : null}
    </div>
  );
}
