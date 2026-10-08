"use client";

import { useMemo, useState } from "react";
import { useClock } from "@/shared/hooks/useClock";
import type { MeetingRef } from "@/shared/lib/api";
import { parseDateKey } from "@/shared/lib/calendar";
import { useRecurrence } from "../../hooks/useRecurrence";
import { useScheduleForm } from "../../hooks/useScheduleForm";
import { useScheduleSubmit } from "../../hooks/useScheduleSubmit";
import { useScheduleValidation } from "../../hooks/useScheduleValidation";
import type { EncryptionMode, ScheduleFormValues } from "../../types";
import { DescriptionRow } from "../rows/DescriptionRow";
import { DocsRow } from "../rows/DocsRow";
import { DurationRow } from "../rows/DurationRow";
import { InterpretationRow } from "../rows/InterpretationRow";
import { InviteesRow } from "../rows/InviteesRow";
import { MeetingIdRow } from "../rows/MeetingIdRow";
import { RecurringRow } from "../rows/RecurringRow";
import { SecurityRow } from "../rows/SecurityRow";
import { TemplateRow } from "../rows/TemplateRow";
import { TimeZoneRow } from "../rows/TimeZoneRow";
import { TopicRow } from "../rows/TopicRow";
import { WhenRow } from "../rows/WhenRow";
import { WhiteboardRow } from "../rows/WhiteboardRow";
import { AdvancedOptions } from "./AdvancedOptions";
import { ScheduleActionBar } from "./ScheduleActionBar";
import styles from "./Form.module.css";

interface ScheduleFormProps {
  initial: ScheduleFormValues;
  /** null → Schedule (POST); a meeting → Edit (PATCH, number shown as text) */
  editing: MeetingRef | null;
  /** the user's PMI for the "Personal Meeting ID" radio */
  pmi: string | null;
}

/**
 * Schedule / Edit form, rows top to bottom as PRD §7.6.3. Choosing the PMI hides Template,
 * Whiteboard, Docs and Interpretation; End-to-end encryption hides Whiteboard and Docs (and the
 * advanced rows it disables); a recurring "No Fixed Time" meeting hides When, Duration and Time Zone.
 */
export function ScheduleForm({ initial, editing, pmi }: ScheduleFormProps) {
  const form = useScheduleForm(initial);
  const validation = useScheduleValidation(form.values, editing ? initial : null);
  const submit = useScheduleSubmit({ editing, values: form.values, validation });
  const now = useClock("minute") ?? new Date();
  const { values, set } = form;
  const startDay = useMemo(() => parseDateKey(values.date), [values.date]);
  const recurrence = useRecurrence(startDay);
  const [encryption, setEncryption] = useState<EncryptionMode>("enhanced");
  const autoId = values.meetingIdMode === "auto";
  const fixedTime = !(values.recurring && recurrence.rule.type === "none");

  return (
    <div className={styles.form}>
      <TopicRow
        value={values.topic}
        error={validation.topicError}
        autoSelect={!editing}
        onChange={(topic) => set("topic", topic)}
        onBlur={validation.checkTopic}
      />
      <DescriptionRow
        open={values.descriptionOpen}
        value={values.description}
        onOpen={() => set("descriptionOpen", true)}
        onChange={(description) => set("description", description)}
      />
      {fixedTime ? (
        <>
          <WhenRow form={form} today={now} error={validation.startError} />
          <DurationRow form={form} />
          <TimeZoneRow value={values.timezone} now={now} onChange={(zone) => set("timezone", zone)} />
        </>
      ) : null}
      <RecurringRow checked={values.recurring} onChange={(recurring) => set("recurring", recurring)} recurrence={recurrence} today={now} />
      <InviteesRow form={form} />
      <MeetingIdRow mode={values.meetingIdMode} pmi={pmi} fixedNumber={editing?.number} onChange={(mode) => set("meetingIdMode", mode)} />
      {autoId ? <TemplateRow /> : null}
      {autoId && encryption === "enhanced" ? (
        <>
          <WhiteboardRow />
          <DocsRow />
        </>
      ) : null}
      <SecurityRow form={form} passcodeInvalid={validation.passcodeInvalid} />
      <AdvancedOptions form={form} showMeetingChat encryption={encryption} onEncryptionChange={setEncryption} />
      {autoId ? <InterpretationRow /> : null}
      <ScheduleActionBar onSave={submit.save} onCancel={submit.cancel} saving={submit.pending} />
    </div>
  );
}
