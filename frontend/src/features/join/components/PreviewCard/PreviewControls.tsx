"use client";

import type { PreviewMedia } from "../../hooks/usePreviewMedia";
import { ControlButton } from "./ControlButton";
import { MicControlIcon } from "./MicControlIcon";
import { VideoControlIcon } from "./VideoControlIcon";
import styles from "./PreviewControls.module.css";

/**
 * `.preview-video__control` (PRD §7.10.2): 176×52 pill with Mute/Unmute and
 * Stop/Start Video; each caret opens its device menu while the device is live.
 */
export function PreviewControls({ media }: { media: PreviewMedia }) {
  const { mic, camera, devices } = media;
  return (
    <div className={styles.bar}>
      <ControlButton
        label={mic.on ? "Mute" : "Unmute"}
        icon={<MicControlIcon control={mic} stream={media.audioStream} />}
        onToggle={mic.toggle}
        caretLabel="More audio controls"
        showCaret={mic.status === "granted"}
        menuSections={[
          { title: "Select a Microphone", devices: devices.microphones, selectedId: mic.selectedId, onSelect: mic.select },
          { title: "Select a Speaker", devices: devices.speakers, selectedId: media.speakerId, onSelect: media.selectSpeaker },
        ]}
      />
      <ControlButton
        label={camera.on ? "Stop Video" : "Start Video"}
        icon={<VideoControlIcon control={camera} />}
        onToggle={camera.toggle}
        caretLabel="More video controls"
        showCaret={camera.status === "granted"}
        menuSections={[
          { title: "Select a Camera", devices: devices.cameras, selectedId: camera.selectedId, onSelect: camera.select },
        ]}
      />
    </div>
  );
}
