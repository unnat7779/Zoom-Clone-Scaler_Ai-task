"use client";

import { useState } from "react";
import { useShellContext } from "@/features/shell";
import { useClock } from "@/shared/hooks/useClock";
import { HomeActions } from "./actions/HomeActions";
import { CalendarWidget } from "./calendar/CalendarWidget";
import { HomeClock } from "./clock/HomeClock";
import { DownloadAppCta } from "./download-cta/DownloadAppCta";
import { HubEntries } from "./hub/HubEntries";
import { JoinMeetingModal } from "./join-modal/JoinMeetingModal";
import { RecentMeetingsCard } from "./recent/RecentMeetingsCard";
import styles from "./HomePage.module.css";

/**
 * Workplace Home `/wc/home` (PRD §7.1): clock, New meeting / Join / Schedule, hub entries,
 * the calendar widget (Upcoming meetings) and the Recent meetings card (DV1).
 * `initialJoinOpen` is used by `/wc/join`, which opens Home with the Join modal (§7.2.1).
 */
export function HomePage({ initialJoinOpen = false }: { initialJoinOpen?: boolean }) {
  const now = useClock("minute");
  const inMeeting = useShellContext()?.inMeeting ?? false;
  const [joinOpen, setJoinOpen] = useState(initialJoinOpen);

  return (
    <div className={styles.home}>
      <DownloadAppCta />
      <HomeClock now={now} />
      <HomeActions dayOfMonth={now ? now.getDate() : null} disabled={inMeeting} onJoin={() => setJoinOpen(true)} />
      <div className={styles.cards}>
        <HubEntries />
        <CalendarWidget today={now} />
        <RecentMeetingsCard />
      </div>
      <JoinMeetingModal open={joinOpen} onClose={() => setJoinOpen(false)} />
    </div>
  );
}
