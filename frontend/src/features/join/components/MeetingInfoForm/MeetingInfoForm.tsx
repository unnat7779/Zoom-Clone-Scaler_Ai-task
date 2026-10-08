"use client";

import { useId, useRef } from "react";
import { useKeepFieldVisible } from "../../hooks/useKeepFieldVisible";
import type { PreJoinForm } from "../../hooks/usePreJoinForm";
import { DISPLAY_NAME_MAX_LENGTH } from "../../utils/displayName";
import { AgreementText } from "./AgreementText";
import { FormField } from "./FormField";
import { JoinButton } from "./JoinButton";
import { RememberNameCheckbox } from "./RememberNameCheckbox";
import styles from "./MeetingInfoForm.module.css";

interface MeetingInfoFormProps {
  form: PreJoinForm;
  joining: boolean;
  onSubmit: () => void;
}

/**
 * `.preview-meeting-info` (PRD §7.10.2): passcode (when needed), name, remember-me, Join. On touch
 * screens the focused field stays above the on-screen keyboard.
 */
export function MeetingInfoForm({ form, joining, onSubmit }: MeetingInfoFormProps) {
  const id = useId();
  const formRef = useRef<HTMLFormElement | null>(null);
  useKeepFieldVisible(formRef);
  return (
    <form
      ref={formRef}
      className={styles.form}
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <h1 className={styles.title}>Enter Meeting Info</h1>
      {form.passcodeShown ? (
        <FormField
          id={`${id}-passcode`}
          label="Meeting Passcode"
          inputClassName={styles.passcode}
          autoComplete="off"
          value={form.passcode}
          onChange={form.setPasscode}
          error={form.errors.passcode}
        />
      ) : null}
      <FormField
        id={`${id}-name`}
        label="Your Name"
        autoComplete="name"
        maxLength={DISPLAY_NAME_MAX_LENGTH}
        value={form.name}
        onChange={form.setName}
        error={form.errors.name}
      />
      {form.rememberShown ? <RememberNameCheckbox checked={form.rememberName} onChange={form.setRememberName} /> : null}
      <JoinButton enabled={form.canSubmit} joining={joining} />
      {form.errors.join ? (
        <p className={styles.joinError} role="alert">
          {form.errors.join}
        </p>
      ) : null}
      <AgreementText />
    </form>
  );
}
