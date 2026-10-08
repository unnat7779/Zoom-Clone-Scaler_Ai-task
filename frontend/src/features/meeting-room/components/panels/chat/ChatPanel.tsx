"use client";

import { useRef } from "react";
import { RoomChatSvgChatPersistentHeaderIcon } from "@/shared/icons/generated/RoomChatSvgChatPersistentHeaderIcon";
import { useMeetingRoom } from "../../../realtime/useMeetingRoom";
import { useRoomUi } from "../../../state/useRoomUi";
import { PanelHeaderActions } from "../PanelHeaderActions";
import { type PanelMode, PanelShell } from "../PanelShell";
import { ChatCoachmark } from "./ChatCoachmark";
import { ChatComposer } from "./ChatComposer";
import { ChatDisclaimer } from "./ChatDisclaimer";
import styles from "./ChatPanel.module.css";

/** Meeting chat look-alike: header, empty list notice, disclaimer, composer — nothing is sent (PRD §2.2). */
export function ChatPanel({ mode }: { mode: PanelMode }) {
  const { meeting } = useMeetingRoom();
  const { closePanel, toggleMinimized } = useRoomUi();
  const persistentRef = useRef<HTMLButtonElement | null>(null);
  return (
    <PanelShell mode={mode} bordered={false} aria-label="Chat">
      <header className={styles.header}>
        <button ref={persistentRef} type="button" className={styles.persistent} aria-label="Open in Team Chat" disabled>
          <RoomChatSvgChatPersistentHeaderIcon />
        </button>
        <span className={styles.topic}>{meeting?.topic}</span>
        <PanelHeaderActions mode={mode} alt compact onToggleMinimize={() => toggleMinimized("chat")} onClose={() => closePanel("chat")} />
      </header>
      {mode !== "mini" ? (
        <>
          <div className={styles.list}>
            <p className={styles.notice}>
              Messages addressed to &quot;Meeting Group Chat&quot; will also appear in the meeting group chat in Team Chat
            </p>
          </div>
          <ChatDisclaimer />
          <ChatComposer />
          {/* keyed by mode: stacking the panels moves the header, so the coachmark is placed again */}
          <ChatCoachmark key={mode} anchorRef={persistentRef} />
        </>
      ) : null}
    </PanelShell>
  );
}
