"use client";

import { useRef, useState } from "react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { HomeCalChevronDownIcon } from "@/shared/icons/generated/HomeCalChevronDownIcon";
import { HomeCalOpenCalendarIcon } from "@/shared/icons/generated/HomeCalOpenCalendarIcon";
import { formatRelativeDayLabel } from "@/shared/lib/format";
import { routes } from "@/shared/lib/routes";
import touch from "@/shared/styles/touch.module.css";
import { IconButton } from "@/shared/ui";
import { DayPicker } from "../day-picker/DayPicker";
import styles from "./DateHeader.module.css";

interface DateHeaderProps {
  day: Date;
  today: Date;
  onSelectDay: (day: Date) => void;
}

/**
 * `.date-operation` (PRD §7.1.6): the selected-day button (opens the day picker, chevron flips)
 * and Open Calendar, which goes to the Meetings tab (DV12).
 */
export function DateHeader({ day, today, onSelectDay }: DateHeaderProps) {
  const router = useRouter();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const label = formatRelativeDayLabel(day, today);

  return (
    <div className={styles.dateRow}>
      <div className={styles.dayCell}>
        <button
          ref={buttonRef}
          type="button"
          aria-label={`Select calendar date: ${label}`}
          aria-haspopup="dialog"
          aria-expanded={pickerOpen}
          className={clsx(styles.dateButton, touch.target)}
          onClick={() => setPickerOpen((open) => !open)}
        >
          {label}
          <HomeCalChevronDownIcon className={clsx(styles.dateChevron, { [styles.dateChevronOpen ?? ""]: pickerOpen })} />
        </button>
      </div>
      <IconButton
        label="Open Calendar"
        size="sm"
        icon={<HomeCalOpenCalendarIcon />}
        className={touch.target}
        onClick={() => router.push(routes.meetings())}
      />
      <DayPicker
        open={pickerOpen}
        anchorRef={buttonRef}
        selected={day}
        today={today}
        onSelect={(next) => {
          onSelectDay(next);
          setPickerOpen(false);
        }}
        onClose={() => setPickerOpen(false)}
      />
    </div>
  );
}
