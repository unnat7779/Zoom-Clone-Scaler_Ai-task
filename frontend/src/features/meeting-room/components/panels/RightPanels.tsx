"use client";

import { useRef } from "react";
import clsx from "clsx";
import { useDragWindow } from "../../hooks/useDragWindow";
import { usePanelLayout } from "../../hooks/usePanelLayout";
import { useRoomUi } from "../../state/useRoomUi";
import type { PanelId } from "../../state/roomUiReducer";
import { ChatPanel } from "./chat/ChatPanel";
import { HostToolsPanel } from "./hostTools/HostToolsPanel";
import { ParticipantsPanel } from "./participants/ParticipantsPanel";
import styles from "./RightPanels.module.css";

/**
 * Participants and Chat can stack; a minimized one becomes a 44px bar at the bottom (PRD §8.7).
 * The container is Zoom's side column, a draggable pop-out window on narrow rooms, or a phone
 * sheet (`data-panel-layout`, utils/panelLayout).
 */
export function RightPanels() {
  const { panels, minimized } = useRoomUi();
  const layout = usePanelLayout();
  const ref = useRef<HTMLElement | null>(null);
  useDragWindow(ref, "header", layout === "floating");
  const stacked = panels.length > 1;
  const ordered: PanelId[] = minimized ? [...panels.filter((panel) => panel !== minimized), minimized] : panels;
  return (
    <aside ref={ref} className={clsx(styles.container, styles[layout])} data-panel-layout={layout}>
      {ordered.map((panel) => {
        const mode = !stacked ? "full" : panel === minimized ? "mini" : "half";
        if (panel === "participants") return <ParticipantsPanel key={panel} mode={mode} />;
        if (panel === "chat") return <ChatPanel key={panel} mode={mode} />;
        return <HostToolsPanel key={panel} />;
      })}
    </aside>
  );
}
