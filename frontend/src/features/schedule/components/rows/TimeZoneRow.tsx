"use client";

import { useMemo } from "react";
import { timeZoneOptions } from "../../utils/timeZones";
import { FilterSelect } from "../controls/FilterSelect";
import controls from "../controls/controls.module.css";
import { FormRow } from "../form/FormRow";

interface TimeZoneRowProps {
  value: string;
  onChange: (zone: string) => void;
  /** offsets are the ones in force at this instant (DST) */
  now: Date;
}

/** Time Zone: 490×32 filter select over Zoom's 149 zones, `(GMT±H:MM) Label` (PRD §7.6.4 row 4). */
export function TimeZoneRow({ value, onChange, now }: TimeZoneRowProps) {
  const options = useMemo(() => timeZoneOptions(now), [now]);
  return (
    <FormRow label="Time Zone">
      <FilterSelect aria-label="Time Zone" className={controls.long} options={options} value={value} onChange={onChange} />
    </FormRow>
  );
}
