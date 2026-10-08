import type { ReactNode } from "react";
import styles from "./DetailRow.module.css";

/** 13/16 #232333 detail line under the topic, `margin: 16px 0` (PRD §7.4.3). */
export function DetailRow({ children }: { children: ReactNode }) {
  return <div className={styles.row}>{children}</div>;
}
