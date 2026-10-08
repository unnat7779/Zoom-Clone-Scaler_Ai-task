import type { ReactNode } from "react";
import styles from "./SettingsSection.module.css";

/** A titled group of a settings pane: label 13px/16px 700 #F5F5F5, 8px above its content; groups 24px apart. */
export function SettingsSection({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className={styles.section}>
      {title ? <h3 className={styles.title}>{title}</h3> : null}
      {children}
    </section>
  );
}
