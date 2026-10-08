import type { InstanceListItem } from "@/shared/types/api";
import { formatRecentStats, formatRecentWhen } from "../../utils/recentMeeting";
import styles from "./RecentMeetingsCard.module.css";

interface RecentMeetingItemProps {
  item: InstanceListItem;
  onOpen: (item: InstanceListItem) => void;
}

/** An ended meeting as a past (`.list-item.isPast`) card: topic, when, duration · participants. */
export function RecentMeetingItem({ item, onOpen }: RecentMeetingItemProps) {
  return (
    <button type="button" className={styles.item} onClick={() => onOpen(item)}>
      <span className={styles.topic}>{item.topic}</span>
      <span className={styles.meta}>{formatRecentWhen(item)}</span>
      <span className={styles.stats}>{formatRecentStats(item)}</span>
    </button>
  );
}
