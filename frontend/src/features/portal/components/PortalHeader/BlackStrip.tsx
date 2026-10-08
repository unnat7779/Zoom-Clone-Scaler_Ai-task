"use client";

import { Fragment } from "react";
import { SchTopbarSearchIcon } from "@/shared/icons/generated/SchTopbarSearchIcon";
import { useToast } from "@/shared/ui/Toast";
import styles from "./BlackStrip.module.css";

const LINKS = ["Support", "1.888.799.9666", "Contact Sales", "Request a Demo"];

/** 40px #00031F marketing strip (static). Hidden at ≤767px. */
export function BlackStrip() {
  const toast = useToast();
  return (
    <nav className={styles.strip} aria-label="Zoom marketing">
      <button type="button" className={styles.search} onClick={toast.notAvailable}>
        <SchTopbarSearchIcon width={20} height={20} />
        Search
      </button>
      {LINKS.map((label) => (
        <Fragment key={label}>
          {label === "Contact Sales" ? <span aria-hidden className={styles.separator} /> : null}
          <button type="button" className={styles.link} onClick={toast.notAvailable}>
            {label}
          </button>
        </Fragment>
      ))}
    </nav>
  );
}
