"use client";

import { format } from "date-fns";
import { SchDpNextMonthIcon } from "@/shared/icons/generated/SchDpNextMonthIcon";
import { SchDpNextYearIcon } from "@/shared/icons/generated/SchDpNextYearIcon";
import { SchDpPrevMonthIcon } from "@/shared/icons/generated/SchDpPrevMonthIcon";
import { SchDpPrevYearIcon } from "@/shared/icons/generated/SchDpPrevYearIcon";
import { IconButton } from "@/shared/ui/IconButton";
import type { useDatePicker } from "../../../hooks/useDatePicker";
import { decadeStart } from "../../../utils/calendar";
import styles from "./DatePicker.module.css";

/** « ‹ October 2026 › » — month/year labels switch views; the year view shows `2020 - 2029`. */
export function DatePickerHeader({ picker }: { picker: ReturnType<typeof useDatePicker> }) {
  const { view, month, shiftMonths, shiftYears, setView } = picker;
  const yearStep = view === "year" ? 10 : 1;
  const decade = decadeStart(month.getFullYear());

  return (
    <div className={styles.header}>
      <span className={styles.prev}>
        <IconButton size="sm" label="Previous Year" icon={<SchDpPrevYearIcon />} className={styles.navButton} onClick={() => shiftYears(-yearStep)} />
        {view === "day" ? (
          <IconButton size="sm" label="Previous Month" icon={<SchDpPrevMonthIcon />} className={styles.navButton} onClick={() => shiftMonths(-1)} />
        ) : null}
      </span>
      {view === "year" ? (
        <span className={styles.headerLabel}>{`${decade} - ${decade + 9}`}</span>
      ) : (
        <>
          {view === "day" ? (
            <button type="button" className={styles.headerButton} onClick={() => setView("month")}>
              {format(month, "MMMM")}
            </button>
          ) : null}
          <button type="button" className={styles.headerButton} onClick={() => setView("year")}>
            {format(month, "yyyy")}
          </button>
        </>
      )}
      <span className={styles.next}>
        {view === "day" ? (
          <IconButton size="sm" label="Next Month" icon={<SchDpNextMonthIcon />} className={styles.navButton} onClick={() => shiftMonths(1)} />
        ) : null}
        <IconButton size="sm" label="Next Year" icon={<SchDpNextYearIcon />} className={styles.navButton} onClick={() => shiftYears(yearStep)} />
      </span>
    </div>
  );
}
