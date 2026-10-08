"use client";

import { useState } from "react";
import clsx from "clsx";
import { RoomCloseIcon } from "@/shared/icons/generated/RoomCloseIcon";
import touch from "@/shared/styles/touch.module.css";
import { SettingsAccountPane } from "./SettingsAccountPane";
import { SettingsGeneralPane } from "./SettingsGeneralPane";
import { SettingsGlyph } from "./SettingsGlyph";
import { SETTINGS_SECTIONS, STATIC_PANES, type SettingsSectionId } from "./settingsSections";
import { SettingsStaticPane } from "./SettingsStaticPane";
import styles from "./SettingsModal.module.css";

const TILE_CLASS: Record<SettingsSectionId, string | undefined> = {
  general: styles.tileGeneral,
  audio: styles.tileMedia,
  video: styles.tileMedia,
  chat: styles.tileChat,
  account: styles.tileAccount,
};

/**
 * Settings header, section nav and pane. Mounted only while the dialog is open, so it always
 * reopens on General (as Zoom remounts its dialog).
 */
export function SettingsDialogContent({ onClose }: { onClose: () => void }) {
  const [section, setSection] = useState<SettingsSectionId>("general");

  const pane =
    section === "general" ? (
      <SettingsGeneralPane />
    ) : section === "account" ? (
      <SettingsAccountPane />
    ) : (
      <SettingsStaticPane key={section} groups={STATIC_PANES[section]} />
    );

  return (
    <>
      <div className={styles.header}>
        <span className={styles.title}>Settings</span>
        <button type="button" aria-label="Close" className={clsx(styles.close, touch.target)} onClick={onClose}>
          <RoomCloseIcon width={16} height={16} />
        </button>
      </div>
      <div className={styles.columns}>
        <nav className={styles.nav} aria-label="Settings sections">
          {SETTINGS_SECTIONS.map(({ id, label, glyph, glyphSize }) => (
            <button
              key={id}
              type="button"
              aria-current={section === id ? "page" : undefined}
              className={clsx(styles.navItem, { [styles.navItemActive ?? ""]: section === id })}
              onClick={() => setSection(id)}
            >
              <span className={clsx(styles.tile, TILE_CLASS[id])}>
                <SettingsGlyph name={glyph} size={glyphSize} />
              </span>
              {label}
            </button>
          ))}
        </nav>
        <div className={styles.pane}>{pane}</div>
      </div>
    </>
  );
}
