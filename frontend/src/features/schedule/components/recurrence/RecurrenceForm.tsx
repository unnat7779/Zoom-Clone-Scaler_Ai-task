"use client";

import clsx from "clsx";
import { Select } from "@/shared/ui/Select";
import type { Recurrence } from "../../hooks/useRecurrence";
import type { RecurrenceType } from "../../utils/recurrence";
import controls from "../controls/controls.module.css";
import { FormRow } from "../form/FormRow";
import { RecurrenceEndDate } from "./RecurrenceEndDate";
import { RecurrenceOccursOn } from "./RecurrenceOccursOn";
import styles from "./Recurrence.module.css";

const TYPES: { value: RecurrenceType; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "none", label: "No Fixed Time" },
];

/** "Repeat every" range and unit per recurrence (03-schedule.md §7). */
const REPEAT: Record<Exclude<RecurrenceType, "none">, { max: number; unit: string }> = {
  daily: { max: 99, unit: "day(s)" },
  weekly: { max: 50, unit: "week(s)" },
  monthly: { max: 10, unit: "month(s)" },
};

const numberOptions = (max: number) => Array.from({ length: max }, (_, index) => ({ value: String(index + 1), label: String(index + 1) }));

/** Nested rows under "Recurring meeting": Recurrence · Repeat every · Occurs on · End date (57px pitch). */
export function RecurrenceForm({ recurrence, today }: { recurrence: Recurrence; today: Date }) {
  const { rule, update } = recurrence;
  const repeat = rule.type === "none" ? null : REPEAT[rule.type];
  return (
    <div className={clsx(styles.form, { [styles.noFixedTime ?? ""]: rule.type === "none" })}>
      <FormRow
        className={styles.subRow}
        label={
          <>
            Recurrence<span className={styles.asterisk}>*</span>
          </>
        }
      >
        <Select
          aria-label="Recurrence"
          className={controls.recurrence}
          options={TYPES}
          value={rule.type}
          onChange={(type) => update({ type, interval: 1 })}
        />
      </FormRow>
      {repeat ? (
        <>
          <FormRow className={styles.subRow} label="Repeat every">
            <div className={styles.inline}>
              <Select
                aria-label="Repeat every"
                className={controls.short}
                options={numberOptions(repeat.max)}
                value={String(rule.interval)}
                onChange={(interval) => update({ interval: Number(interval) })}
              />
              <span className={styles.unit}>{repeat.unit}</span>
            </div>
          </FormRow>
          {rule.type !== "daily" ? <RecurrenceOccursOn recurrence={recurrence} /> : null}
          <RecurrenceEndDate recurrence={recurrence} today={today} />
        </>
      ) : null}
    </div>
  );
}
