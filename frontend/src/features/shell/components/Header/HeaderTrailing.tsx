"use client";

import clsx from "clsx";
import { HeaderBellIcon } from "@/shared/icons/generated/HeaderBellIcon";
import touch from "@/shared/styles/touch.module.css";
import { IconButton } from "@/shared/ui/IconButton";
import { useToast } from "@/shared/ui/Toast";
import { Tooltip } from "@/shared/ui/Tooltip";
import { ACTIVITY_IDS } from "../../constants";
import { useShellContext } from "../../context/ShellContext";
import styles from "./HeaderItems.module.css";

/**
 * Admin Center · Download · Upgrade (Static UI only) and the Activity Center bell, a toggle for the
 * docked panel (PRD §6.2, §6.5).
 */
export function HeaderTrailing() {
  const toast = useToast();
  const shell = useShellContext();
  const activityOpen = shell?.activityOpen ?? false;
  return (
    <div className={styles.trailing}>
      <button type="button" className={clsx(styles.item, styles.admin)} onClick={toast.notAvailable}>
        Admin Center
      </button>
      <button type="button" className={clsx(styles.download, styles.hideTablet)} onClick={toast.notAvailable}>
        Download
      </button>
      <button type="button" className={clsx(styles.upgrade, styles.hideTablet)} onClick={toast.notAvailable}>
        Upgrade
      </button>
      <Tooltip content="Activity Center">
        <IconButton
          id={ACTIVITY_IDS.toggle}
          label="Activity Center"
          icon={<HeaderBellIcon />}
          aria-pressed={activityOpen}
          aria-controls={activityOpen ? ACTIVITY_IDS.panel : undefined}
          className={clsx(styles.bell, touch.target)}
          onClick={() => shell?.setActivityOpen(!activityOpen)}
        />
      </Tooltip>
    </div>
  );
}
