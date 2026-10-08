"use client";

import type { MouseEventHandler } from "react";
import { HomeMenuChevronRightIcon } from "@/shared/icons/generated/HomeMenuChevronRightIcon";
import type { PresenceStatus } from "@/shared/ui/Avatar";
import { MenuItem } from "@/shared/ui/Menu";
import { useHoverSubmenus } from "../../hooks/useHoverSubmenus";
import { ProfileSubmenu } from "./ProfileSubmenu";
import { StatusItem } from "./StatusItem";
import styles from "./ProfileMenu.module.css";

const STATUSES: PresenceStatus[] = ["available", "busy", "dnd", "away", "ooo"];
/** Zoom's labels, sic ("1 hours"), ids `pwa-status-dnd-20/60/120/240/480/1440`. */
const DND_DURATIONS = ["20 minutes", "1 hours", "2 hours", "4 hours", "8 hours", "24 hours"];

interface StatusSubmenuProps {
  row: HTMLElement;
  focusFirst: boolean;
  hoverEnabled: boolean;
  onBack: () => void;
  onMouseEnter: MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: MouseEventHandler<HTMLDivElement>;
  /** sets the local presence (PRD §6.6 [D]) and closes the profile menu */
  onSelectStatus: (status: PresenceStatus) => void;
}

/**
 * Status submenu 232×186 (01-shell-home §7.2): Available · Busy · Do Not Disturb › · Away ·
 * Out of Office; Do Not Disturb opens the 232×218 duration submenu further left.
 */
export function StatusSubmenu({ row, focusFirst, hoverEnabled, onBack, onMouseEnter, onMouseLeave, onSelectStatus }: StatusSubmenuProps) {
  const dnd = useHoverSubmenus<"dnd">(hoverEnabled);
  const chevron = <HomeMenuChevronRightIcon width={16} height={16} className={styles.chevron} />;

  const durations = dnd.open ? (
    <ProfileSubmenu row={dnd.open.row} title="Do Not Disturb" focusFirst={dnd.open.focusFirst} onBack={dnd.back} {...dnd.panelProps}>
      {DND_DURATIONS.map((duration) => (
        <MenuItem key={duration} onSelect={() => onSelectStatus("dnd")}>
          {duration}
        </MenuItem>
      ))}
    </ProfileSubmenu>
  ) : null;

  return (
    <ProfileSubmenu
      row={row}
      title="Status"
      focusFirst={focusFirst}
      onBack={onBack}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      nested={durations}
    >
      {STATUSES.map((status) =>
        status === "dnd" ? (
          <StatusItem key={status} status={status} trailing={chevron} {...dnd.rowProps("dnd")} />
        ) : (
          <StatusItem key={status} status={status} onSelect={() => onSelectStatus(status)} />
        ),
      )}
    </ProfileSubmenu>
  );
}
