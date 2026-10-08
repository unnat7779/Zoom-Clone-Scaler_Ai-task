"use client";

import { useToggle } from "@/shared/hooks";
import { RoomSwitch } from "../../controls/RoomSwitch";
import styles from "./HostToolsItem.module.css";

/** Label + switch; toggles visually only (Static UI, PRD §8.9). */
export function HostToolsSwitchRow({ label, on }: { label: string; on: boolean }) {
  const [checked, toggle] = useToggle(on);
  return (
    <div className={styles.row}>
      {label}
      <RoomSwitch checked={checked} onChange={toggle} label={label} />
    </div>
  );
}
