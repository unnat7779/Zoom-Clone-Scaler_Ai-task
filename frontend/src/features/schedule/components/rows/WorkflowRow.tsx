"use client";

import { useToast } from "@/shared/ui/Toast";
import { FormRow } from "../form/FormRow";
import formStyles from "../form/Form.module.css";
import styles from "./WorkflowRow.module.css";

/** Workflow (static): "Attach workflow to this meeting" text button. */
export function WorkflowRow() {
  const toast = useToast();
  return (
    <FormRow label="Workflow">
      <button type="button" className={`${formStyles.textButton} ${styles.button}`} onClick={toast.notAvailable}>
        Attach workflow to this meeting
      </button>
    </FormRow>
  );
}
