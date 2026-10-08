import styles from "./PortalFooter.module.css";

/** The CCPA "Your Privacy Choices" toggle (29×14) Zoom shows before that footer link. */
export function PrivacyChoicesIcon() {
  return (
    <svg className={styles.privacyIcon} width={29} height={14} viewBox="0 0 30 14" aria-hidden>
      <rect x="0.5" y="0.5" width="29" height="13" rx="6.5" className={styles.ccpaPill} />
      <path d="M15.2.5h8.3a6.5 6.5 0 0 1 0 13h-10.6z" className={styles.ccpaBlue} />
      <path d="m5.6 7.2 2.1 2.1 4.1-4.4" className={styles.ccpaCheck} />
      <path d="m18.8 4.6 4.6 4.6m0-4.6-4.6 4.6" className={styles.ccpaCross} />
    </svg>
  );
}
