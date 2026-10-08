"use client";

import { RoomHelpIcon } from "@/shared/icons/generated/RoomHelpIcon";
import { useRoomDevices } from "../../../realtime/useRoomDevices";
import { SettingsCheckbox } from "../controls/SettingsCheckbox";
import { SettingsRadio } from "../controls/SettingsRadio";
import { SettingsSection } from "../controls/SettingsSection";
import { SettingsSelect } from "../controls/SettingsSelect";
import styles from "./AudioPane.module.css";

/**
 * Settings › Audio (room-18). The speaker and microphone selects switch the real devices
 * (the same as the Audio caret menu — and the only device picker on phones); tests,
 * profile and options are static.
 */
export function AudioPane() {
  const devices = useRoomDevices();
  return (
    <div className={styles.pane}>
      <SettingsSection title="Speaker">
        <div className={styles.deviceRow}>
          <button type="button" className={styles.test}>
            Test Speaker
          </button>
          <SettingsSelect label="Speaker" options={devices.speakers} value={devices.speakerId} onChange={devices.selectSpeaker} />
        </div>
        <div className={styles.levelRow}>
          Output level:
          <span className={styles.level} aria-hidden />
        </div>
      </SettingsSection>
      <SettingsSection title="Microphone">
        <div className={styles.deviceRow}>
          <button type="button" className={styles.test} disabled>
            Test Mic
          </button>
          <SettingsSelect label="Microphone" options={devices.microphones} value={devices.microphoneId} onChange={devices.selectMicrophone} />
        </div>
        <div className={styles.levelRow}>
          Input level:
          <span className={styles.level} aria-hidden />
        </div>
      </SettingsSection>
      <SettingsSection title="Audio Profile">
        <p className={styles.text}>
          Background noise suppression <span className={styles.hint}>(recommended for most users)</span>
        </p>
        <div className={styles.radios}>
          <span className={styles.withInfo}>
            <SettingsRadio name="room-settings-noise" label="Zoom background noise removal" defaultChecked />
            <RoomHelpIcon className={styles.info} />
          </span>
          <SettingsRadio name="room-settings-noise" label="Browser built-in noise suppression" />
        </div>
        <div className={styles.divider} role="separator" />
        <div className={styles.options}>
          <SettingsCheckbox label="Mute my microphone when join a meeting" defaultChecked />
          <SettingsCheckbox label="Press and hold SPACE key to temporarily unmute yourself" />
          <SettingsCheckbox label="Sync buttons on headset" />
        </div>
      </SettingsSection>
    </div>
  );
}
