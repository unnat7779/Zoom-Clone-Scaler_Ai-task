"use client";

import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatMeetingNumber, formatTimeRange, meetingWindow } from "@/shared/lib/format";
import { routes } from "@/shared/lib/routes";
import touch from "@/shared/styles/touch.module.css";
import type { MeetingListItem } from "@/shared/types/api";
import { Button } from "@/shared/ui";
import type { EventCardStatus } from "../../types";
import { cardActionHref } from "../../utils/meetingLinks";
import { EventCardMenu } from "./EventCardMenu";
import styles from "./EventCard.module.css";

interface EventCardProps {
  item: MeetingListItem;
  status: EventCardStatus;
  /** 24px gap after a past, never-joined card */
  separated: boolean;
}

/**
 * `.list-item.meeting__card--item` (PRD §7.1.8): topic, time range, meeting ID, live status,
 * Start/Join pill and "…" menu. The card body is a link (under the buttons) that opens the
 * meeting in the Meetings tab, so it is reachable from the keyboard.
 */
export function EventCard({ item, status, separated }: EventCardProps) {
  const router = useRouter();
  const { start, end } = meetingWindow(item.start_time, item.duration_minutes);
  const { action } = status;

  return (
    <div role="group" aria-label={item.topic} className={clsx(styles.card, styles[status.state], { [styles.separated ?? ""]: separated })}>
      <Link
        href={routes.meetings({ select: item.meeting_number })}
        aria-label={`${item.topic}, open in Meetings`}
        className={styles.cardLink}
      />
      <div className={styles.mainRow}>
        <div className={styles.left}>
          <div className={styles.title}>{item.topic}</div>
          <div className={styles.time}>{formatTimeRange(start, end)}</div>
          <div className={styles.indicator}>Meeting ID: {formatMeetingNumber(item.meeting_number)}</div>
        </div>
        {status.statusLabel ? <div className={styles.status}>{status.statusLabel}</div> : null}
      </div>
      <div className={styles.more}>
        {action ? (
          <Button size="sm" className={clsx(styles.action, touch.target)} onClick={() => router.push(cardActionHref(item, action))}>
            {action}
          </Button>
        ) : null}
        <div className={styles.moreRight}>
          <EventCardMenu item={item} />
        </div>
      </div>
    </div>
  );
}
