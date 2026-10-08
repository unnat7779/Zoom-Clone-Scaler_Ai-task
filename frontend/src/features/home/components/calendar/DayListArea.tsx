"use client";

import type { MeetingListItem } from "@/shared/types/api";
import { useNextMeetingDay } from "../../api/useNextMeetingDay";
import { DayList } from "./DayList";
import { EmptyDay } from "./EmptyDay";
import { ListMessage } from "../common/ListMessage";
import { LoadingOverlay } from "./LoadingOverlay";
import styles from "./DayListArea.module.css";

interface DayListAreaProps {
  day: Date;
  /** undefined when the day's request failed (the error row with "Try again" replaces the list) */
  items: MeetingListItem[] | undefined;
  isFetching: boolean;
  onRetry: () => void;
  onSelectDay: (day: Date) => void;
}

/** Scrolling list under the tools row: cards, empty day, error, and the loading overlay. */
export function DayListArea({ day, items, isFetching, onRetry, onSelectDay }: DayListAreaProps) {
  const nextDay = useNextMeetingDay(day, items?.length === 0);

  const content =
    items === undefined ? (
      <ListMessage message="Unable to load meetings." onRetry={onRetry} />
    ) : items.length === 0 ? (
      <EmptyDay nextDay={nextDay} onSelectDay={onSelectDay} />
    ) : (
      <DayList items={items} />
    );

  return (
    <div className={styles.listArea}>
      <div className={styles.scroller}>{content}</div>
      {isFetching ? <LoadingOverlay /> : null}
    </div>
  );
}
