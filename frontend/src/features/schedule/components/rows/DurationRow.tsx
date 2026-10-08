"use client";

import { useMemo } from "react";
import clsx from "clsx";
import { Select } from "@/shared/ui/Select";
import type { ScheduleFormApi } from "../../hooks/useScheduleForm";
import { DURATION_HOURS, DURATION_MINUTES, isBasicPlan } from "../../utils/plan";
import { FilterSelect } from "../controls/FilterSelect";
import controls from "../controls/controls.module.css";
import { FormRow } from "../form/FormRow";
import { BasicPlanBanner } from "./BasicPlanBanner";
import styles from "./DurationRow.module.css";

const toOptions = (values: readonly string[]) => values.map((value) => ({ value, label: value }));

/** Duration: hour select + "hr" + filterable minute select + "min" (PRD §7.6.4 row 3, per plan). */
export function DurationRow({ form }: { form: ScheduleFormApi }) {
  const { values, set } = form;
  const hours = useMemo(() => toOptions(DURATION_HOURS), []);
  // an edited meeting may carry a value outside the plan's list (e.g. 40 on Pro): keep it selectable
  const minutes = useMemo(
    () => toOptions(DURATION_MINUTES.includes(values.durationMinutes) ? DURATION_MINUTES : [...DURATION_MINUTES, values.durationMinutes]),
    [values.durationMinutes],
  );

  return (
    <>
      <FormRow label="Duration">
        <div className={styles.widget}>
          <Select
            aria-label="Duration hours"
            className={controls.duration}
            disabled={isBasicPlan}
            options={hours}
            value={values.durationHours}
            onChange={(hour) => set("durationHours", hour)}
          />
          <span className={clsx(styles.unit, styles.unitGap)}>hr</span>
          <FilterSelect
            aria-label="Duration minutes"
            className={controls.duration}
            options={minutes}
            value={values.durationMinutes}
            onChange={(minute) => set("durationMinutes", minute)}
          />
          <span className={styles.unit}>min</span>
        </div>
      </FormRow>
      {isBasicPlan ? <BasicPlanBanner /> : null}
    </>
  );
}
