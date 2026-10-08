"use client";

import type { KeyboardEvent } from "react";
import clsx from "clsx";
import touch from "@/shared/styles/touch.module.css";
import { IconButton } from "@/shared/ui/IconButton";
import { useToast } from "@/shared/ui/Toast";
import { ACTIVITY_IDS } from "../../constants";
import { FilterIcon } from "./icons/FilterIcon";
import { MarkAllReadIcon } from "./icons/MarkAllReadIcon";
import styles from "./ActivityCenterTabs.module.css";

export type ActivityTab = "focus" | "other";

const TABS: Array<{ id: ActivityTab; label: string }> = [
  { id: "focus", label: "Focus" },
  { id: "other", label: "Other" },
];

interface ActivityCenterTabsProps {
  selected: ActivityTab;
  onSelect: (tab: ActivityTab) => void;
}

/**
 * "Focus" / "Other" tabs with the (static) filter and mark-all-read buttons on the right [D].
 * One Tab stop; ← / → switch tabs (WAI-ARIA tabs).
 */
export function ActivityCenterTabs({ selected, onSelect }: ActivityCenterTabsProps) {
  const toast = useToast();

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const next = selected === "focus" ? "other" : "focus";
    onSelect(next);
    event.currentTarget.querySelector<HTMLElement>(`[data-tab="${next}"]`)?.focus();
  };

  return (
    <div className={styles.row}>
      <div role="tablist" aria-label="Notifications" className={styles.tabs} onKeyDown={onKeyDown}>
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            role="tab"
            data-tab={id}
            tabIndex={selected === id ? 0 : -1}
            aria-selected={selected === id}
            aria-controls={ACTIVITY_IDS.tabpanel}
            className={clsx(styles.tab, { [styles.selected ?? ""]: selected === id })}
            onClick={() => onSelect(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className={styles.tools}>
        <IconButton label="Filter" size="sm" icon={<FilterIcon />} className={clsx(styles.tool, touch.target)} onClick={toast.notAvailable} />
        <IconButton label="Mark all as read" size="sm" icon={<MarkAllReadIcon />} className={clsx(styles.tool, touch.target)} onClick={toast.notAvailable} />
      </div>
    </div>
  );
}
