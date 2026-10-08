"use client";

import { useState } from "react";
import { Checkbox } from "@/shared/ui/Checkbox";
import { Radio, RadioGroup } from "@/shared/ui/Radio";
import { FormRow } from "../form/FormRow";
import styles from "./MyNotesRow.module.css";

/** My Notes (static): transcription checkbox + scope radios (hidden when unticked). Not stored. */
export function MyNotesRow() {
  const [enabled, setEnabled] = useState(true);
  const [scope, setScope] = useState("all");
  return (
    <FormRow label="My Notes">
      <Checkbox legacyLabel checked={enabled} label="Allow participants to transcribe meeting with My Notes" onChange={setEnabled} />
      {enabled ? (
        <RadioGroup value={scope} onChange={setScope} direction="vertical" aria-label="Who can transcribe" className={styles.radios}>
          <Radio value="org" label="Only participants in your organization" />
          <Radio value="all" label="All participants" />
        </RadioGroup>
      ) : null}
    </FormRow>
  );
}
