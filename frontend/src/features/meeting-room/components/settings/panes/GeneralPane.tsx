"use client";

import { useState } from "react";
import clsx from "clsx";
import { useRoomUi } from "../../../state/useRoomUi";
import { SettingsCheckbox } from "../controls/SettingsCheckbox";
import { SettingsRadio } from "../controls/SettingsRadio";
import { SettingsSection } from "../controls/SettingsSection";
import styles from "./GeneralPane.module.css";

/** 👍 in Zoom's six skin tones (default first). */
const SKIN_TONES = ["👍", "👍🏻", "👍🏼", "👍🏽", "👍🏾", "👍🏿"];

/**
 * Settings › General (room-16): "Always show meeting controls" is the room's Ctrl+\ switch;
 * the gallery size, chat avatars and reactions rows are static.
 */
export function GeneralPane() {
  const { alwaysShowBars, toggleAlwaysShowBars } = useRoomUi();
  const [skinTone, setSkinTone] = useState(0);
  return (
    <>
      <SettingsSection>
        <SettingsCheckbox className={styles.first} label="Always show meeting controls" checked={alwaysShowBars} onChange={toggleAlwaysShowBars} />
      </SettingsSection>
      <SettingsSection title="Video">
        <p className={styles.text}>Maximum participants displayed per screen in Gallery View:</p>
        <div className={styles.radios}>
          <SettingsRadio name="room-settings-gallery" label="9 participants" />
          <SettingsRadio name="room-settings-gallery" label="25 participants" defaultChecked />
        </div>
      </SettingsSection>
      <SettingsSection title="Chat">
        <SettingsCheckbox label="Show user profile icon next to in-meeting chat messages" defaultChecked />
      </SettingsSection>
      <SettingsSection title="Reactions">
        <div className={styles.skinRow}>
          <span className={styles.skinLabel}>Skin Tone</span>
          {SKIN_TONES.map((emoji, index) => (
            <button
              key={emoji}
              type="button"
              className={clsx(styles.skin, index === skinTone && styles.skinSelected)}
              aria-pressed={index === skinTone}
              onClick={() => setSkinTone(index)}
            >
              {emoji}
            </button>
          ))}
        </div>
        <SettingsCheckbox label="Display your reactions above toolbar" defaultChecked />
        <SettingsCheckbox label="Animate emojis" defaultChecked />
      </SettingsSection>
    </>
  );
}
