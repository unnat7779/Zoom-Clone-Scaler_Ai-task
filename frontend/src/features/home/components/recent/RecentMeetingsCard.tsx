"use client";

import { useRouter } from "next/navigation";
import { routes } from "@/shared/lib/routes";
import touch from "@/shared/styles/touch.module.css";
import type { InstanceListItem } from "@/shared/types/api";
import { Button } from "@/shared/ui";
import { useRecentMeetings } from "../../api/useRecentMeetings";
import { ListMessage } from "../common/ListMessage";
import { SkeletonCard } from "../common/SkeletonCard";
import { RecentMeetingItem } from "./RecentMeetingItem";
import styles from "./RecentMeetingsCard.module.css";

/**
 * Recent meetings card — Deviation from Zoom (assignment requirement, DV1, PRD §7.1.9):
 * the 5 newest ended meetings in the calendar widget's own style; "View all" opens Meetings → Previous.
 */
export function RecentMeetingsCard() {
  const router = useRouter();
  const { data, isPending, isError, refetch } = useRecentMeetings();
  const open = (item: InstanceListItem) => router.push(routes.meetings({ tab: "previous", select: item.uuid }));

  let content;
  if (isPending) content = [0, 1].map((key) => <SkeletonCard key={key} />);
  else if (isError) content = <ListMessage message="Unable to load recent meetings." onRetry={() => void refetch()} />;
  else if (data.length === 0) content = <div className={styles.empty}>No recent meetings.</div>;
  else content = data.map((item) => <RecentMeetingItem key={item.uuid} item={item} onOpen={open} />);

  return (
    <section className={styles.card} aria-labelledby="home-recent-title">
      <div className={styles.header}>
        <h2 id="home-recent-title" className={styles.title}>
          Recent meetings
        </h2>
        <Button variant="tertiary" size="sm" className={touch.target} onClick={() => router.push(routes.meetings({ tab: "previous" }))}>
          View all
        </Button>
      </div>
      <div className={isPending ? styles.skeletonList : styles.list}>{content}</div>
    </section>
  );
}
