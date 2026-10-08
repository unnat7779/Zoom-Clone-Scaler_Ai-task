"use client";

import { useState } from "react";
import { Checkbox } from "@/shared/ui/Checkbox";
import { Select } from "@/shared/ui/Select";
import { InfoButton } from "../controls/InfoButton";
import formStyles from "../form/Form.module.css";
import { FormRow } from "../form/FormRow";
import styles from "./ZoomAiRow.module.css";

const QUESTION_OPTIONS = [
  "All participants and invitees",
  "All participants only from when they join",
  "Only meeting host",
  "Participants and invitees in our organization",
  "Participants in our organization only from when they join",
].map((label) => ({ value: label, label }));

const SUMMARY_OPTIONS = [
  "Only meeting host",
  "Only meeting host, co-hosts, and alternative hosts",
  "Only meeting host and meeting invitees in our organization",
  "All meeting invitees including those outside of our organization",
].map((label) => ({ value: label, label }));

/** Zoom AI (static): tri-state parent + "questions" / "summary" children with their selects. Not stored. */
export function ZoomAiRow() {
  const [questions, setQuestions] = useState(false);
  const [summary, setSummary] = useState(false);
  const [askWho, setAskWho] = useState(QUESTION_OPTIONS[1]?.value ?? "");
  const [sendTo, setSendTo] = useState(SUMMARY_OPTIONS[0]?.value ?? "");
  const all = questions && summary;
  const setBoth = (checked: boolean) => {
    setQuestions(checked);
    setSummary(checked);
  };

  return (
    <FormRow label="Zoom AI">
      <div className={styles.parent}>
        <Checkbox
          legacyLabel
          checked={all}
          indeterminate={questions !== summary}
          label={
            <span className={formStyles.inlineLabel}>
              Automatically start Zoom AI
              <InfoButton kind="suffix" label="Learn more about Zoom AI" content="Automatically start meeting questions and meeting summary" />
            </span>
          }
          onChange={() => setBoth(!all)}
        />
        <div className={styles.children}>
          <div className={styles.option}>
            <Checkbox legacyLabel checked={questions} label="Automatically start meeting questions" onChange={setQuestions} />
            {questions ? (
              <>
                <p className={styles.desc}>Who can ask questions about this meeting&rsquo;s transcript?</p>
                <Select aria-label="Who can ask questions" className={styles.select} options={QUESTION_OPTIONS} value={askWho} onChange={setAskWho} />
              </>
            ) : null}
          </div>
          <div className={styles.option}>
            <Checkbox legacyLabel checked={summary} label="Automatically start meeting summary" onChange={setSummary} />
            {summary ? (
              <>
                <p className={styles.desc}>
                  Who will receive a summary after this meeting?
                  <InfoButton kind="description" label="Learn more about summary recipients" content="Your selection may be limited based on your sharing settings." />
                </p>
                <Select aria-label="Who receives the summary" className={styles.select} options={SUMMARY_OPTIONS} value={sendTo} onChange={setSendTo} />
              </>
            ) : null}
          </div>
        </div>
      </div>
    </FormRow>
  );
}
