"use client";

import { SchWhiteboardIcon } from "@/shared/icons/generated/SchWhiteboardIcon";
import { Button } from "@/shared/ui/Button";
import { useToast } from "@/shared/ui/Toast";
import { InfoButton } from "../controls/InfoButton";
import { FormRow } from "../form/FormRow";
import styles from "./WhiteboardRow.module.css";

const WHITEBOARD_INFO = (
  <ul className={styles.infoList}>
    <li>Can only add 1 whiteboard.</li>
    <li>Whiteboard access is granted to invitees after the event is scheduled. Removing invitees won&apos;t revoke their whiteboard access.</li>
  </ul>
);

/** Whiteboard ⓘ + "Add Whiteboard" (static, PRD §7.6.4 row 9). */
export function WhiteboardRow() {
  const toast = useToast();
  return (
    <FormRow label="Whiteboard" labelSuffix={<InfoButton label="Learn more about Whiteboard" content={WHITEBOARD_INFO} />}>
      <Button variant="secondary" leadingIcon={<SchWhiteboardIcon />} onClick={toast.notAvailable}>
        Add Whiteboard
      </Button>
    </FormRow>
  );
}
