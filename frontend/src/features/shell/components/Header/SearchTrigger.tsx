"use client";

import clsx from "clsx";
import { HeaderSearchIcon } from "@/shared/icons/generated/HeaderSearchIcon";
import touch from "@/shared/styles/touch.module.css";
import { useShellDialog } from "../../hooks/useShellIntegration";
import styles from "./SearchTrigger.module.css";

/** Global search trigger (PRD §6.2): opens the static Search dialog (§6.4). A 32×32 icon at ≤1080px. */
export function SearchTrigger() {
  const search = useShellDialog("search");
  return (
    <button
      type="button"
      className={clsx(styles.trigger, touch.target)}
      aria-label="Search"
      aria-haspopup="dialog"
      aria-expanded={search.open}
      onClick={search.show}
    >
      <HeaderSearchIcon width={16} height={16} className={styles.icon} />
      <span className={styles.label}>
        Search<span className={styles.shortcut}>⌘ + K</span>
      </span>
    </button>
  );
}
