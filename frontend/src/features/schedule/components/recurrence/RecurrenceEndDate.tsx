"use client";

import { parseDateKey } from "@/shared/lib/calendar";
import { toDateKey } from "@/shared/lib/format";
import { Radio, RadioGroup } from "@/shared/ui/Radio";
import { Select } from "@/shared/ui/Select";
import type { Recurrence } from "../../hooks/useRecurrence";
import { MAX_OCCURRENCES, type RecurrenceEnd } from "../../utils/recurrence";
import { DateField } from "../controls/DateField";
import controls from "../controls/controls.module.css";
import { FormRow } from "../form/FormRow";
import styles from "./Recurrence.module.css";

const COUNT_OPTIONS = Array.from({ length: MAX_OCCURRENCES }, (_, index) => ({ value: String(index + 1), label: String(index + 1) }));

/** "End date": No end time · By [240px date] (default ✓) · next line After [n] occurrences (row gap 10). */
export function RecurrenceEndDate({ recurrence, today }: { recurrence: Recurrence; today: Date }) {
  const { rule, update, endDate } = recurrence;
  return (
    <FormRow className={styles.subRow} label="End date">
      <RadioGroup<RecurrenceEnd> value={rule.end} onChange={(end) => update({ end })} aria-label="End date" className={styles.endDate}>
        <Radio value="never" label="No end time" />
        <div className={styles.inline}>
          <Radio value="by" label="By" />
          <DateField
            aria-label="End date"
            value={toDateKey(endDate)}
            today={today}
            disabled={rule.end !== "by"}
            onChange={(date) => update({ endDate: parseDateKey(date) })}
          />
        </div>
        <div className={styles.inline}>
          <Radio value="after" label="After" />
          <Select
            aria-label="Occurrences"
            className={controls.short}
            disabled={rule.end !== "after"}
            options={COUNT_OPTIONS}
            value={String(rule.count)}
            onChange={(count) => update({ count: Number(count) })}
          />
          <span className={styles.unit}>occurrences</span>
        </div>
      </RadioGroup>
    </FormRow>
  );
}
