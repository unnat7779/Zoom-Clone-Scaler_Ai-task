import type { ReactNode } from "react";
import styles from "./DetailItem.module.css";

/** `.zm-form-item`: 160px label column (14/24 #131619), value at +160, 20px below (PRD §7.8.2). */
export function DetailItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={styles.item}>
      <div className={styles.label}>{label}</div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
