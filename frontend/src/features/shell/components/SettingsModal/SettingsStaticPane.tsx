"use client";

import { useState } from "react";
import { Checkbox } from "@/shared/ui/Checkbox";
import { Select } from "@/shared/ui/Select";
import type { SettingsGroup } from "./settingsSections";
import styles from "./SettingsModal.module.css";

const DEVICE_OPTIONS = [{ value: "system" as const, label: "Same as System" }];

/** Initial ticks of every checkbox row, keyed by label. */
const initialChecks = (groups: SettingsGroup[]) =>
  Object.fromEntries(groups.flatMap((group) => group.rows.flatMap((row) => (row.kind === "checkbox" ? [[row.label, row.checked]] : []))));

/**
 * A static settings pane (Audio, Video, Chat) in the General pane's style: bold group titles,
 * "Same as System" device selects and checkboxes that tick locally (nothing is saved).
 */
export function SettingsStaticPane({ groups }: { groups: SettingsGroup[] }) {
  const [checks, setChecks] = useState<Record<string, boolean>>(() => initialChecks(groups));
  return (
    <div className={styles.general}>
      {groups.map((group) => (
        <section key={group.title} className={styles.section}>
          <h3 className={styles.sectionTitle}>{group.title}</h3>
          <div className={styles.rows}>
            {group.rows.map((row) =>
              row.kind === "device" ? (
                <Select
                  key={row.label}
                  aria-label={row.label}
                  options={DEVICE_OPTIONS}
                  value="system"
                  onChange={() => undefined}
                  className={styles.device}
                />
              ) : (
                <Checkbox
                  key={row.label}
                  checked={checks[row.label] ?? false}
                  onChange={(checked) => setChecks((current) => ({ ...current, [row.label]: checked }))}
                  className={styles.checkboxRow}
                  label={row.label}
                />
              ),
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
