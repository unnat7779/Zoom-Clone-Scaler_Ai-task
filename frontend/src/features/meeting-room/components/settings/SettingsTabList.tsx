"use client";

import { type KeyboardEvent, type Ref } from "react";
import clsx from "clsx";
import type { SettingsTab } from "../../state/roomUiReducer";
import { SETTINGS_TABS } from "./settingsTabs";
import styles from "./SettingsTabList.module.css";

interface SettingsTabListProps {
  tab: SettingsTab;
  onChange: (tab: SettingsTab) => void;
  /** the selected tab (focused when the window opens) */
  activeRef?: Ref<HTMLButtonElement>;
}

/** Left rail: General · Video · Audio · Background · Statistics · About (↑/↓ move between tabs). */
export function SettingsTabList({ tab, onChange, activeRef }: SettingsTabListProps) {
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const index = SETTINGS_TABS.findIndex((item) => item.id === tab);
    const next = SETTINGS_TABS[(index + step + SETTINGS_TABS.length) % SETTINGS_TABS.length];
    if (!next) return;
    onChange(next.id);
    event.currentTarget.querySelector<HTMLButtonElement>(`#room-settings-tab-${next.id}`)?.focus();
  };

  return (
    <div className={styles.rail} role="tablist" aria-orientation="vertical" aria-label="Settings" onKeyDown={onKeyDown}>
      {SETTINGS_TABS.map((item) => {
        const selected = item.id === tab;
        return (
          <button
            key={item.id}
            ref={selected ? activeRef : undefined}
            type="button"
            role="tab"
            id={`room-settings-tab-${item.id}`}
            aria-selected={selected}
            aria-controls="room-settings-panel"
            tabIndex={selected ? 0 : -1}
            className={clsx(styles.tab, selected && styles.selected)}
            onClick={() => onChange(item.id)}
          >
            <span className={clsx(styles.chip, styles[item.id])}>{item.icon}</span>
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
