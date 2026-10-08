import type { DayGroup } from "../../utils/grouping";
import type { MeetingRow } from "../../utils/rows";
import { AddCalendarFooter } from "./AddCalendarFooter";
import { MeetingGroups } from "./MeetingGroups";
import { PmiCard } from "./PmiCard";
import styles from "./MeetingList.module.css";

interface MeetingListProps {
  /** PMI card (Upcoming only) */
  pmiNumber?: string | null;
  groups: DayGroup<MeetingRow>[];
  selectedKey: string | null;
  onSelect: (key: string) => void;
  emptyText: string;
  /** "Add a calendar" (Upcoming only: its popover talks about upcoming meetings) */
  showCalendarFooter: boolean;
}

/** Left column body (`.meetings`): PMI card + divider, scrolling groups, "Add a calendar" footer. */
export function MeetingList({ pmiNumber, groups, selectedKey, onSelect, emptyText, showCalendarFooter }: MeetingListProps) {
  return (
    <div className={styles.list}>
      {pmiNumber ? <PmiCard number={pmiNumber} selected={selectedKey === pmiNumber} onSelect={() => onSelect(pmiNumber)} /> : null}
      <MeetingGroups groups={groups} selectedKey={selectedKey} onSelect={onSelect} emptyText={emptyText} />
      {showCalendarFooter ? <AddCalendarFooter /> : null}
    </div>
  );
}
