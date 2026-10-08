import type { ReactNode } from "react";
import Link from "next/link";
import { SchBackChevronIcon } from "@/shared/icons/generated/SchBackChevronIcon";
import styles from "./PortalPageHead.module.css";

interface PortalPageHeadProps {
  title: ReactNode;
  /** "Back to Meetings" target */
  backHref: string;
  backLabel?: string;
}

/**
 * zoom.us page head (PRD §7.6.1): `‹ Back to Meetings` link (14px chevron, 5px gap,
 * .zoom-link states) and the 600 20px/22px H1 with `margin: 20px 0 32px`.
 */
export function PortalPageHead({ title, backHref, backLabel = "Back to Meetings" }: PortalPageHeadProps) {
  return (
    <div className={styles.head}>
      <div className={styles.backRow}>
        <Link href={backHref} className={styles.back}>
          <SchBackChevronIcon className={styles.chevron} />
          {backLabel}
        </Link>
      </div>
      <h1 className={styles.title}>{title}</h1>
    </div>
  );
}
