"use client";

import { useId } from "react";
import { ChevronDownIcon } from "@/shared/icons/generated/ChevronDownIcon";
import { DarkDialog } from "./DarkDialog";
import styles from "./CaptionsDialog.module.css";

/**
 * More › Show Captions (PRD §8.12.5, spec 05 §13.3, room-19): the caption-language
 * "big-dialog". Static UI — the language list only offers English, and Cancel / Save just close.
 */
export function CaptionsDialog({ onClose }: { onClose: () => void }) {
  const labelId = useId();
  const hintId = useId();
  return (
    <DarkDialog
      big
      focusDialog
      title="Set the caption language for this meeting"
      onDismiss={onClose}
      actions={[
        { label: "Cancel", onClick: onClose },
        { label: "Save", kind: "primary", onClick: onClose },
      ]}
    >
      <p id={labelId} className={styles.label}>
        Caption Language
      </p>
      <p id={hintId} className={styles.hint}>
        Captions will appear in this language for everyone.
      </p>
      <span className={styles.field}>
        <select className={styles.select} aria-labelledby={labelId} aria-describedby={hintId} defaultValue="en">
          <option value="en">English</option>
        </select>
        <span className={styles.separator} aria-hidden />
        <ChevronDownIcon className={styles.chevron} aria-hidden />
      </span>
    </DarkDialog>
  );
}
