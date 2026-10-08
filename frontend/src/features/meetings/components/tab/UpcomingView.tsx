"use client";

import { useMemo } from "react";
import { MEDIA, useMediaQuery } from "@/shared/hooks/useMediaQuery";
import type { MeetingsUrlState } from "../../hooks/useMeetingsUrlState";
import { useUpcomingView } from "../../hooks/useUpcomingView";
import { toUpcomingRow } from "../../utils/rows";
import { EmptyDetail } from "./EmptyDetail";
import { MeetingsTabView } from "./MeetingsTabView";
import { PmiDetail } from "./PmiDetail";
import { ScheduledDetail } from "./ScheduledDetail";

/** Meetings → Upcoming: PMI card + day groups on the left, the selected entry on the right (PRD §7.4). */
export function UpcomingView({ url }: { url: MeetingsUrlState }) {
  const view = useUpcomingView(url.selectKey);
  const rowGroups = useMemo(() => view.groups.map((group) => ({ ...group, items: group.items.map(toUpcomingRow) })), [view.groups]);
  const selected = view.selected;
  // phones (DV11): the pushed detail of a deleted meeting closes back to the list; wider, the next row is selected
  const isPhone = useMediaQuery(MEDIA.phone);
  const afterDelete = (key: string) => (isPhone ? url.clearSelection() : url.setSelection(view.keyAfterRemoving(key)));

  const detail =
    selected?.kind === "pmi" ? (
      <PmiDetail key={selected.key} pmi={selected.meeting} />
    ) : selected?.kind === "meeting" ? (
      <ScheduledDetail key={selected.key} meeting={selected.meeting} onDeleted={() => afterDelete(selected.key)} />
    ) : (
      <EmptyDetail />
    );

  return (
    <MeetingsTabView
      url={url}
      loading={view.loading}
      refetch={view.refetch}
      groups={rowGroups}
      selectedKey={selected?.key ?? null}
      pmiNumber={view.pmi?.meeting_number}
      emptyText={view.failed ? "Unable to load meetings. Refresh to try again." : "No upcoming meetings"}
      detail={detail}
    />
  );
}
