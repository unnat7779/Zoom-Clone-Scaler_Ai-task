"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { JoinChevronSmallLeftIcon } from "@/shared/icons/generated/JoinChevronSmallLeftIcon";
import { routes } from "@/shared/lib/routes";
import styles from "./WebClientPanel.module.css";

/**
 * In-shell web-client panel (PRD §7.2.8): fills the Workplace content card, white,
 * with Zoom's "‹ Back" button at (38,32) that returns to Home.
 */
export function WebClientPanel({ children }: { children: ReactNode }) {
  const router = useRouter();
  return (
    <div className={styles.panel}>
      <button type="button" className={styles.back} onClick={() => router.push(routes.home())}>
        <JoinChevronSmallLeftIcon size={20} className={styles.backIcon} />
        Back
      </button>
      {children}
    </div>
  );
}
