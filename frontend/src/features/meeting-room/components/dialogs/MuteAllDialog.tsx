"use client";

import { useToggle } from "@/shared/hooks";
import { useHostControls } from "../../realtime/useHostControls";
import { DarkDialog } from "./DarkDialog";
import styles from "./MuteAllDialog.module.css";

/** Participants footer → Mute All (PRD §8.12.1): Cancel / Continue. */
export function MuteAllDialog({ onClose }: { onClose: () => void }) {
  const { muteAll } = useHostControls();
  const [allowUnmute, toggleAllowUnmute] = useToggle(true);
  return (
    <DarkDialog
      title="Mute all current and new participants"
      onDismiss={onClose}
      actions={[
        { label: "Cancel", onClick: onClose },
        {
          label: "Continue",
          kind: "primary",
          onClick: () => {
            muteAll(allowUnmute);
            onClose();
          },
        },
      ]}
    >
      <label className={styles.option}>
        <input type="checkbox" className={styles.box} checked={allowUnmute} onChange={toggleAllowUnmute} />
        Allow participants to unmute themselves
      </label>
    </DarkDialog>
  );
}
