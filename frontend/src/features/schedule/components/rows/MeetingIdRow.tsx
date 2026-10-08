import { formatMeetingNumber } from "@/shared/lib/format";
import { Radio, RadioGroup } from "@/shared/ui/Radio";
import type { ScheduleFormValues } from "../../types";
import { FormRow } from "../form/FormRow";
import formStyles from "../form/Form.module.css";
import styles from "./MeetingIdRow.module.css";

interface MeetingIdRowProps {
  mode: ScheduleFormValues["meetingIdMode"];
  onChange: (mode: ScheduleFormValues["meetingIdMode"]) => void;
  pmi: string | null;
  /** Edit: the number as plain text instead of the radios */
  fixedNumber?: string;
}

/** Meeting ID: Generate Automatically | Personal Meeting ID {pmi} (PRD §7.6.4 row 7; Edit shows the number). */
export function MeetingIdRow({ mode, onChange, pmi, fixedNumber }: MeetingIdRowProps) {
  return (
    <FormRow label="Meeting ID" labelId="schedule-meeting-id-label">
      {fixedNumber ? (
        <span className={formStyles.plainValue}>{formatMeetingNumber(fixedNumber)}</span>
      ) : (
        <RadioGroup value={mode} onChange={onChange} aria-labelledby="schedule-meeting-id-label" className={styles.radios}>
          <Radio value="auto" label="Generate Automatically" />
          <Radio value="pmi" label={`Personal Meeting ID ${pmi ? formatMeetingNumber(pmi) : ""}`} disabled={!pmi} />
        </RadioGroup>
      )}
    </FormRow>
  );
}
