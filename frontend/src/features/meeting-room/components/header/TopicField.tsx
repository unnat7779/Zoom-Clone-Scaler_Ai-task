"use client";

import { MtgMeetingsEditIcon } from "@/shared/icons/generated/MtgMeetingsEditIcon";
import { useRevertingField } from "../../hooks/useRevertingField";
import styles from "./TopicField.module.css";

/** Host view of the topic: looks editable, but edits revert on blur (Static UI). */
export function TopicField({ topic }: { topic: string }) {
  const field = useRevertingField(topic);
  return (
    <label className={styles.wrap}>
      <input className={styles.input} maxLength={99} placeholder="Meeting Topic" aria-label="Meeting Topic" {...field} />
      <MtgMeetingsEditIcon className={styles.pencil} />
    </label>
  );
}
