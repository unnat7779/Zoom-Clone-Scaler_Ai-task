import { StaticButton } from "@/shared/ui/StaticButton";
import styles from "./LaunchFooter.module.css";

const LINKS = [
  "Trust Center",
  "Acceptable Use Guidelines",
  "Legal & Compliance",
  "Do Not Sell My Personal Information",
  "Cookie Preferences",
];

/** Launch-page `#footer`: copyright + static legal links separated by 1px rules. */
export function LaunchFooter() {
  return (
    <footer className={styles.footer}>
      <p className={styles.copyright}>©{new Date().getFullYear()} Zoom Communications, Inc. All rights reserved.</p>
      <p className={styles.links}>
        {LINKS.map((label) => (
          <StaticButton key={label} className={styles.link}>
            {label}
          </StaticButton>
        ))}
      </p>
    </footer>
  );
}
