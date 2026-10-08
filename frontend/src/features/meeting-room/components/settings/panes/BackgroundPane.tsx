"use client";

import { useState } from "react";
import clsx from "clsx";
import { SchPlusIcon } from "@/shared/icons/generated/SchPlusIcon";
import { SettingsSection } from "../controls/SettingsSection";
import { SettingsVideoPreview } from "./SettingsVideoPreview";
import styles from "./BackgroundPane.module.css";

const BACKGROUNDS = ["None", "Blur", "San Francisco", "Grass", "Earth", "Japanese Garden"];

/** Settings › Background (spec 05 §12): preview + background picker — selection is visual only (Static UI). */
export function BackgroundPane() {
  const [selected, setSelected] = useState(BACKGROUNDS[0]);
  return (
    <>
      <SettingsVideoPreview />
      <div className={styles.picker}>
        <SettingsSection title="Choose Background">
          <button type="button" className={styles.upload} aria-label="Add image or video">
            <SchPlusIcon />
          </button>
          <div className={styles.grid}>
            {BACKGROUNDS.map((name) => (
              <button
                key={name}
                type="button"
                className={clsx(styles.thumb, name === selected && styles.selected)}
                aria-pressed={name === selected}
                onClick={() => setSelected(name)}
              >
                {name}
              </button>
            ))}
          </div>
        </SettingsSection>
      </div>
    </>
  );
}
