"use client";

import { RoomChevronRightIcon } from "@/shared/icons/generated/RoomChevronRightIcon";
import { useMeetingRoom } from "../../../realtime/useMeetingRoom";
import type { HostToolsPage } from "../../../state/roomUiReducer";
import type { HostToolsItem } from "./hostToolsPages";
import { HostToolsSwitchRow } from "./HostToolsSwitchRow";
import styles from "./HostToolsItem.module.css";

interface HostToolsItemViewProps {
  item: HostToolsItem;
  onOpen: (page: HostToolsPage) => void;
}

/** One Host tools row: visual-only switch, drill-in, danger action, section label, select or divider. */
export function HostToolsItemView({ item, onOpen }: HostToolsItemViewProps) {
  const { settings } = useMeetingRoom();
  switch (item.kind) {
    case "switch": {
      const on = item.setting ? settings[item.setting] : item.on;
      // keyed by the live value: a later Mute All resets the visual switch
      return <HostToolsSwitchRow key={String(on)} label={item.label} on={on} />;
    }
    case "link":
      return (
        <button type="button" className={styles.link} onClick={() => item.page && onOpen(item.page)}>
          {item.label}
          <span className={styles.chevron} aria-hidden />
        </button>
      );
    case "danger":
      return (
        <button type="button" className={styles.danger}>
          {item.label}
        </button>
      );
    case "section":
      return <div className={styles.section}>{item.label}</div>;
    case "select":
      return (
        <div className={styles.field}>
          {item.label}
          <button type="button" className={styles.select} disabled={item.disabled}>
            {item.value}
            <RoomChevronRightIcon />
          </button>
        </div>
      );
    case "divider":
      return <div className={styles.divider} role="separator" />;
  }
}
