import Link from "next/link";
import clsx from "clsx";
import { PwaZoomLogoIcon } from "@/shared/icons/generated/PwaZoomLogoIcon";
import { routes } from "@/shared/lib/routes";
import touch from "@/shared/styles/touch.module.css";
import styles from "./HeaderLogo.module.css";

/** Zoom logo (→ Home) + divider + "Workplace" word-mark (static). */
export function HeaderLogo() {
  return (
    <div className={styles.logoBlock}>
      <Link href={routes.home()} className={clsx(styles.logo, touch.target)} aria-label="Zoom Workplace home">
        <PwaZoomLogoIcon width={87} height={20} />
      </Link>
      <span className={styles.wordmark}>Workplace</span>
    </div>
  );
}
