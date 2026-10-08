import type { ReactNode } from "react";
import styles from "./Notifications.module.css";

interface RoomToastCardProps {
  children: ReactNode;
  onClose?: () => void;
}

/** One dark notification (`.notification-message-wrap`), optionally closable. */
export function RoomToastCard({ children, onClose }: RoomToastCardProps) {
  return (
    <div className={styles.toast} role="status">
      <div className={styles.body}>
        <div className={styles.text}>{children}</div>
        {onClose ? (
          <button type="button" className={styles.close} aria-label="Close" onClick={onClose} />
        ) : (
          <div className={styles.buttons} />
        )}
      </div>
    </div>
  );
}
