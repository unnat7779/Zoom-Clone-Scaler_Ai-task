"use client";

import clsx from "clsx";
import { PwaMyNotesIcon } from "@/shared/icons/generated/PwaMyNotesIcon";
import { PwaRecordIcon } from "@/shared/icons/generated/PwaRecordIcon";
import { PwaSmartSummaryIcon } from "@/shared/icons/generated/PwaSmartSummaryIcon";
import { useToast } from "@/shared/ui";
import styles from "./HubEntries.module.css";

const ENTRIES = [
  { label: "Recordings", Icon: PwaRecordIcon, tint: "record" },
  { label: "Summaries", Icon: PwaSmartSummaryIcon, tint: "ai" },
  { label: "My Notes", Icon: PwaMyNotesIcon, tint: "ai" },
] as const;

/** Hub entries row (PRD §7.1.5) — Static UI only: a click shows the demo toast. */
export function HubEntries() {
  const toast = useToast();
  return (
    <nav className={styles.row} aria-label="Hub">
      {ENTRIES.map(({ label, Icon, tint }) => (
        <button key={label} type="button" className={styles.entry} onClick={toast.notAvailable}>
          <span className={clsx(styles.iconWrap, styles[tint])}>
            <Icon />
          </span>
          <span className={styles.label}>{label}</span>
        </button>
      ))}
    </nav>
  );
}
