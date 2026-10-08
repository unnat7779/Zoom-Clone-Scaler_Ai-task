"use client";

import { Checkbox } from "@/shared/ui/Checkbox";
import { Radio, RadioGroup } from "@/shared/ui/Radio";
import { Select } from "@/shared/ui/Select";
import type { Recurrence } from "../../hooks/useRecurrence";
import { type MonthlyMode, WEEKDAY_NAMES, WEEK_ORDINALS } from "../../utils/recurrence";
import controls from "../controls/controls.module.css";
import { FormRow } from "../form/FormRow";
import styles from "./Recurrence.module.css";

const DAY_OPTIONS = Array.from({ length: 31 }, (_, index) => ({ value: String(index + 1), label: String(index + 1) }));
const ORDINAL_OPTIONS = WEEK_ORDINALS.map((label, index) => ({ value: String(index + 1), label }));
const WEEKDAY_OPTIONS = WEEKDAY_NAMES.map((label, index) => ({ value: String(index), label }));

/**
 * "Occurs on" (03-schedule.md §8.1): Weekly → Sun…Sat checkboxes (the last checked day cannot be
 * unticked); Monthly → "Day [n] of the month" or "[First] [Sunday] of the month".
 */
export function RecurrenceOccursOn({ recurrence }: { recurrence: Recurrence }) {
  const { rule, update } = recurrence;
  const toggleDay = (day: number, checked: boolean) =>
    update({ weekdays: checked ? [...rule.weekdays, day] : rule.weekdays.filter((value) => value !== day) });
  const byWeekday = rule.monthlyMode === "weekday";

  return (
    <FormRow className={styles.subRow} label="Occurs on">
      {rule.type === "weekly" ? (
        <div className={styles.weekdays}>
          {WEEKDAY_NAMES.map((name, day) => {
            const checked = rule.weekdays.includes(day);
            return (
              <Checkbox
                key={name}
                legacyLabel
                label={name.slice(0, 3)}
                checked={checked}
                disabled={checked && rule.weekdays.length === 1}
                onChange={(next) => toggleDay(day, next)}
              />
            );
          })}
        </div>
      ) : (
        <RadioGroup<MonthlyMode> value={rule.monthlyMode} onChange={(monthlyMode) => update({ monthlyMode })} direction="vertical" aria-label="Occurs on" className={styles.monthly}>
          <div className={styles.inline}>
            <Radio value="day" label="Day" />
            <Select aria-label="Day of the month" className={controls.short} disabled={byWeekday} options={DAY_OPTIONS} value={String(rule.monthDay)} onChange={(day) => update({ monthDay: Number(day) })} />
            <span className={styles.unit}>of the month</span>
          </div>
          <div className={styles.inline}>
            <Radio value="weekday" aria-label="Weekday of the month" />
            <Select aria-label="Week of the month" className={controls.middle} disabled={!byWeekday} options={ORDINAL_OPTIONS} value={String(rule.weekOfMonth)} onChange={(week) => update({ weekOfMonth: Number(week) })} />
            <Select aria-label="Weekday" className={controls.middle} disabled={!byWeekday} options={WEEKDAY_OPTIONS} value={String(rule.weekday)} onChange={(day) => update({ weekday: Number(day) })} />
            <span className={styles.unit}>of the month</span>
          </div>
        </RadioGroup>
      )}
    </FormRow>
  );
}
