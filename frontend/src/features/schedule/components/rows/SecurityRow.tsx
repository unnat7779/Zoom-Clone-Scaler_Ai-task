"use client";

import { Checkbox } from "@/shared/ui/Checkbox";
import type { ScheduleFormApi } from "../../hooks/useScheduleForm";
import { isBasicPlan } from "../../utils/plan";
import { PasscodeInput } from "../controls/PasscodeInput";
import { FormRow } from "../form/FormRow";
import styles from "./SecurityRow.module.css";

interface SecurityRowProps {
  form: ScheduleFormApi;
  passcodeInvalid: boolean;
}

/**
 * Security (PRD §7.6.4 row 11): Passcode (locked on Basic; unticking on Pro saves no passcode)
 * + 200px input at x=609, and Waiting Room (stored, no runtime effect).
 */
export function SecurityRow({ form, passcodeInvalid }: SecurityRowProps) {
  const { values, set } = form;
  return (
    <FormRow label="Security" labelId="schedule-security-label">
      <div role="group" aria-labelledby="schedule-security-label">
        <div className={styles.block}>
          <div className={styles.passcodeLine}>
            <Checkbox
              legacyLabel
              label="Passcode"
              className={styles.passcodeCheckbox}
              checked={values.passcodeEnabled}
              disabled={isBasicPlan}
              onChange={(checked) => set("passcodeEnabled", checked)}
            />
            {values.passcodeEnabled ? (
              <PasscodeInput value={values.passcode} invalid={passcodeInvalid} onChange={(passcode) => set("passcode", passcode)} />
            ) : null}
          </div>
          <p className={styles.desc}>Only users who have the invite link or passcode can join the meeting</p>
        </div>
        <div className={styles.block}>
          <Checkbox legacyLabel label="Waiting Room" checked={values.waitingRoom} onChange={(checked) => set("waitingRoom", checked)} />
          <p className={styles.desc}>Only users admitted by the host can join the meeting</p>
        </div>
      </div>
    </FormRow>
  );
}
