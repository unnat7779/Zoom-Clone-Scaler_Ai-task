"use client";

import { useRef, useState } from "react";
import { HomeCalMoreIcon } from "@/shared/icons/generated/HomeCalMoreIcon";
import { HomeCalRefreshIcon } from "@/shared/icons/generated/HomeCalRefreshIcon";
import touch from "@/shared/styles/touch.module.css";
import { IconButton, Menu, MenuGroupTitle, MenuItem, Popover } from "@/shared/ui";
import styles from "./CalendarMoreMenu.module.css";

const FILTERS = ["Hosted by you", "With cloud recordings", "With meeting summary"] as const;
type Filter = (typeof FILTERS)[number];

/**
 * "More calendar actions" (PRD §7.1.6): "Filter by" check items (Static UI only — they toggle
 * their ✓ but filter nothing) and Refresh, which reloads the day under the loading overlay.
 * Opens below the button, right-aligned [D] (Zoom's own placement is clipped).
 */
export function CalendarMoreMenu({ onRefresh }: { onRefresh: () => void }) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState<ReadonlySet<Filter>>(new Set());

  const toggle = (filter: Filter) =>
    setChecked((current) => {
      const next = new Set(current);
      if (!next.delete(filter)) next.add(filter);
      return next;
    });

  return (
    <>
      <IconButton
        ref={buttonRef}
        label="More calendar actions"
        size="sm"
        icon={<HomeCalMoreIcon />}
        className={touch.target}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      />
      <Popover
        open={open}
        onClose={() => setOpen(false)}
        anchorRef={buttonRef}
        placement="bottom-end"
        motion="zoom-in"
        className={styles.popover}
      >
        <Menu aria-label="More calendar actions" autoFocus>
          <MenuGroupTitle>Filter by</MenuGroupTitle>
          {FILTERS.map((filter) => (
            <MenuItem key={filter} className={styles.filter} selected={checked.has(filter)} onSelect={() => toggle(filter)}>
              {filter}
            </MenuItem>
          ))}
          <MenuItem
            className={styles.refresh}
            icon={<HomeCalRefreshIcon className={styles.refreshIcon} />}
            onSelect={() => {
              setOpen(false);
              onRefresh();
            }}
          >
            Refresh
          </MenuItem>
        </Menu>
      </Popover>
    </>
  );
}
