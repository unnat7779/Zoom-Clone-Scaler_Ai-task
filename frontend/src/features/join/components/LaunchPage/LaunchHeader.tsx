import Link from "next/link";
import { JoinLaunchZoomLogoIcon } from "@/shared/icons/generated/JoinLaunchZoomLogoIcon";
import { routes } from "@/shared/lib/routes";
import { StaticButton } from "@/shared/ui/StaticButton";
import styles from "./LaunchHeader.module.css";

/** Fixed 64px header of the launch page: logo → Home, static "Support" and "English ▾". */
export function LaunchHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href={routes.home()} className={styles.logo} aria-label="Zoom Workplace home">
          <JoinLaunchZoomLogoIcon width={115} height={25} />
        </Link>
        <nav className={styles.links}>
          <StaticButton className={styles.link}>Support</StaticButton>
          <StaticButton className={styles.link}>
            English <span className={styles.caret} aria-hidden />
          </StaticButton>
        </nav>
      </div>
    </header>
  );
}
