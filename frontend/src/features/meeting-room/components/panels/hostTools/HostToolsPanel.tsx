"use client";

import { RoomBackIcon } from "@/shared/icons/generated/RoomBackIcon";
import { useRoomUi } from "../../../state/useRoomUi";
import { PanelHeaderActions } from "../PanelHeaderActions";
import { PanelShell } from "../PanelShell";
import { HOST_TOOLS_PAGES, PARENT_PAGE } from "./hostToolsPages";
import { HostToolsItemView } from "./HostToolsItemView";
import styles from "./HostToolsPanel.module.css";

/** Static Host tools panel with its drill-in pages (PRD §8.9). Mute All lives in the Participants panel. */
export function HostToolsPanel() {
  const { hostToolsPage, setHostToolsPage, closePanel } = useRoomUi();
  const page = HOST_TOOLS_PAGES[hostToolsPage];
  const parent = PARENT_PAGE[hostToolsPage];
  return (
    <PanelShell mode="full" aria-label="Host tools">
      <header className={styles.header}>
        {parent ? (
          <button type="button" className={styles.back} aria-label="Back" onClick={() => setHostToolsPage(parent)}>
            <RoomBackIcon />
          </button>
        ) : null}
        <h2 className={styles.title}>{page.title}</h2>
        <PanelHeaderActions mode="full" alt onToggleMinimize={() => undefined} onClose={() => closePanel("hostTools")} />
      </header>
      <div className={styles.content} key={hostToolsPage}>
        {page.items.map((item, index) => (
          <HostToolsItemView key={`${item.kind}-${index}`} item={item} onOpen={setHostToolsPage} />
        ))}
      </div>
    </PanelShell>
  );
}
