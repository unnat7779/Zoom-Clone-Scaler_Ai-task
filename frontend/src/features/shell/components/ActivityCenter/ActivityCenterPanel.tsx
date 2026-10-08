"use client";

import { type CSSProperties, type Ref, useState } from "react";
import { ACTIVITY_IDS } from "../../constants";
import { ActivityCenterHeader } from "./ActivityCenterHeader";
import { type ActivityTab, ActivityCenterTabs } from "./ActivityCenterTabs";
import { ActivityEmptyState } from "./ActivityEmptyState";
import styles from "./ActivityCenterPanel.module.css";

interface ActivityCenterPanelProps {
  ref: Ref<HTMLElement>;
  /** carries `--activity-panel-width` (the resize handle's value) */
  style: CSSProperties;
  onClose: () => void;
}

/**
 * The Activity Center panel (PRD §6.5; Zoom renders it in a cross-origin iframe, so the contents
 * are [D] from `home-03-activity-center.jpg`): header, Focus / Other tabs and their empty states.
 */
export function ActivityCenterPanel({ ref, style, onClose }: ActivityCenterPanelProps) {
  const [tab, setTab] = useState<ActivityTab>("focus");
  return (
    <aside ref={ref} id={ACTIVITY_IDS.panel} style={style} className={styles.panel} aria-label="Activity Center">
      <ActivityCenterHeader onClose={onClose} />
      <ActivityCenterTabs selected={tab} onSelect={setTab} />
      <div id={ACTIVITY_IDS.tabpanel} role="tabpanel" className={styles.body}>
        <ActivityEmptyState tab={tab} onViewOther={() => setTab("other")} />
      </div>
    </aside>
  );
}
