"use client";

import { PortalFooter, PortalHeader } from "@/features/portal";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import { InvalidLinkMessage } from "./InvalidLinkMessage";
import styles from "./InvalidLink.module.css";

interface InvalidLinkPageProps {
  /** default "This meeting link is invalid (3,001)"; `/j/{bad}` uses "Invalid meeting ID. (3,000)" */
  message?: string;
  onRetry?: () => void;
}

/**
 * zoom.us error page (`/wc/{n}/join` without `fromPWA`, `/j/{bad}`): fixed 104px header,
 * 400px white error area, dark footer — and the title "Error - Zoom" (PRD §7.10.1).
 */
export function InvalidLinkPage({ message, onRetry }: InvalidLinkPageProps) {
  useDocumentTitle("Error - Zoom");
  return (
    <div className={styles.portalPage}>
      <PortalHeader />
      <main className={styles.portalContent}>
        <InvalidLinkMessage variant="portal" message={message} onRetry={onRetry} />
      </main>
      <PortalFooter />
    </div>
  );
}
