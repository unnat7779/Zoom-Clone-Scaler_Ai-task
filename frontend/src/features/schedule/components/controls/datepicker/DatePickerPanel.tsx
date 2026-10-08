"use client";

import { isBefore, startOfDay } from "date-fns";
import { DayGrid } from "@/shared/ui/DayGrid";
import { useDatePicker } from "../../../hooks/useDatePicker";
import { DatePickerHeader } from "./DatePickerHeader";
import { MonthGrid } from "./MonthGrid";
import { YearGrid } from "./YearGrid";
import styles from "./DatePicker.module.css";

interface DatePickerPanelProps {
  selected: Date;
  today: Date;
  onSelect: (date: Date) => void;
}

/** `.zoom-date-panel__body` (278 wide, padding 15): header + the shared day grid (past days disabled), month or year grid. */
export function DatePickerPanel({ selected, today, onSelect }: DatePickerPanelProps) {
  const picker = useDatePicker(selected);
  const firstAllowed = startOfDay(today);
  return (
    <div className={styles.body}>
      <DatePickerHeader picker={picker} />
      {picker.view === "day" ? (
        <DayGrid
          month={picker.month}
          selected={selected}
          today={today}
          isDisabled={(day) => isBefore(day, firstAllowed)}
          onSelect={onSelect}
          className={styles.dayGrid}
        />
      ) : picker.view === "month" ? (
        <MonthGrid visibleMonth={picker.month} selected={selected} today={today} onPick={picker.pickMonth} />
      ) : (
        <YearGrid visibleMonth={picker.month} selected={selected} today={today} onPick={picker.pickYear} />
      )}
    </div>
  );
}
