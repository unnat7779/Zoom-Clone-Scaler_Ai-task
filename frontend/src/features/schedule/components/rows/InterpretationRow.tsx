"use client";

import { useRef, useState } from "react";
import { SchCloseIcon } from "@/shared/icons/generated/SchCloseIcon";
import { SchPlusIcon } from "@/shared/icons/generated/SchPlusIcon";
import { Button } from "@/shared/ui/Button";
import { Checkbox } from "@/shared/ui/Checkbox";
import { IconButton } from "@/shared/ui/IconButton";
import { Input } from "@/shared/ui/Input";
import { Select } from "@/shared/ui/Select";
import { FormRow } from "../form/FormRow";
import styles from "./InterpretationRow.module.css";

/** Sign languages of the interpreter select [D: Zoom's list was not captured beyond its default]. */
const LANGUAGES = [
  "American Sign Language",
  "British Sign Language",
  "Chinese Sign Language",
  "French Sign Language",
  "German Sign Language",
  "Japanese Sign Language",
  "Korean Sign Language",
  "Spanish Sign Language",
].map((label) => ({ value: label, label }));

const DEFAULT_LANGUAGE = LANGUAGES[0]?.value ?? "";

/**
 * Interpretation (static, not stored; 03-schedule.md §5.20): ticking it reveals an interpreter row —
 * email 200×32 · language 300×32 · round × — and "+ Add Sign Language Interpreter" below.
 */
export function InterpretationRow() {
  const [enabled, setEnabled] = useState(false);
  const [rows, setRows] = useState(() => [{ key: 0, language: DEFAULT_LANGUAGE }]);
  const nextKey = useRef(1);
  const setLanguage = (key: number, language: string) => setRows((current) => current.map((row) => (row.key === key ? { ...row, language } : row)));

  return (
    <FormRow label="Interpretation">
      <Checkbox
        legacyLabel
        checked={enabled}
        label="Select sign language interpretation video channels below. You can assign interpreters at any time."
        onChange={setEnabled}
      />
      {enabled ? (
        <div className={styles.reveal}>
          {rows.map((row) => (
            <div key={row.key} className={styles.interpreter}>
              <Input className={styles.email} placeholder="john@company.com" aria-label="Interpreter email" autoComplete="off" />
              <div className={styles.languageCell}>
                <Select aria-label="Sign language" className={styles.language} options={LANGUAGES} value={row.language} onChange={(language) => setLanguage(row.key, language)} />
                <IconButton label="Remove interpreter" size="md" icon={<SchCloseIcon />} onClick={() => setRows((current) => current.filter((item) => item.key !== row.key))} />
              </div>
            </div>
          ))}
          <Button
            variant="tertiary"
            leadingIcon={<SchPlusIcon />}
            className={styles.add}
            onClick={() => setRows((current) => [...current, { key: nextKey.current++, language: DEFAULT_LANGUAGE }])}
          >
            Add Sign Language Interpreter
          </Button>
        </div>
      ) : null}
    </FormRow>
  );
}
