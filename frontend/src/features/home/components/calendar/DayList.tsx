"use client";

import { useClock } from "@/shared/hooks/useClock";
import type { MeetingListItem } from "@/shared/types/api";
import { getEventCardStatus, isSeparatedFromPast } from "../../utils/eventCard";
import { EventCard } from "./EventCard";
import styles from "./DayList.module.css";

/** The selected day's event cards in start order; their states follow the minute clock. */
export function DayList({ items }: { items: MeetingListItem[] }) {
  const now = useClock("minute") ?? new Date();
  const cards = items.map((item) => ({ item, status: getEventCardStatus(item, now) }));

  return (
    <div className={styles.list}>
      {cards.map(({ item, status }, index) => (
        <EventCard
          key={item.id}
          item={item}
          status={status}
          separated={isSeparatedFromPast(cards[index - 1]?.status.state, status.state)}
        />
      ))}
    </div>
  );
}
