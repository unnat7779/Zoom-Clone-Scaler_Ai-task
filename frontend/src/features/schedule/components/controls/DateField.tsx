"use client";

import { type KeyboardEvent, useRef, useState } from "react";
import { parseDateKey } from "@/shared/lib/calendar";
import { toDateKey } from "@/shared/lib/format";
import { SchCalendarIcon } from "@/shared/icons/generated/SchCalendarIcon";
import { Popover } from "@/shared/ui/Popover";
import { formatScheduleDate } from "../../utils/calendar";
import { DatePickerPanel } from "./datepicker/DatePickerPanel";
import pickerStyles from "./datepicker/DatePicker.module.css";
import styles from "./DateField.module.css";

interface DateFieldProps {
  /** `YYYY-MM-DD` */
  value: string;
  onChange: (value: string) => void;
  today: Date;
  disabled?: boolean;
  /** id of the row's error ("The start time has already passed") */
  describedBy?: string;
  "aria-label"?: string;
}

/** 240×32 `MM/DD/YYYY` field with the calendar icon; opens the date picker below (or above). */
export function DateField({ value, onChange, today, disabled = false, describedBy, "aria-label": ariaLabel = "Meeting date" }: DateFieldProps) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const selected = parseDateKey(value);

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "ArrowDown") return;
    event.preventDefault();
    setOpen(true);
  };

  return (
    <>
      <button
        ref={anchorRef}
        type="button"
        aria-label={`${ariaLabel}, ${formatScheduleDate(selected)}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-describedby={describedBy}
        disabled={disabled}
        className={styles.field}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={onKeyDown}
      >
        <span className={styles.label}>{formatScheduleDate(selected)}</span>
        <SchCalendarIcon className={styles.icon} />
      </button>
      <Popover
        open={open}
        onClose={() => setOpen(false)}
        anchorRef={anchorRef}
        placement="bottom-start"
        offset={4}
        variant="plain"
        motion="none"
        trapFocus
        aria-label="Choose a date"
        className={pickerStyles.popover}
      >
        <DatePickerPanel
          selected={selected}
          today={today}
          onSelect={(date) => {
            onChange(toDateKey(date));
            setOpen(false);
            anchorRef.current?.focus();
          }}
        />
      </Popover>
    </>
  );
}
