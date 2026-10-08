"use client";

import { Fragment, useRef } from "react";
import { useListboxNavigation } from "../../hooks/useListboxNavigation";
import type { DayGroup } from "../../utils/grouping";
import type { MeetingRow } from "../../utils/rows";
import { MeetingItem } from "./MeetingItem";
import styles from "./MeetingGroups.module.css";

interface MeetingGroupsProps {
  groups: DayGroup<MeetingRow>[];
  selectedKey: string | null;
  onSelect: (key: string) => void;
  /** "No upcoming meetings" / "No previous meetings" */
  emptyText: string;
}

/** `.meetings__groups` listbox — the only part of the column that scrolls (PRD §7.4.2). */
export function MeetingGroups({ groups, selectedKey, onSelect, emptyText }: MeetingGroupsProps) {
  const listRef = useRef<HTMLDivElement | null>(null);
  const onKeyDown = useListboxNavigation(listRef);

  if (groups.length === 0) {
    return (
      <div className={styles.groups}>
        <div className={styles.empty}>{emptyText}</div>
      </div>
    );
  }
  return (
    <div ref={listRef} role="listbox" tabIndex={0} aria-label="Meetings list" className={styles.groups} onKeyDown={onKeyDown}>
      {groups.map((group, index) => (
        <Fragment key={group.key}>
          {index > 0 ? <div className={styles.divider} /> : null}
          <div role="group" aria-label={group.label}>
            <div className={styles.label}>{group.label}</div>
            {group.items.map((row) => (
              <MeetingItem key={row.key} row={row} selected={row.key === selectedKey} onSelect={onSelect} />
            ))}
          </div>
        </Fragment>
      ))}
    </div>
  );
}
