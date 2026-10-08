"use client";

import { SchDocsIcon } from "@/shared/icons/generated/SchDocsIcon";
import { Button } from "@/shared/ui/Button";
import { useToast } from "@/shared/ui/Toast";
import { FormRow } from "../form/FormRow";

/** Docs: "Add Docs" secondary button (static, PRD §7.6.4 row 10). */
export function DocsRow() {
  const toast = useToast();
  return (
    <FormRow label="Docs">
      <Button variant="secondary" leadingIcon={<SchDocsIcon />} onClick={toast.notAvailable}>
        Add Docs
      </Button>
    </FormRow>
  );
}
