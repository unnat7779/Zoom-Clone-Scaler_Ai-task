"use client";

import { type RefObject, useRef } from "react";
import { useToggle } from "@/shared/hooks";
import { MenuDivider, MenuGroupTitle } from "@/shared/ui";
import { usePopoverDismiss } from "../../hooks/usePopoverDismiss";
import { useRoomDevices } from "../../realtime/useRoomDevices";
import { useRoomUi } from "../../state/useRoomUi";
import { RoomSwitch } from "../controls/RoomSwitch";
import { AvMenuItem } from "../menus/AvMenuItem";
import { RoomDropdown } from "../menus/RoomDropdown";
import styles from "./CaretMenu.module.css";

interface VideoMenuProps {
  anchorRef: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
}

/** Camera picker works; blur is static; the other rows open the static Settings window (PRD §8.6.3). */
export function VideoMenu({ anchorRef, onClose }: VideoMenuProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const devices = useRoomDevices();
  const { openSettings } = useRoomUi();
  const [blur, toggleBlur] = useToggle(false);
  usePopoverDismiss([ref, anchorRef], true, onClose);

  return (
    <RoomDropdown ref={ref} className={styles.menu} aria-label="Video options">
      <MenuGroupTitle>Select a Camera</MenuGroupTitle>
      {devices.cameras.map((device) => (
        <AvMenuItem
          key={device.deviceId || device.label}
          selected={device.deviceId === devices.cameraId}
          onSelect={() => {
            devices.selectCamera(device.deviceId);
            onClose();
          }}
        >
          {device.label}
        </AvMenuItem>
      ))}
      <MenuDivider />
      <div className={styles.switchRow}>
        <span className={styles.switchLabel}>Blur my background</span>
        <RoomSwitch checked={blur} onChange={toggleBlur} label="Blur my background" />
      </div>
      <AvMenuItem onSelect={() => openSettings("background")}>Choose Background...</AvMenuItem>
      <MenuDivider />
      <AvMenuItem onSelect={() => openSettings("video")}>Video Settings...</AvMenuItem>
    </RoomDropdown>
  );
}
