"use client";

import { useEscapeKey } from "@/shared/hooks";
import styles from "./LeaveBar.module.css";

/** "☐ Give feedback" (static) + Cancel; Cancel or Escape restores the toolbar. */
export function LeaveBar({ onCancel: cancel }: { onCancel: () => void }) {
  useEscapeKey(cancel, true);
  return (
    <div className={styles.bar}>
      <label className={styles.feedback}>
        <input type="checkbox" className={styles.box} />
        Give feedback
      </label>
      <button type="button" className={styles.cancel} onClick={cancel}>
        Cancel
      </button>
    </div>
  );
}
