import type { ReactNode } from "react";
import clsx from "clsx";
import styles from "./DetailValue.module.css";

/** One value line of a detail row: `p` 14px/21px #232333 with 4px above and below (PRD §7.8.2). */
export function DetailValue({ className, children }: { className?: string; children: ReactNode }) {
  return <p className={clsx(styles.value, className)}>{children}</p>;
}
