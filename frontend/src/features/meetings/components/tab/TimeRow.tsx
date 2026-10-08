"use client";

import clsx from "clsx";
import { useTimeNotice } from "../../hooks/useTimeNotice";
import { DetailRow } from "./DetailRow";
import styles from "./TimeRow.module.css";

interface TimeRowProps {
  /** `10:58 PM - 11:28 PM` (no date: the list group carries it) */
  range: string;
  startIso: string;
  durationMinutes: number;
  isLive: boolean;
}

/** Detail time row + live notice: `<span>time</span><span> | </span><span>notice</span>` (PRD §7.4.4). */
export function TimeRow({ range, startIso, durationMinutes, isLive }: TimeRowProps) {
  const notice = useTimeNotice(startIso, durationMinutes, isLive);
  return (
    <DetailRow>
      <span>{range}</span>
      {notice ? (
        <>
          <span> | </span>
          <span className={clsx(styles.notice, { [styles.now ?? ""]: notice.tone === "now" })}>{notice.text}</span>
        </>
      ) : null}
    </DetailRow>
  );
}
