import styles from "./EmptyDetail.module.css";

/** `.meetings__detail-empty` (PRD §7.4.9): 200×200 calendar illustration + tip (Previous: its own copy [D]). */
export function EmptyDetail({ text = "Connect your calendar or schedule a meeting" }: { text?: string }) {
  return (
    <div className={styles.empty}>
      {/* eslint-disable-next-line @next/next/no-img-element -- static 200px illustration */}
      <img src="/zoom/mtg-meetings-empty-detail.png" width={200} height={200} alt="" className={styles.icon} />
      <span>{text}</span>
    </div>
  );
}
