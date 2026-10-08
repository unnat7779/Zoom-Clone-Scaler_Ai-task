import { Radio, RadioGroup } from "@/shared/ui/Radio";
import type { ScheduleFormApi } from "../../hooks/useScheduleForm";
import { FormRow } from "../form/FormRow";
import styles from "./VideoRow.module.css";

/** Video: Host on/off, Participant on/off (initial camera state on start / join; PRD §7.6.4 row 17). */
export function VideoRow({ form }: { form: ScheduleFormApi }) {
  const { values, set } = form;
  const lines = [
    { name: "Host", srLabel: "Host video", field: "hostVideo", value: values.hostVideo },
    { name: "Participant", srLabel: "Participant video", field: "participantVideo", value: values.participantVideo },
  ] as const;
  return (
    <FormRow label="Video">
      {lines.map((line) => (
        <div key={line.name} className={styles.line}>
          <span className={styles.name}>{line.name}</span>
          <RadioGroup value={line.value} onChange={(value) => set(line.field, value)} aria-label={line.srLabel}>
            <Radio value="on" label="on" />
            <Radio value="off" label="off" />
          </RadioGroup>
        </div>
      ))}
    </FormRow>
  );
}
