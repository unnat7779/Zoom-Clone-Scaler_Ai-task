"use client";

import clsx from "clsx";
import { RoomCloseIcon } from "@/shared/icons/generated/RoomCloseIcon";
import { RoomCollapseToTitleIcon } from "@/shared/icons/generated/RoomCollapseToTitleIcon";
import { RoomExpandAllIcon } from "@/shared/icons/generated/RoomExpandAllIcon";
import { RoomPopoutIcon } from "@/shared/icons/generated/RoomPopoutIcon";
import type { PanelMode } from "./PanelShell";
import styles from "./PanelHeaderActions.module.css";

interface PanelHeaderActionsProps {
  mode: PanelMode;
  onToggleMinimize: () => void;
  onClose: () => void;
  /** #CAD1D5 icons (Chat, Host tools) */
  alt?: boolean;
  /** Chat: right 8 instead of 16 */
  compact?: boolean;
}

/** [Minimize / Expand — only when stacked] · Pop Out (static) · Close. */
export function PanelHeaderActions({ mode, onToggleMinimize, onClose, alt = false, compact = false }: PanelHeaderActionsProps) {
  return (
    <div className={clsx(styles.actions, alt && styles.alt, compact && styles.compact)}>
      {mode !== "full" ? (
        <button type="button" className={styles.button} aria-label={mode === "mini" ? "expand" : "minimize"} onClick={onToggleMinimize}>
          {mode === "mini" ? <RoomExpandAllIcon /> : <RoomCollapseToTitleIcon />}
        </button>
      ) : null}
      <button type="button" className={clsx(styles.button, styles.popout)} aria-label="Pop Out">
        <RoomPopoutIcon />
      </button>
      <button type="button" className={styles.button} aria-label="Close" onClick={onClose}>
        <RoomCloseIcon />
      </button>
    </div>
  );
}
