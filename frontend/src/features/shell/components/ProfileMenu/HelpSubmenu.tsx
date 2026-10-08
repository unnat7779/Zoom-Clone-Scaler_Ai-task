"use client";

import type { MouseEventHandler } from "react";
import { HomeMenuExternalIcon } from "@/shared/icons/generated/HomeMenuExternalIcon";
import { MenuDivider, MenuItem } from "@/shared/ui/Menu";
import { ProfileSubmenu } from "./ProfileSubmenu";

interface HelpSubmenuProps {
  row: HTMLElement;
  focusFirst: boolean;
  /** ↗ icons only on hover (desktop) or always (≤768 sheet) */
  externalOnHover: boolean;
  onBack: () => void;
  onMouseEnter: MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: MouseEventHandler<HTMLDivElement>;
  /** "About Zoom Workplace": closes the menu and opens the About modal */
  onAbout: () => void;
  /** the other entries are Static UI only: close the menu and show the demo toast */
  onSelect: () => void;
}

/** Help submenu 232×171 (01-shell-home §7.3): About · Zoom Support ↗ · Zoom Community ↗ · Report problem... */
export function HelpSubmenu({ row, focusFirst, externalOnHover, onBack, onMouseEnter, onMouseLeave, onAbout, onSelect }: HelpSubmenuProps) {
  const external = <HomeMenuExternalIcon width={14} height={14} />;
  return (
    <ProfileSubmenu row={row} title="Help" focusFirst={focusFirst} onBack={onBack} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <MenuItem onSelect={onAbout}>About Zoom Workplace</MenuItem>
      <MenuItem trailing={external} trailingOnHover={externalOnHover} onSelect={onSelect}>
        Zoom Support
      </MenuItem>
      <MenuItem trailing={external} trailingOnHover={externalOnHover} onSelect={onSelect}>
        Zoom Community
      </MenuItem>
      <MenuDivider />
      <MenuItem onSelect={onSelect}>Report problem...</MenuItem>
    </ProfileSubmenu>
  );
}
