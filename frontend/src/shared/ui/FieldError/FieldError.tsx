import type { ReactNode } from "react";
import clsx from "clsx";
import { SchErrorCircleIcon } from "@/shared/icons/generated/SchErrorCircleIcon";
import styles from "./FieldError.module.css";

/** zoom-ui form error row: 12px error circle + 12/16 #DA1639 text, 4px below the field (PRD §5.8.4). */
export function FieldError({ id, children, className }: { id?: string; children: ReactNode; className?: string }) {
  return (
    <div id={id} role="alert" className={clsx(styles.error, className)}>
      <SchErrorCircleIcon width={12} height={12} className={styles.icon} />
      <span className={styles.text}>{children}</span>
    </div>
  );
}
