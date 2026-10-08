"use client";

import { type RefObject, useRef } from "react";
import { MenuDivider, MenuGroupTitle } from "@/shared/ui";
import { usePopoverDismiss } from "../../hooks/usePopoverDismiss";
import { useRoomDevices } from "../../realtime/useRoomDevices";
import { useRoomUi } from "../../state/useRoomUi";
import { AvMenuItem } from "../menus/AvMenuItem";
import { RoomDropdown } from "../menus/RoomDropdown";
import styles from "./CaretMenu.module.css";

interface AudioMenuProps {
  anchorRef: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
}

/** Microphone and speaker pickers work; modes and tests are static; Audio Settings opens Settings › Audio (PRD §8.6.2). */
export function AudioMenu({ anchorRef, onClose }: AudioMenuProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const devices = useRoomDevices();
  const { openSettings } = useRoomUi();
  usePopoverDismiss([ref, anchorRef], true, onClose);
  const pick = (select: (id: string) => void, id: string) => () => {
    select(id);
    onClose();
  };

  return (
    <RoomDropdown ref={ref} className={styles.menu} aria-label="Audio options">
      <MenuGroupTitle>Select a Microphone</MenuGroupTitle>
      {devices.microphones.map((device) => (
        <AvMenuItem
          key={device.deviceId || device.label}
          selected={device.deviceId === devices.microphoneId}
          onSelect={pick(devices.selectMicrophone, device.deviceId)}
        >
          {device.label}
        </AvMenuItem>
      ))}
      <MenuDivider />
      <MenuGroupTitle>Select a Speaker</MenuGroupTitle>
      {devices.speakers.map((device) => (
        <AvMenuItem
          key={device.deviceId || device.label}
          selected={device.deviceId === devices.speakerId}
          onSelect={pick(devices.selectSpeaker, device.deviceId)}
        >
          {device.label}
        </AvMenuItem>
      ))}
      <MenuDivider />
      <MenuGroupTitle>Microphone modes</MenuGroupTitle>
      <AvMenuItem selected onSelect={onClose}>
        Background noise suppression
      </AvMenuItem>
      <MenuDivider />
      <AvMenuItem onSelect={onClose}>Test Speaker &amp; Microphone</AvMenuItem>
      <AvMenuItem onSelect={onClose}>Leave computer audio</AvMenuItem>
      <MenuDivider />
      <AvMenuItem onSelect={() => openSettings("audio")}>Audio Settings</AvMenuItem>
    </RoomDropdown>
  );
}
