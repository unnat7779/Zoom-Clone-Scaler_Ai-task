"use client";

import { usePortalHeaderOnly } from "@/features/portal";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import styles from "./InvalidMeetingPage.module.css";

/**
 * `/meeting/{unknown}` (PRD §7.8.6): "Invalid meeting ID. (3,001)" under the portal header,
 * without the side menu (PortalShell's header-only layout), then the footer. Title "Error - Zoom".
 */
export function InvalidMeetingPage() {
  usePortalHeaderOnly();
  useDocumentTitle("Error - Zoom");

  return (
    <div className={styles.invalid} role="alert">
      <span className={styles.text}>Invalid meeting ID. (3,001)</span>
    </div>
  );
}
