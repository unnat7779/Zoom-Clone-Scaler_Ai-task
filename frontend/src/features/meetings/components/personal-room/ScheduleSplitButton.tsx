"use client";

import { useRef } from "react";
import Link from "next/link";
import { useToggle } from "@/shared/hooks/useToggle";
import { SchPlusIcon } from "@/shared/icons/generated/SchPlusIcon";
import { SchSelectChevronIcon } from "@/shared/icons/generated/SchSelectChevronIcon";
import { routes } from "@/shared/lib/routes";
import { Popover } from "@/shared/ui/Popover";
import { ScheduleOptionsMenu } from "./ScheduleOptionsMenu";
import styles from "./ScheduleSplitButton.module.css";

/**
 * "+ Schedule a Meeting" split button of the portal Meetings page (02-meetings.md §B.2): the main
 * part opens `/meeting/schedule` in the same tab; the caret toggles the schedule-options menu.
 */
export function ScheduleSplitButton() {
  const caretRef = useRef<HTMLButtonElement | null>(null);
  const [open, toggle, setOpen] = useToggle(false);
  const close = () => setOpen(false);
  return (
    <div className={styles.group} role="group" aria-label="Schedule a meeting">
      <Link href={routes.schedule()} className={styles.main}>
        <SchPlusIcon className={styles.plus} />
        Schedule a Meeting
      </Link>
      <button
        ref={caretRef}
        type="button"
        className={styles.caret}
        aria-label="Toggle dropdown"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={toggle}
      >
        <SchSelectChevronIcon className={styles.chevron} />
      </button>
      <Popover open={open} onClose={close} anchorRef={caretRef} placement="bottom-end" offset={4} variant="plain" motion="none">
        <ScheduleOptionsMenu onClose={close} />
      </Popover>
    </div>
  );
}
