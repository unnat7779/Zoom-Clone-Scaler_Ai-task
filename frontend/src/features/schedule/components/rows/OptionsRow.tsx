"use client";

import { useState } from "react";
import clsx from "clsx";
import { Checkbox } from "@/shared/ui/Checkbox";
import type { ScheduleFormApi } from "../../hooks/useScheduleForm";
import { FormRow } from "../form/FormRow";
import formStyles from "../form/Form.module.css";
import { RegionDialog } from "./RegionDialog";
import styles from "./OptionsRow.module.css";

/**
 * Options: "Show" ↔ "Hide" (instant) → 4 checkboxes, 28px apart. Join anytime (✓ by default)
 * and mute upon entry are stored; auto-record and region blocking are static (PRD §7.6.4 row 18).
 * Ticking region blocking opens its dialog; Cancel unticks it again (03-schedule.md §8.6).
 */
export function OptionsRow({ form }: { form: ScheduleFormApi }) {
  const { values, set } = form;
  const [expanded, setExpanded] = useState(false);
  const [autoRecord, setAutoRecord] = useState(false);
  const [regions, setRegions] = useState(false);
  const [regionDialog, setRegionDialog] = useState(false);
  const onRegionsChange = (checked: boolean) => {
    setRegions(checked);
    setRegionDialog(checked);
  };
  const cancelRegions = () => {
    setRegions(false);
    setRegionDialog(false);
  };
  return (
    <FormRow label="Options">
      <button
        type="button"
        className={clsx(formStyles.textButton, styles.toggle)}
        aria-expanded={expanded}
        aria-label={expanded ? "Hide More Options, Expanded" : "Show More Options, Collapsed"}
        onClick={() => setExpanded((current) => !current)}
      >
        {expanded ? "Hide" : "Show"}
      </button>
      {expanded ? (
        <div className={styles.list}>
          <div>
            <Checkbox legacyLabel checked={values.joinBeforeHost} label="Allow participants to join anytime" onChange={(checked) => set("joinBeforeHost", checked)} />
          </div>
          <div>
            <Checkbox legacyLabel checked={values.muteUponEntry} label="Mute participants upon entry" onChange={(checked) => set("muteUponEntry", checked)} />
          </div>
          <div>
            <Checkbox legacyLabel checked={autoRecord} label="Automatically record meeting on the local computer" onChange={setAutoRecord} />
          </div>
          <div>
            <Checkbox legacyLabel checked={regions} label="Approve or block entry to users from specific regions/countries" onChange={onRegionsChange} />
          </div>
        </div>
      ) : null}
      <RegionDialog open={regionDialog} onSave={() => setRegionDialog(false)} onCancel={cancelRegions} />
    </FormRow>
  );
}
