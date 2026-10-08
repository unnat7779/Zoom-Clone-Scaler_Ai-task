"use client";

import clsx from "clsx";
import { useParticipantRows } from "../../../hooks/useParticipantRows";
import { useRoomUi } from "../../../state/useRoomUi";
import { PanelHeaderActions } from "../PanelHeaderActions";
import { type PanelMode, PanelShell } from "../PanelShell";
import { ParticipantRow } from "./ParticipantRow";
import { ParticipantsFooter } from "./ParticipantsFooter";
import styles from "./ParticipantsPanel.module.css";

/** "Participants (N)", the roster and the Invite / Mute All / More footer (PRD §8.8). */
export function ParticipantsPanel({ mode }: { mode: PanelMode }) {
  const rows = useParticipantRows();
  const { closePanel, toggleMinimized } = useRoomUi();
  return (
    <PanelShell mode={mode} aria-label="Participants">
      <header className={clsx(styles.header, mode === "mini" && styles.miniHeader)}>
        <h2 className={styles.title}>Participants ({rows.length})</h2>
        <PanelHeaderActions
          mode={mode}
          onToggleMinimize={() => toggleMinimized("participants")}
          onClose={() => closePanel("participants")}
        />
      </header>
      {mode !== "mini" ? (
        <div className={styles.content}>
          <div className={styles.list} role="list">
            {rows.map((row) => (
              <ParticipantRow key={row.participant.id} row={row} />
            ))}
          </div>
          <ParticipantsFooter />
        </div>
      ) : null}
    </PanelShell>
  );
}
