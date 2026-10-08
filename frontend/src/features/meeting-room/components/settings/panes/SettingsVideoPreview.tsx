"use client";

import { RoomWarningIcon } from "@/shared/icons/generated/RoomWarningIcon";
import { useLocalControls } from "../../../realtime/useLocalControls";
import { TileVideo } from "../../stage/TileVideo";
import styles from "./SettingsVideoPreview.module.css";

/** Preview of Settings › Video / Background: the mirrored self view, else Zoom's "Unable to start video" card (room-17). */
export function SettingsVideoPreview() {
  const { selfVideoStream, retry } = useLocalControls();
  return (
    <div className={styles.preview}>
      {selfVideoStream ? (
        <TileVideo stream={selfVideoStream} mirrored />
      ) : (
        <div className={styles.message}>
          <RoomWarningIcon className={styles.icon} />
          <p>Unable to start video at this time.</p>
          <p>
            Please resolve the error and{" "}
            <button type="button" className={styles.link} onClick={() => retry("video")}>
              restart video.
            </button>
          </p>
        </div>
      )}
    </div>
  );
}
