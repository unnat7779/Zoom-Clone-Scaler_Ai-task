import clsx from "clsx";
import { JoinClose16Icon } from "@/shared/icons/generated/JoinClose16Icon";
import touch from "@/shared/styles/touch.module.css";
import { IconButton } from "@/shared/ui/IconButton";
import styles from "./ProfileMenu.module.css";

/**
 * `.common-header-profile__popover-header` (07-responsive §2.1.2): shown only on the ≤768px sheet —
 * 16px #686F79 title and a close button with a 20px icon, padding `12px 16px 12px 20px`.
 */
export function ProfileSheetHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className={styles.sheetHeader}>
      <h2 className={styles.sheetTitle}>Profile</h2>
      <IconButton label="Close" icon={<JoinClose16Icon />} className={clsx(styles.sheetClose, touch.target)} onClick={onClose} />
    </div>
  );
}
