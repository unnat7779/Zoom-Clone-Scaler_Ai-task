"use client";

import { useRef } from "react";
import clsx from "clsx";
import { format, isSameDay, isSameMonth } from "date-fns";
import { DAYS_PER_WEEK, WEEKDAYS, monthGrid } from "@/shared/lib/calendar";
import { toDateKey } from "@/shared/lib/format";
import { Tooltip } from "../Tooltip";
import { useDayFocus } from "./useDayFocus";
import styles from "./DayGrid.module.css";

export interface DayGridProps {
  /** any day of the visible month */
  month: Date;
  selected: Date;
  today: Date;
  onSelect: (day: Date) => void;
  /** days that cannot be picked (Schedule: before today) → `#ADB1B8`, not-allowed */
  isDisabled?: (day: Date) => boolean;
  /** lets the keyboard leave the month (Home day picker): called with the month to show */
  onMonthChange?: (month: Date) => void;
  className?: string;
}

const rowsOf = <T,>(items: T[]) =>
  Array.from({ length: items.length / DAYS_PER_WEEK }, (_, row) => items.slice(row * DAYS_PER_WEEK, (row + 1) * DAYS_PER_WEEK));

/**
 * `.zoom-date-table` (PRD §7.1.7, §7.6.6): weekday initials with their full name in a dark tooltip,
 * then 6 × 7 day cells 32×32 on a 36×40 pitch. Arrow keys move a roving focus; Enter/Space pick.
 */
export function DayGrid({ month, selected, today, onSelect, isDisabled, onMonthChange, className }: DayGridProps) {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const days = monthGrid(month);
  const disabled = days.map((day) => isDisabled?.(day) ?? false);
  const focus = useDayFocus({ gridRef, days, selected, onMonthChange });
  const focusedIndex = days.findIndex((day) => isSameDay(day, focus.focused));
  const firstOfMonth = days.findIndex((day, index) => !disabled[index] && isSameMonth(day, month));
  const tabStop = focusedIndex >= 0 ? focusedIndex : firstOfMonth >= 0 ? firstOfMonth : Math.max(disabled.indexOf(false), 0);

  return (
    <div ref={gridRef} role="grid" aria-label={format(month, "MMMM yyyy")} className={clsx(styles.grid, className)} onKeyDown={focus.onKeyDown}>
      <div role="row" className={styles.row}>
        {WEEKDAYS.map((weekday) => (
          <Tooltip key={weekday.name} content={weekday.name} variant="dark" placement="top" offset={4}>
            <span role="columnheader" aria-label={weekday.name} className={styles.weekday}>
              {weekday.short}
            </span>
          </Tooltip>
        ))}
      </div>
      {rowsOf(days).map((week, row) => (
        <div key={toDateKey(week[0] ?? month)} role="row" className={styles.row}>
          {week.map((day, column) => {
            const index = row * DAYS_PER_WEEK + column;
            const isSelected = isSameDay(day, selected);
            const off = disabled[index] ?? false;
            return (
              <button
                key={toDateKey(day)}
                type="button"
                role="gridcell"
                data-day={toDateKey(day)}
                tabIndex={index === tabStop ? 0 : -1}
                aria-label={`${format(day, "EEEE,MMMM d,yyyy")} ${isSelected ? "selected" : "not selected"}`}
                aria-selected={isSelected}
                aria-disabled={off || undefined}
                className={clsx(styles.cell, {
                  [styles.disabled ?? ""]: off,
                  [styles.outside ?? ""]: !off && !isSameMonth(day, month),
                  [styles.today ?? ""]: isSameDay(day, today) && !isSelected,
                  [styles.selected ?? ""]: isSelected,
                })}
                onClick={off ? undefined : () => onSelect(day)}
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
