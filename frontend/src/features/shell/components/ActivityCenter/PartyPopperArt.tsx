import styles from "./PartyPopperArt.module.css";

/**
 * Party-popper illustration of the Activity Center's empty Focus tab, ≈140×128 (PRD §6.5: Zoom's
 * artwork lives in a cross-origin iframe, so this is a simple drawing in the same palette) [D].
 */
export function PartyPopperArt() {
  return (
    <svg width={140} height={128} viewBox="0 0 140 128" fill="none" aria-hidden focusable="false" className={styles.art}>
      <path className={styles.streamerBlue} d="M77 69c-12-14-4-25-12-33" />
      <path className={styles.streamerPurple} d="M84 70c-5-18 12-22 6-40" />
      <path className={styles.streamerYellow} d="M91 73c8-16 25-20 17-36" />
      <path className={styles.streamerRed} d="M94 79c14-9 22-3 28-16" />
      <path className={styles.cone} d="M36 120 64 60l34 30z" />
      <path className={styles.stripe} d="M58.4 72 85.6 96l-9.3 4.5-22.1-19.5z" />
      <path className={styles.stripe} d="M48.6 93 63.9 106.5l-9.3 4.5-10.2-9z" />
      <ellipse className={styles.mouth} cx={81} cy={75} rx={22.6} ry={4.6} transform="rotate(41.4 81 75)" />
      <rect className={styles.confettiPurple} x={50} y={24} width={4} height={10} rx={1} transform="rotate(20 52 29)" />
      <rect className={styles.confettiRed} x={114} y={78} width={10} height={4} rx={1} transform="rotate(-15 119 80)" />
      <rect className={styles.confettiGreen} x={24} y={86} width={10} height={4} rx={1} transform="rotate(-30 29 88)" />
      <rect className={styles.confettiYellow} x={102} y={100} width={4} height={9} rx={1} transform="rotate(-20 104 104)" />
      <path className={styles.markGreen} d="M112 16v8M108 20h8" />
      <path className={styles.markRed} d="M60 32v6M57 35h6" />
      <path className={styles.markRed} d="M118 98l4 4M122 98l-4 4" />
      <circle className={styles.confettiPurple} cx={40} cy={56} r={1.6} />
      <circle className={styles.confettiBlue} cx={96} cy={14} r={1.6} />
      <circle className={styles.confettiPurple} cx={100} cy={58} r={1.4} />
    </svg>
  );
}
