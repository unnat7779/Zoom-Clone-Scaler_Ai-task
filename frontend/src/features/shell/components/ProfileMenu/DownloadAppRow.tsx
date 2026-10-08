import { HomeMenuDownloadIcon } from "@/shared/icons/generated/HomeMenuDownloadIcon";
import styles from "./ProfileMenu.module.css";

/** Last profile-menu row: centred "Download the Zoom app" text button (static). */
export function DownloadAppRow({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" role="menuitem" tabIndex={-1} className={styles.downloadRow} onClick={onClick}>
      <HomeMenuDownloadIcon width={14} height={14} />
      Download the Zoom app
    </button>
  );
}
