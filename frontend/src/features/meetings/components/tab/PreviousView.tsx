"use client";

import { useMemo } from "react";
import type { MeetingsUrlState } from "../../hooks/useMeetingsUrlState";
import { usePreviousView } from "../../hooks/usePreviousView";
import { toPreviousRow } from "../../utils/rows";
import { EmptyDetail } from "./EmptyDetail";
import { MeetingsTabView } from "./MeetingsTabView";
import { PreviousDetail } from "./PreviousDetail";

/** Meetings → Previous (DV3): ended meetings with the same item component and their details. */
export function PreviousView({ url }: { url: MeetingsUrlState }) {
  const view = usePreviousView(url.selectKey);
  const rowGroups = useMemo(() => view.groups.map((group) => ({ ...group, items: group.items.map(toPreviousRow) })), [view.groups]);
  const selected = view.selected;

  return (
    <MeetingsTabView
      url={url}
      loading={view.loading}
      refetch={view.refetch}
      groups={rowGroups}
      selectedKey={selected?.key ?? null}
      emptyText={view.failed ? "Unable to load meetings. Refresh to try again." : "No previous meetings"}
      detail={selected ? <PreviousDetail key={selected.key} instance={selected.instance} /> : <EmptyDetail text="No previous meetings" />}
    />
  );
}
