"use client";

import { useRef } from "react";
import { HeaderBackIcon } from "@/shared/icons/generated/HeaderBackIcon";
import { HeaderForwardIcon } from "@/shared/icons/generated/HeaderForwardIcon";
import { HomeHeaderHistoryIcon } from "@/shared/icons/generated/HomeHeaderHistoryIcon";
import { IconButton } from "@/shared/ui/IconButton";
import { Tooltip } from "@/shared/ui/Tooltip";
import { useShellMenu } from "../../hooks/useShellIntegration";
import { HistoryPopover } from "./HistoryPopover";
import styles from "./NavCluster.module.css";

/**
 * Back / Forward (always disabled, as in Zoom outside Team Chat) and History,
 * which toggles the "No session history yet" popover (PRD §6.2–6.3).
 */
export function NavCluster() {
  const historyRef = useRef<HTMLButtonElement | null>(null);
  const history = useShellMenu("history");

  return (
    <div className={styles.cluster}>
      <IconButton label="Back" title="Back(⌘+[)" aria-disabled size="sm" shape="rounded" icon={<HeaderBackIcon />} className={styles.button} />
      <IconButton label="Forward" title="Forward(⌘+])" aria-disabled size="sm" shape="rounded" icon={<HeaderForwardIcon />} className={styles.button} />
      <Tooltip content="History" variant="mui-dark" disabled={history.open}>
        <IconButton
          ref={historyRef}
          label="History"
          size="sm"
          shape="rounded"
          icon={<HomeHeaderHistoryIcon />}
          aria-expanded={history.open}
          aria-haspopup="dialog"
          className={styles.button}
          onClick={history.toggle}
        />
      </Tooltip>
      <HistoryPopover open={history.open} anchorRef={historyRef} onClose={history.close} />
    </div>
  );
}
