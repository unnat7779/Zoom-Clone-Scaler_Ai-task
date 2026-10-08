import styles from "./DownloadAppCta.module.css";

const DOWNLOAD_URL = "https://zoom.us/download";

/**
 * `DownloadMobileCTA` (PRD §11.4, 07-responsive §2.1.3): "Download the Zoom app" link card at the
 * top of Home on ≤768px screens; like Zoom it opens the download page in a new tab.
 */
export function DownloadAppCta() {
  return (
    <div className={styles.container}>
      <a href={DOWNLOAD_URL} target="_blank" rel="noopener noreferrer" className={styles.cta}>
        <span className={styles.text}>
          <span className={styles.title}>Download the Zoom app</span>
          <span className={styles.description}>Download Zoom to access Chat, Phone, Docs, and more!</span>
        </span>
      </a>
    </div>
  );
}
