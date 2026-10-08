"use client";

import Link from "next/link";
import clsx from "clsx";
import { SchNavArrowDownGreyIcon } from "@/shared/icons/generated/SchNavArrowDownGreyIcon";
import { useCurrentUser } from "@/shared/lib/api/useCurrentUser";
import { avatarColorFromHex } from "@/shared/lib/avatar";
import { routes } from "@/shared/lib/routes";
import { Avatar } from "@/shared/ui/Avatar";
import { useToast } from "@/shared/ui/Toast";
import { MARKETING_TABS, PRICING_LABEL } from "./navItems";
import styles from "./PortalMobileMenu.module.css";

interface PortalMobileMenuProps {
  id: string;
  onClose: () => void;
}

/**
 * The ≤1024 hamburger menu (top_nav.min.css `#navbar.navbar-collapse` / `.tabletWhiteBar`): the
 * marketing tabs, then Schedule · Join · Host · Web App, then the account with Zoom's pill buttons.
 * Schedule and Join navigate; everything else is static like on the desktop header.
 */
export function PortalMobileMenu({ id, onClose }: PortalMobileMenuProps) {
  const toast = useToast();
  const { user } = useCurrentUser();
  const staticRow = (label: string, chevron = false) => (
    <li key={label}>
      <button type="button" className={styles.row} onClick={toast.notAvailable}>
        {label}
        {chevron ? <SchNavArrowDownGreyIcon width={10} height={5} className={styles.chevron} /> : null}
      </button>
    </li>
  );

  return (
    <div id={id} className={styles.panel}>
      <nav aria-label="Site menu">
        <ul className={styles.section}>
          {MARKETING_TABS.map((label) => staticRow(label, true))}
          {staticRow(PRICING_LABEL)}
        </ul>
        <ul className={clsx(styles.section, styles.actions)}>
          <li>
            <Link href={routes.schedule()} className={styles.row} onClick={onClose}>
              Schedule
            </Link>
          </li>
          <li>
            <Link href={routes.joinShortcut()} className={styles.row} onClick={onClose}>
              Join
            </Link>
          </li>
          {staticRow("Host", true)}
          {staticRow("Web App", true)}
        </ul>
      </nav>
      {user ? (
        <div className={styles.account}>
          <div className={styles.identity}>
            <Avatar name={user.display_name} color={avatarColorFromHex(user.avatar_color)} size={40} />
            <div className={styles.identityText}>
              <span className={styles.name}>{user.display_name}</span>
              <span className={styles.email}>{user.email}</span>
            </div>
          </div>
          <div className={styles.pills}>
            <button type="button" className={styles.pill} onClick={toast.notAvailable}>
              My Account
            </button>
            <button type="button" className={clsx(styles.pill, styles.pillPrimary)} onClick={toast.notAvailable}>
              Sign Out
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
