"use client";

import { RoomHelpIcon } from "@/shared/icons/generated/RoomHelpIcon";
import { usePhoneRoom } from "../../../hooks/usePhoneRoom";
import { useRoomDevices } from "../../../realtime/useRoomDevices";
import { useRoomUi } from "../../../state/useRoomUi";
import { SettingsCheckbox } from "../controls/SettingsCheckbox";
import { SettingsSection } from "../controls/SettingsSection";
import { SettingsSelect } from "../controls/SettingsSelect";
import { SettingsVideoPreview } from "./SettingsVideoPreview";
import styles from "./VideoPane.module.css";

/**
 * Settings › Video (room-17): preview + options. "Hide Self View" is the room's own switch; the rest is static.
 * Phones hide the Video caret (DV10), so there the pane also offers the camera picker [D].
 */
export function VideoPane() {
  const { hideSelfView, toggleHideSelfView } = useRoomUi();
  const phone = usePhoneRoom();
  const devices = useRoomDevices();
  return (
    <>
      <SettingsVideoPreview />
      {phone ? (
        <div className={styles.camera}>
          <SettingsSection title="Camera">
            <SettingsSelect label="Camera" options={devices.cameras} value={devices.cameraId} onChange={devices.selectCamera} />
          </SettingsSection>
        </div>
      ) : null}
      <div className={styles.options}>
        <SettingsCheckbox label="Stop my video when joining" defaultChecked />
        <SettingsCheckbox label="Mirror my video" defaultChecked />
        <SettingsCheckbox label="Hide Non-video Participants" />
        <SettingsCheckbox label="Hide Self View" checked={hideSelfView} onChange={toggleHideSelfView} />
        <SettingsCheckbox label="Show me as an active speaker when I talk" />
      </div>
      <p className={styles.text}>Use hardware acceleration for:</p>
      <div className={styles.columns}>
        <span className={styles.withInfo}>
          <SettingsCheckbox label="Receiving video" defaultChecked />
          <RoomHelpIcon className={styles.info} />
        </span>
        <span className={styles.withInfo}>
          <SettingsCheckbox label="Sending video" defaultChecked />
          <RoomHelpIcon className={styles.info} />
        </span>
      </div>
      <div className={styles.rendering}>
        <p className={styles.renderingLabel}>Video Rendering Method</p>
        <button type="button" className={styles.select}>
          Auto
        </button>
      </div>
    </>
  );
}
