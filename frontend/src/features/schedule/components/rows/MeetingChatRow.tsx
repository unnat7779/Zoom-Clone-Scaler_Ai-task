"use client";

import { useState } from "react";
import { Checkbox } from "@/shared/ui/Checkbox";
import { FormRow } from "../form/FormRow";
import styles from "./MeetingChatRow.module.css";

/** Meeting chat (static): access chats before and after the meeting. Not stored. */
export function MeetingChatRow() {
  const [enabled, setEnabled] = useState(true);
  return (
    <FormRow label="Meeting chat">
      <Checkbox legacyLabel className={styles.checkbox} checked={enabled} label="Allow users to access meeting chats before and after the meeting" onChange={setEnabled} />
    </FormRow>
  );
}
