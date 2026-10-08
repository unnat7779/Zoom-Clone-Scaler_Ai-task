"use client";

import { useState } from "react";
import { FilterSelect } from "../controls/FilterSelect";
import controls from "../controls/controls.module.css";
import { FormRow } from "../form/FormRow";

const TEMPLATE_OPTIONS = [{ value: "none", label: "None", group: "Personal templates" }];

/** Template (static): filter select "Select a template" → Personal templates / None. Not stored. */
export function TemplateRow() {
  const [template, setTemplate] = useState<string | null>(null);
  return (
    <FormRow label="Template">
      <FilterSelect
        aria-label="Template"
        className={controls.long}
        placeholder="Select a template"
        options={TEMPLATE_OPTIONS}
        value={template}
        onChange={setTemplate}
      />
    </FormRow>
  );
}
