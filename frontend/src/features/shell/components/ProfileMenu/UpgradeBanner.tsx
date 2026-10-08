import { Banner } from "@/shared/ui/Banner";
import { Button } from "@/shared/ui/Button";
import styles from "./ProfileMenu.module.css";

/** "Get more from Zoom" info banner inside the profile menu (static, PRD §6.6 row 8). */
export function UpgradeBanner({ onUpgrade }: { onUpgrade: () => void }) {
  return (
    <Banner
      kind="info"
      icon={false}
      title="Get more from Zoom"
      className={styles.upgradeBanner}
      actionsBelow
      actions={
        <Button size="sm" className={styles.upgradeButton} onClick={onUpgrade}>
          Upgrade now
        </Button>
      }
    >
      <span className={styles.upgradeText}>Upgrade to Zoom Workplace Pro for unlimited meetings and more</span>
    </Banner>
  );
}
