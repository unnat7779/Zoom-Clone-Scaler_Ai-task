"use client";

import { useRoomContext } from "../../realtime/roomContext";
import { PermissionBar } from "./PermissionBar";
import { RoomToastCard } from "./RoomToastCard";
import styles from "./Notifications.module.css";

/** Top-centre stack 10px under the header (y=58), re-centred over the stage. */
export function NotificationLayer() {
  const { toasts } = useRoomContext();
  return (
    <div className={styles.layer} aria-live="polite">
      <PermissionBar />
      {toasts.toasts.map((toast) => (
        <RoomToastCard key={toast.id} onClose={toast.closable ? () => toasts.dismiss(toast.id) : undefined}>
          {toast.message}
        </RoomToastCard>
      ))}
    </div>
  );
}
