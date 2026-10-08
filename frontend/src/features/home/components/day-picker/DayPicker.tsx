"use client";

import type { RefObject } from "react";
import { MEDIA, useMediaQuery } from "@/shared/hooks/useMediaQuery";
import { Popover } from "@/shared/ui";
import { SHORT_VIEWPORT_QUERY } from "../../constants";
import { DayPickerPanel } from "./DayPickerPanel";
import styles from "./DayPicker.module.css";

interface DayPickerProps {
  open: boolean;
  anchorRef: RefObject<HTMLElement | null>;
  selected: Date;
  today: Date;
  onSelect: (day: Date) => void;
  onClose: () => void;
}

/**
 * Calendar-widget day picker (PRD §7.1.7): zoom-ui floating container 312×368, radius 16, always
 * 10px under the date button with the arrow on top — it never flips or moves up, so a short
 * viewport clips its bottom, as Zoom's card does. On phones and short (landscape) screens [D] it
 * is kept inside the viewport instead: it flips above the button when there is no room below (the
 * arrow follows), else it is pushed on screen and may cover the button (no arrow). Rendered in a
 * portal so the content card never clips it. Focus is trapped inside and returns to the date
 * button on close.
 */
export function DayPicker({ open, anchorRef, selected, today, onSelect, onClose }: DayPickerProps) {
  const short = useMediaQuery(SHORT_VIEWPORT_QUERY);
  const phone = useMediaQuery(MEDIA.phone);
  const keepOnScreen = short || phone;
  return (
    <Popover
      open={open}
      onClose={onClose}
      anchorRef={anchorRef}
      placement="bottom"
      offset={10}
      flip={keepOnScreen}
      viewportClamp={keepOnScreen ? "both" : "horizontal"}
      variant="plain"
      motion="zoom-in"
      trapFocus
      aria-label="Select a date"
      className={styles.picker}
    >
      <DayPickerPanel selected={selected} today={today} onSelect={onSelect} />
    </Popover>
  );
}
