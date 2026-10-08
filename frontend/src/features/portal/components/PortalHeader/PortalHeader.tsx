import { BlackStrip } from "./BlackStrip";
import { PortalNavBar } from "./PortalNavBar";
import styles from "./PortalHeader.module.css";

/** Fixed 104px zoom.us header = 40px black strip + 64px nav (PRD §7.5.1); 50px at ≤767px. */
export function PortalHeader() {
  return (
    <header className={styles.header}>
      <BlackStrip />
      <PortalNavBar />
    </header>
  );
}
