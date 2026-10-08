"use client";

import { type CSSProperties, useRef } from "react";
import { ACTIVITY_IDS } from "../../constants";
import { useShellContext } from "../../context/ShellContext";
import { usePanelResize } from "../../hooks/usePanelResize";
import { PANEL_DEFAULT_WIDTH, PANEL_MAX_WIDTH } from "../../utils/panelWidth";
import { ActivityCenterPanel } from "./ActivityCenterPanel";
import styles from "./ActivityCenterDock.module.css";

/**
 * Docked right column of the Activity Center (PRD §6.5 [M]): while the bell is pressed the content
 * column shrinks (1280 → 946 at 1366×768), followed by a 6px col-resize handle and the 328×694 panel.
 * Rendered as two children of the shell's main body; ≤768px the panel is a full-screen sheet [D].
 */
export function ActivityCenterDock() {
  const shell = useShellContext();
  const panelRef = useRef<HTMLElement | null>(null);
  const { width, handleProps } = usePanelResize(panelRef);
  if (!shell?.activityOpen) return null;

  const style = { "--activity-panel-width": `${width}px` } as CSSProperties;
  /** ✕: the panel unmounts, so keyboard focus goes back to the bell [D] */
  const close = () => {
    shell.setActivityOpen(false);
    document.getElementById(ACTIVITY_IDS.toggle)?.focus({ preventScroll: true });
  };
  return (
    <>
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize Activity Center"
        aria-valuemin={PANEL_DEFAULT_WIDTH}
        aria-valuemax={PANEL_MAX_WIDTH}
        aria-valuenow={width}
        tabIndex={0}
        className={styles.handle}
        {...handleProps}
      />
      <ActivityCenterPanel ref={panelRef} style={style} onClose={close} />
    </>
  );
}
