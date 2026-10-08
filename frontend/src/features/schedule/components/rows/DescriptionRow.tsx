"use client";

import { useState } from "react";
import { SchPlusIcon } from "@/shared/icons/generated/SchPlusIcon";
import { TextArea } from "@/shared/ui/TextArea";
import controls from "../controls/controls.module.css";
import { FormRow } from "../form/FormRow";
import styles from "../form/Form.module.css";

interface DescriptionRowProps {
  open: boolean;
  value: string;
  onOpen: () => void;
  onChange: (value: string) => void;
}

/** "+ Add Description" → 490×50 auto-growing textarea (50 / 68 / 86 max), stays open when empty. */
export function DescriptionRow({ open, value, onOpen, onChange }: DescriptionRowProps) {
  // focus only when opened by the button (not when Edit prefills a description)
  const [openedByUser, setOpenedByUser] = useState(false);
  return (
    <FormRow>
      {open ? (
        <TextArea
          className={controls.long}
          value={value}
          placeholder="Add Description"
          aria-label="Description"
          maxLength={2000}
          autoResize={{ minRows: 2, maxRows: 4 }}
          autoFocus={openedByUser}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <button
          type="button"
          className={styles.textButton}
          onClick={() => {
            setOpenedByUser(true);
            onOpen();
          }}
        >
          <SchPlusIcon />
          Add Description
        </button>
      )}
    </FormRow>
  );
}
