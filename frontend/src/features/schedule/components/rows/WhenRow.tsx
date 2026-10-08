"use client";

import { FieldError } from "@/shared/ui/FieldError";
import { Select } from "@/shared/ui/Select";
import type { ScheduleFormApi } from "../../hooks/useScheduleForm";
import type { Meridiem } from "../../utils/time";
import { DateField } from "../controls/DateField";
import { TimeSelect } from "../controls/TimeSelect";
import controls from "../controls/controls.module.css";
import { FormRow } from "../form/FormRow";
import styles from "./WhenRow.module.css";

const MERIDIEM_OPTIONS: { value: Meridiem; label: string }[] = [
  { value: "AM", label: "AM" },
  { value: "PM", label: "PM" },
];

const WHEN_ERROR_ID = "schedule-when-error";

interface WhenRowProps {
  form: ScheduleFormApi;
  today: Date;
  error: string | null;
}

/** When: date 240 · start time 173 · AM/PM 104, 8px apart (PRD §7.6.4 row 2). */
export function WhenRow({ form, today, error }: WhenRowProps) {
  const { values, set, setTime } = form;
  return (
    <FormRow label="When">
      <div className={styles.widget}>
        <DateField value={values.date} today={today} describedBy={error ? WHEN_ERROR_ID : undefined} onChange={(date) => set("date", date)} />
        <TimeSelect value={values.time} customTimes={values.customTimes} onChange={setTime} />
        <Select
          aria-label="AM or PM"
          className={controls.ampm}
          options={MERIDIEM_OPTIONS}
          value={values.meridiem}
          onChange={(meridiem) => set("meridiem", meridiem)}
        />
      </div>
      {error ? <FieldError id={WHEN_ERROR_ID}>{error}</FieldError> : null}
    </FormRow>
  );
}
