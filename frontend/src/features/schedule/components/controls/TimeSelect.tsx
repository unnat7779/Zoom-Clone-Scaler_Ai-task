"use client";

import { useMemo } from "react";
import type { FilterOption } from "../../hooks/useFilterSelect";
import { filterTimes, parseTypedTime, withCustomTimes } from "../../utils/time";
import { FilterSelect } from "./FilterSelect";
import styles from "./controls.module.css";

interface TimeSelectProps {
  value: string;
  customTimes: string[];
  /** `custom` is true for an accepted free time (`9:10` → `09:10`), which joins the list */
  onChange: (value: string, custom: boolean) => void;
}

const filterOptions = (options: FilterOption[], query: string) => {
  const labels = filterTimes(
    options.map((option) => option.label),
    query,
  );
  return options.filter((option) => labels.includes(option.label));
};

/** 173×32 editable start-time select: 15-minute options, prefix filter, typed free times (PRD §7.6.4). */
export function TimeSelect({ value, customTimes, onChange }: TimeSelectProps) {
  const options = useMemo(() => withCustomTimes(customTimes).map((time) => ({ value: time, label: time })), [customTimes]);

  // a created row only for text that no option starts with: `13`, `9:10`, `abc` — never for `3` (03-schedule.md §6.4)
  const create = (query: string): FilterOption | null =>
    options.some((option) => option.label.startsWith(query)) ? null : { value: parseTypedTime(query) ?? "", label: query, created: true };

  return (
    <FilterSelect
      aria-label="Meeting start time"
      className={styles.time}
      compact
      options={options}
      value={value}
      filter={filterOptions}
      create={create}
      onChange={(next) => onChange(next, !options.some((option) => option.value === next))}
    />
  );
}
