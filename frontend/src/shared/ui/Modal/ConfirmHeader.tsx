import clsx from "clsx";
import { MtgMeetingsDeleteXIcon } from "@/shared/icons/generated/MtgMeetingsDeleteXIcon";
import touch from "@/shared/styles/touch.module.css";
import styles from "./Modal.module.css";

/** PWA confirm-modal header: Zoom logo + "Zoom" + 12px × (PRD §7.4.8). */
export function ConfirmHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className={styles.confirmHeader}>
      <span className={styles.confirmBrand}>
        {/* eslint-disable-next-line @next/next/no-img-element -- 20px static asset */}
        <img src="/zoom/mtg-modal-confirm-logo.png" width={20} height={20} alt="" />
        <span>Zoom</span>
      </span>
      <button type="button" aria-label="Close" className={clsx(styles.confirmClose, touch.target)} onClick={onClose}>
        <MtgMeetingsDeleteXIcon width={12} height={12} />
      </button>
    </div>
  );
}
