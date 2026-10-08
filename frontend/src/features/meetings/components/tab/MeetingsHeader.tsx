import type { KeyboardEvent } from "react";
import clsx from "clsx";
import { MtgMeetingsRefreshIcon } from "@/shared/icons/generated/MtgMeetingsRefreshIcon";
import type { MeetingsTab } from "../../types";
import styles from "./MeetingsHeader.module.css";

const TABS: { value: MeetingsTab; label: string }[] = [
  { value: "upcoming", label: "Upcoming" },
  { value: "previous", label: "Previous" },
];

/** id of the `role=tabpanel` container in `MeetingsLayout` */
export const MEETINGS_TABPANEL_ID = "meetings-tabpanel";

interface MeetingsHeaderProps {
  tab: MeetingsTab;
  onTabChange: (tab: MeetingsTab) => void;
  onRefresh: () => void;
}

/**
 * 360×46 header: refresh button pinned left (PRD §7.4.2) and the clone's
 * Upcoming | Previous segments (DV3; Zoom shows the static word "Upcoming").
 * Left / Right arrows switch the segment (WAI-ARIA tabs).
 */
export function MeetingsHeader({ tab, onTabChange, onRefresh }: MeetingsHeaderProps) {
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const next = tab === "upcoming" ? "previous" : "upcoming";
    onTabChange(next);
    event.currentTarget.querySelector<HTMLElement>(`[data-tab="${next}"]`)?.focus();
  };
  return (
    <div className={styles.header}>
      <button type="button" className={styles.refresh} aria-label="Refresh" onClick={onRefresh}>
        <MtgMeetingsRefreshIcon className={styles.refreshIcon} />
      </button>
      <div role="tablist" aria-label="Meetings" className={styles.tabs} onKeyDown={onKeyDown}>
        {TABS.map((item) => (
          <button
            key={item.value}
            type="button"
            role="tab"
            data-tab={item.value}
            aria-selected={tab === item.value}
            aria-controls={MEETINGS_TABPANEL_ID}
            tabIndex={tab === item.value ? 0 : -1}
            className={clsx(styles.tab, { [styles.active ?? ""]: tab === item.value })}
            onClick={() => onTabChange(item.value)}
          >
            {item.label}
            <span aria-hidden className={styles.boldWidth}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
