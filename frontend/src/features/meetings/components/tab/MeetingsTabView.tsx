"use client";

import type { ReactNode } from "react";
import type { MeetingsUrlState } from "../../hooks/useMeetingsUrlState";
import { usePushedDetail } from "../../hooks/usePushedDetail";
import { useRefresh } from "../../hooks/useRefresh";
import type { DayGroup } from "../../utils/grouping";
import type { MeetingRow } from "../../utils/rows";
import { MeetingList } from "./MeetingList";
import { MeetingsLayout } from "./MeetingsLayout";

interface MeetingsTabViewProps {
  url: MeetingsUrlState;
  loading: boolean;
  refetch: () => Promise<unknown>;
  groups: DayGroup<MeetingRow>[];
  selectedKey: string | null;
  /** Upcoming only: the PMI card above the groups */
  pmiNumber?: string | null;
  emptyText: string;
  detail: ReactNode;
}

/**
 * The frame both Meetings views share (PRD §7.4): refresh (3 s debounce), list column, detail pane
 * and, on phones, the pushed detail (DV11). Upcoming and Previous only supply rows and the detail.
 */
export function MeetingsTabView({ url, loading, refetch, groups, selectedKey, pmiNumber, emptyText, detail }: MeetingsTabViewProps) {
  const { refreshing, refresh } = useRefresh(refetch);
  const pushed = usePushedDetail(url);
  // phones: nothing looks selected until a row is tapped (the detail is not visible yet)
  const highlightedKey = pushed.isPhone && !pushed.detailOpen ? null : selectedKey;
  return (
    <MeetingsLayout
      tab={url.tab}
      onTabChange={url.setTab}
      onRefresh={refresh}
      loading={loading || refreshing}
      detailOpen={pushed.detailOpen}
      onBack={pushed.back}
      list={
        <MeetingList
          pmiNumber={pmiNumber}
          groups={groups}
          selectedKey={highlightedKey}
          onSelect={pushed.select}
          emptyText={emptyText}
          showCalendarFooter={url.tab === "upcoming"}
        />
      }
      detail={detail}
    />
  );
}
