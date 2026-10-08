"use client";

import { useMeetingsUrlState } from "../hooks/useMeetingsUrlState";
import { PreviousView } from "./tab/PreviousView";
import { UpcomingView } from "./tab/UpcomingView";

/** Workplace Meetings tab `/wc/meetings?tab=upcoming|previous&select=…` (PRD §7.4). */
export function MeetingsTabPage() {
  const url = useMeetingsUrlState();
  return url.tab === "previous" ? <PreviousView url={url} /> : <UpcomingView url={url} />;
}
