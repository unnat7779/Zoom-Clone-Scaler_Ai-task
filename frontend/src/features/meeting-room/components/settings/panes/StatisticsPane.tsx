"use client";

import { useState } from "react";
import clsx from "clsx";
import styles from "./StatisticsPane.module.css";

const SECTIONS = ["Overall", "Audio", "Video", "Share"];

/** Settings › Statistics (spec 05 §12): sub-tabs and the "Calculating…" placeholder — no metrics are collected. */
export function StatisticsPane() {
  const [section, setSection] = useState(SECTIONS[0]);
  return (
    <>
      <div className={styles.tabs} role="tablist" aria-label="Statistics">
        {SECTIONS.map((name) => (
          <button
            key={name}
            type="button"
            role="tab"
            aria-selected={name === section}
            className={clsx(styles.tab, name === section && styles.selected)}
            onClick={() => setSection(name)}
          >
            {name}
          </button>
        ))}
      </div>
      <p className={styles.placeholder}>Calculating Memory Usage...</p>
    </>
  );
}
