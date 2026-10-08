import { Checkbox } from "@/shared/ui/Checkbox";
import type { Recurrence } from "../../hooks/useRecurrence";
import { FormRow } from "../form/FormRow";
import { RecurrenceForm } from "../recurrence/RecurrenceForm";
import styles from "../recurrence/Recurrence.module.css";

interface RecurringRowProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  recurrence: Recurrence;
  today: Date;
}

/**
 * "Recurring meeting" (no row label; PRD §7.6.4 row 5): ticking it shows the bold summary and the
 * Recurrence sub-form (03-schedule.md §8.1). Only the flag is stored (`is_recurring`).
 */
export function RecurringRow({ checked, onChange, recurrence, today }: RecurringRowProps) {
  return (
    <FormRow>
      <div className={styles.checkboxLine}>
        <Checkbox legacyLabel checked={checked} label="Recurring meeting" onChange={onChange} />
        {checked ? <span className={styles.summary}>{recurrence.summary}</span> : null}
      </div>
      {checked ? <RecurrenceForm recurrence={recurrence} today={today} /> : null}
    </FormRow>
  );
}
