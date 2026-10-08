import styles from "./HoldRing.module.css";

/**
 * `.wr-loading-icon-wrapper` (scale .7) › `.wr-loading-icon` (wc_sprites.png ring, white in the dark
 * theme): a 3px band fading in clockwise to a round-capped head, rotating 1.5s linear.
 */
export function HoldRing() {
  return (
    <span className={styles.wrapper} aria-hidden>
      <span className={styles.ring} />
    </span>
  );
}
