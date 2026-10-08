"use client";

import { Fragment, type KeyboardEvent, type RefObject } from "react";
import clsx from "clsx";
import type { MediaDeviceOption } from "@/shared/media";
import { Portal, useMenuNavigation } from "@/shared/ui";
import { DeviceMenuItem } from "./DeviceMenuItem";
import styles from "./DeviceMenu.module.css";

export interface DeviceMenuSection {
  title: string;
  devices: MediaDeviceOption[];
  /** ✓ row; the first device (system default) when unknown */
  selectedId?: string;
  onSelect: (deviceId: string) => void;
}

interface DeviceMenuProps {
  menuRef: RefObject<HTMLUListElement | null>;
  label: string;
  sections: DeviceMenuSection[];
  onClose: () => void;
  /** Tab closes the menu and focuses its caret (Zoom's menu `onKeyDown`) */
  onTab: (event: KeyboardEvent) => void;
  /** phones [D]: a bottom sheet (portalled out of the card) over a dimmed page */
  sheet: boolean;
}

const isSelected = (section: DeviceMenuSection, device: MediaDeviceOption, index: number) =>
  section.devices.some((item) => item.deviceId === section.selectedId)
    ? device.deviceId === section.selectedId
    : index === 0;

/**
 * The pre-join's own `.preview__dropdown-menu` (not the room's): 300 wide, `#1A1A1A`, radius 8,
 * 8px above the control pill, bold 14px/32px titles, 14px/32px rows with a 24px ✓ at (4,4).
 * The menu itself takes focus; ArrowUp/ArrowDown move through the rows.
 */
export function DeviceMenu({ menuRef, label, sections, onClose, onTab, sheet }: DeviceMenuProps) {
  const navigate = useMenuNavigation(menuRef, false);
  const onKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    onTab(event);
    if (!event.defaultPrevented) navigate(event);
  };
  const menu = (
    <ul ref={menuRef} className={clsx(styles.menu, sheet && styles.sheet)} role="menu" aria-label={label} tabIndex={-1} onKeyDown={onKeyDown}>
      {sections.map((section, sectionIndex) => (
        <Fragment key={section.title}>
          {sectionIndex > 0 ? <li className={styles.divider} role="separator" /> : null}
          <li className={styles.title} role="presentation">
            {section.title}
          </li>
          {section.devices.map((device, index) => (
            <DeviceMenuItem
              key={device.deviceId || `${section.title}-${index}`}
              label={`${section.title} ${device.label}`}
              checked={isSelected(section, device, index)}
              onSelect={() => {
                section.onSelect(device.deviceId);
                onClose();
              }}
            >
              {device.label}
            </DeviceMenuItem>
          ))}
        </Fragment>
      ))}
    </ul>
  );
  if (!sheet) return menu;
  return (
    <Portal>
      <div className={styles.backdrop} aria-hidden />
      {menu}
    </Portal>
  );
}
