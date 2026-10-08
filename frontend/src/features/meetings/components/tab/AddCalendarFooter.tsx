"use client";

import { MtgMeetingsAddCalendarIcon } from "@/shared/icons/generated/MtgMeetingsAddCalendarIcon";
import { HoverPopover } from "@/shared/ui/HoverPopover";
import { useToast } from "@/shared/ui/Toast";
import styles from "./AddCalendarFooter.module.css";

const POPOVER_TEXT = "Connect to your work or personal calendar to view all upcoming meetings here";

/** "Add a calendar" footer with its hover popover (PRD §7.4.2). Calendar connect is static scope. */
export function AddCalendarFooter() {
  const toast = useToast();
  return (
    <>
      <div className={styles.divider} />
      <div className={styles.footer}>
        <HoverPopover content={POPOVER_TEXT} variant="prism" placement="top" offset={8} className={styles.popover}>
          <button type="button" className={styles.link} onClick={toast.notAvailable}>
            <MtgMeetingsAddCalendarIcon className={styles.icon} />
            <span className={styles.text}>Add a calendar</span>
          </button>
        </HoverPopover>
      </div>
    </>
  );
}
