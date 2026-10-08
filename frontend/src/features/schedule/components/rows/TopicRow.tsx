"use client";

import { useEffect, useRef } from "react";
import { FieldError } from "@/shared/ui/FieldError";
import { Input } from "@/shared/ui/Input";
import controls from "../controls/controls.module.css";
import { FormRow } from "../form/FormRow";

interface TopicRowProps {
  value: string;
  error: string | null;
  onChange: (value: string) => void;
  onBlur: () => void;
  /** Schedule: focused with the whole text selected on load */
  autoSelect: boolean;
}

/** `* Topic`: 490×32 input, `maxlength=200`; "Topic is required" row below on error (PRD §7.6.4). */
export function TopicRow({ value, error, onChange, onBlur, autoSelect }: TopicRowProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (!autoSelect) return;
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [autoSelect]);

  return (
    <FormRow label="Topic" required labelId="schedule-topic-label">
      <Input
        ref={inputRef}
        id="topic"
        className={controls.long}
        value={value}
        placeholder="My Meeting"
        maxLength={200}
        autoComplete="off"
        aria-required
        aria-labelledby="schedule-topic-label"
        aria-describedby={error ? "schedule-topic-error" : undefined}
        error={Boolean(error)}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
      />
      {error ? <FieldError id="schedule-topic-error">{error}</FieldError> : null}
    </FormRow>
  );
}
