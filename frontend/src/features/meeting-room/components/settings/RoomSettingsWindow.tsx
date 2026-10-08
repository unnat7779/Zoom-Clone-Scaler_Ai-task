"use client";

import { type ComponentType, useEffect, useRef } from "react";
import clsx from "clsx";
import { useEscapeKey } from "@/shared/hooks";
import { RoomCloseIcon } from "@/shared/icons/generated/RoomCloseIcon";
import touch from "@/shared/styles/touch.module.css";
import { useDragWindow } from "../../hooks/useDragWindow";
import { useRestoreFocus } from "../../hooks/useRestoreFocus";
import type { SettingsTab } from "../../state/roomUiReducer";
import { useRoomUi } from "../../state/useRoomUi";
import { AboutPane } from "./panes/AboutPane";
import { AudioPane } from "./panes/AudioPane";
import { BackgroundPane } from "./panes/BackgroundPane";
import { GeneralPane } from "./panes/GeneralPane";
import { StatisticsPane } from "./panes/StatisticsPane";
import { VideoPane } from "./panes/VideoPane";
import { SettingsTabList } from "./SettingsTabList";
import styles from "./RoomSettingsWindow.module.css";

const PANES: Record<SettingsTab, ComponentType> = {
  general: GeneralPane,
  video: VideoPane,
  audio: AudioPane,
  background: BackgroundPane,
  statistics: StatisticsPane,
  about: AboutPane,
};

/**
 * In-room Settings window (PRD §8.17, spec 05 §12): dark, modeless, draggable by its header, centred in the
 * room (757×565 at 261.5,64.5 in a 1280×694 room). Static UI except what the room
 * already does (always show controls, hide self view, microphone / speaker choice).
 */
export function RoomSettingsWindow({ tab }: { tab: SettingsTab }) {
  const { openSettings, closeSettings } = useRoomUi();
  const windowRef = useRef<HTMLDivElement | null>(null);
  const activeTabRef = useRef<HTMLButtonElement | null>(null);
  const Pane = PANES[tab];
  useEscapeKey(closeSettings, true);
  useRestoreFocus(true, windowRef);
  useDragWindow(windowRef, "header");
  useEffect(() => activeTabRef.current?.focus({ preventScroll: true }), []);

  return (
    <div className={styles.layer}>
      <div ref={windowRef} className={styles.window} role="dialog" aria-labelledby="room-settings-title">
        <header className={styles.header}>
          <h2 id="room-settings-title" className={styles.title}>
            Settings
          </h2>
          <button type="button" className={clsx(styles.close, touch.target)} aria-label="Close" onClick={closeSettings}>
            <RoomCloseIcon />
          </button>
        </header>
        <div className={styles.body}>
          <SettingsTabList tab={tab} onChange={openSettings} activeRef={activeTabRef} />
          <div id="room-settings-panel" className={styles.panel} role="tabpanel" aria-labelledby={`room-settings-tab-${tab}`}>
            <div className={styles.scroll}>
              <Pane />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
