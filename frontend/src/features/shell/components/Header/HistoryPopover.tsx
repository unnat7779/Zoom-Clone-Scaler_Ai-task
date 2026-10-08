"use client";

import type { RefObject } from "react";
import clsx from "clsx";
import { Popover } from "@/shared/ui/Popover";
import { useLingering } from "@/shared/hooks/useLingering";
import { HISTORY_EXIT_MS } from "../../constants";
import styles from "./HistoryPopover.module.css";

interface HistoryPopoverProps {
  open: boolean;
  anchorRef: RefObject<HTMLElement | null>;
  onClose: () => void;
}

/** Header History popover — static empty state (PRD §6.3); fades in and out over 200ms. */
export function HistoryPopover({ open, anchorRef, onClose }: HistoryPopoverProps) {
  const exiting = useLingering(open, HISTORY_EXIT_MS);
  return (
    <Popover
      open={open || exiting}
      onClose={onClose}
      anchorRef={anchorRef}
      placement="bottom-start"
      offset={8}
      variant="plain"
      motion="none"
      closeOnOutsideClick={open}
      closeOnEscape={open}
      aria-label="History"
      className={clsx(styles.paper, { [styles.exiting ?? ""]: exiting })}
    >
      <div className={styles.empty}>
        <p className={styles.text}>No session history yet</p>
      </div>
    </Popover>
  );
}
