import clsx from "clsx";
import { StaticButton } from "@/shared/ui/StaticButton";
import styles from "./PreJoinLayout.module.css";

/** "© 2026 Zoom Communications, Inc. All rights reserved. Privacy & Legal Policies | Send Report" (static links). */
export function PreJoinFooter({ className }: { className?: string }) {
  return (
    <footer className={clsx(styles.footer, className)}>
      © {new Date().getFullYear()} Zoom Communications, Inc. All rights reserved.{" "}
      <StaticButton className={styles.footerLink}>Privacy &amp; Legal Policies</StaticButton>
      <span className={styles.footerDivider} aria-hidden>
        |
      </span>
      <StaticButton className={styles.footerLink}>Send Report</StaticButton>
    </footer>
  );
}
