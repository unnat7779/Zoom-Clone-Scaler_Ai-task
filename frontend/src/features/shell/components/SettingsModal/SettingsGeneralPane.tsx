"use client";

import { useState } from "react";
import { Checkbox } from "@/shared/ui/Checkbox";
import { useToast } from "@/shared/ui/Toast";
import styles from "./SettingsModal.module.css";

/** Static "General" pane of the Settings placeholder. */
export function SettingsGeneralPane() {
  const [autoCall, setAutoCall] = useState(false);
  const toast = useToast();
  return (
    <div className={styles.general}>
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div>
            <h3 className={styles.sectionTitle}>Navigation</h3>
            <p className={styles.sectionHint}>Drag items to reorder the toolbar</p>
          </div>
          <button type="button" className={styles.reset} onClick={toast.notAvailable}>
            Reset to default
          </button>
        </div>
      </section>
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Auto-call</h3>
        <Checkbox
          checked={autoCall}
          onChange={setAutoCall}
          className={styles.autoCall}
          label="Automatically receive a call when a scheduled meeting starts"
        />
      </section>
    </div>
  );
}
