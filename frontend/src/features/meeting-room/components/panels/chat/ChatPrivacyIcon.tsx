import styles from "./ChatDisclaimer.module.css";

/**
 * 14×14 "Who can see your messages?" glyph — Zoom's dark sprite cell (`wc_sprites2.png`
 * −397 −34): white person outline with a blue `#4F9AF8` shield.
 */
export function ChatPrivacyIcon() {
  return (
    <svg className={styles.icon} width="14" height="14" viewBox="0 0 14 14" aria-hidden focusable="false">
      <circle className={styles.person} cx="5" cy="4" r="2.4" />
      <path className={styles.person} d="M1 12.5c0-2.4 1.8-4.2 4-4.2 1 0 1.9.4 2.6 1" />
      <path className={styles.shield} d="M10.5 6.8 13.5 8v2.3c0 1.7-1.3 2.9-3 3.4-1.7-.5-3-1.7-3-3.4V8l3-1.2Z" />
    </svg>
  );
}
