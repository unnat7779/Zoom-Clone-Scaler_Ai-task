"use client";

import { RoomWarningIcon } from "@/shared/icons/generated/RoomWarningIcon";
import { useLocalControls } from "../../realtime/useLocalControls";
import { useRoomUi } from "../../state/useRoomUi";
import { RoomToastCard } from "./RoomToastCard";
import styles from "./Notifications.module.css";

/** Persistent, closable bar while the microphone and/or camera is blocked (PRD §8.13 [M]). */
export function PermissionBar() {
  const { audioBlocked, videoBlocked, retry } = useLocalControls();
  const { permissionBarClosed, closePermissionBar } = useRoomUi();
  if (permissionBarClosed || (!audioBlocked && !videoBlocked)) return null;

  const microphone = (
    <button type="button" className={styles.link} onClick={() => retry("audio")}>
      microphone
    </button>
  );
  const camera = (
    <button type="button" className={styles.link} onClick={() => retry("video")}>
      camera
    </button>
  );
  return (
    <RoomToastCard onClose={closePermissionBar}>
      <RoomWarningIcon className={styles.warning} />
      <span>
        Please enable access to your {audioBlocked ? microphone : null}
        {audioBlocked && videoBlocked ? " and " : null}
        {videoBlocked ? camera : null} for the best experience.
      </span>
    </RoomToastCard>
  );
}
