"use client";

import Link from "next/link";
import clsx from "clsx";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import { routes } from "@/shared/lib/routes";
import { StaticButton } from "@/shared/ui/StaticButton";
import { LaunchFooter } from "./LaunchFooter";
import { LaunchHeader } from "./LaunchHeader";
import styles from "./LaunchView.module.css";

/** Zoom renames the tab once the app launch has fired (04-join.md §4). */
const LAUNCHED_TITLE = "Join from Zoom Workplace app - Zoom";
const LAUNCHED_TITLE_DELAY_MS = 500;

interface LaunchViewProps {
  number: string;
  /** invite token from the link, forwarded to the pre-join page */
  pwd: string | null;
}

/**
 * zoom.us/j launch page (PRD §7.9). Clone mapping: "Join from Zoom Workplace app" opens the
 * pre-join inside the Workplace shell (`fromPWA=1`, our app *is* the Workplace app); "Join from
 * browser" opens it full viewport. Phones (≤767) get Zoom's mobile page: "Join from App", the
 * browser note, "Or" and "Download from App Store" (static) instead of the two text lines.
 */
export function LaunchView({ number, pwd }: LaunchViewProps) {
  useDocumentTitle(LAUNCHED_TITLE, LAUNCHED_TITLE_DELAY_MS);
  const staticLink = (label: string) => <StaticButton className={styles.textLink}>{label}</StaticButton>;

  return (
    <div className={styles.page}>
      <LaunchHeader />
      <main className={styles.main}>
        <span className={styles.spinner} aria-hidden />
        <h1 className={styles.title}>Join meeting</h1>
        <div className={styles.actions}>
          <Link href={routes.preJoin(number, { pwd, fromPWA: true })} className={styles.primary}>
            <span className={styles.desktopOnly}>Join from Zoom Workplace app</span>
            <span className={styles.phoneOnly}>Join from App</span>
          </Link>
          <Link href={routes.preJoin(number, { pwd })} className={styles.secondary}>
            Join from browser
          </Link>
          <p className={clsx(styles.note, styles.phoneOnly)}>Some features will be unavailable in the browser</p>
          <p className={clsx(styles.or, styles.phoneOnly)}>Or</p>
          <StaticButton className={clsx(styles.secondary, styles.phoneOnly)}>Download from App Store</StaticButton>
        </div>
        <div className={styles.desktopOnly}>
          <hr className={styles.spacer} />
          <p className={styles.line}>
            Don’t have the Zoom Workplace app installed? {staticLink("Download Now")}
          </p>
          <p className={styles.line}>
            By joining a meeting, you agree to our {staticLink("Terms of Service")} and {staticLink("Privacy Statement")}
          </p>
        </div>
      </main>
      <LaunchFooter />
    </div>
  );
}
