"use client";

import { useState } from "react";
import { formatMeetingNumber } from "@/shared/lib/format";
import type { Meeting } from "@/shared/types/api";
import { usePmiSubmit } from "../../hooks/usePmiSubmit";
import { useScheduleForm } from "../../hooks/useScheduleForm";
import type { EncryptionMode } from "../../types";
import { editFormValues } from "../../utils/formValues";
import { SecurityRow } from "../rows/SecurityRow";
import { AdvancedOptions } from "./AdvancedOptions";
import { FormRow } from "./FormRow";
import { ScheduleActionBar } from "./ScheduleActionBar";
import styles from "./Form.module.css";

/**
 * Edit Personal Meeting Room (PRD §7.7, `sch-19`): Personal Meeting ID (text) → Security →
 * divider → Encryption → Zoom AI → Workflow → My Notes → Video → Options.
 */
export function PmiEditForm({ meeting }: { meeting: Meeting }) {
  const [initial] = useState(() => editFormValues(meeting));
  const form = useScheduleForm(initial);
  const submit = usePmiSubmit(meeting.meeting_number, form.values);
  const [encryption, setEncryption] = useState<EncryptionMode>("enhanced");

  return (
    <div className={styles.form}>
      <FormRow label="Personal Meeting ID">
        <span className={styles.plainValue}>{formatMeetingNumber(meeting.meeting_number)}</span>
      </FormRow>
      <SecurityRow form={form} passcodeInvalid={submit.passcodeInvalid} />
      <AdvancedOptions form={form} showMeetingChat={false} encryption={encryption} onEncryptionChange={setEncryption} />
      <ScheduleActionBar onSave={submit.save} onCancel={submit.cancel} saving={submit.pending} />
    </div>
  );
}
