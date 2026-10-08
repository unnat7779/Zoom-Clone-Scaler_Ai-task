"use client";

import { format } from "date-fns";
import { SchDpNextMonthIcon } from "@/shared/icons/generated/SchDpNextMonthIcon";
import { SchDpNextYearIcon } from "@/shared/icons/generated/SchDpNextYearIcon";
import { SchDpPrevMonthIcon } from "@/shared/icons/generated/SchDpPrevMonthIcon";
import { SchDpPrevYearIcon } from "@/shared/icons/generated/SchDpPrevYearIcon";
import { IconButton } from "@/shared/ui";
import { DayGrid, useVisibleMonth } from "@/shared/ui/DayGrid";
import styles from "./DayPicker.module.css";

interface DayPickerPanelProps {
  selected: Date;
  today: Date;
  onSelect: (day: Date) => void;
}

/**
 * `.zoom-date-panel__body`: « ‹ "October 2026" › » header and the shared month table. Past days are
 * allowed; the keyboard may leave the month (arrows, Page Up / Down) and the view follows.
 */
export function DayPickerPanel({ selected, today, onSelect }: DayPickerPanelProps) {
  const view = useVisibleMonth(selected);
  return (
    <div className={styles.body}>
      <div className={styles.header}>
        <span className={styles.navGroup}>
          <IconButton size="sm" className={styles.navButton} label="Previous year" icon={<SchDpPrevYearIcon />} onClick={() => view.shiftYears(-1)} />
          <IconButton size="sm" className={styles.navButton} label="Previous month" icon={<SchDpPrevMonthIcon />} onClick={() => view.shiftMonths(-1)} />
        </span>
        <span className={styles.headerLabel} aria-live="polite">
          <span className={styles.labelButton}>{format(view.month, "MMMM")}</span>{" "}
          <span className={styles.labelButton}>{format(view.month, "yyyy")}</span>
        </span>
        <span className={styles.navGroup}>
          <IconButton size="sm" className={styles.navButton} label="Next month" icon={<SchDpNextMonthIcon />} onClick={() => view.shiftMonths(1)} />
          <IconButton size="sm" className={styles.navButton} label="Next year" icon={<SchDpNextYearIcon />} onClick={() => view.shiftYears(1)} />
        </span>
      </div>
      <DayGrid
        month={view.month}
        selected={selected}
        today={today}
        onSelect={onSelect}
        onMonthChange={view.showMonth}
        className={styles.grid}
      />
    </div>
  );
}
