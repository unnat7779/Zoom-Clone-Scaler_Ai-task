"use client";

import { useId, useRef } from "react";
import Link from "next/link";
import clsx from "clsx";
import { SchNavArrowDownGreyIcon } from "@/shared/icons/generated/SchNavArrowDownGreyIcon";
import { SchZoomLogoIcon } from "@/shared/icons/generated/SchZoomLogoIcon";
import { useCurrentUser } from "@/shared/lib/api/useCurrentUser";
import { avatarColorFromHex } from "@/shared/lib/avatar";
import { routes } from "@/shared/lib/routes";
import { Avatar } from "@/shared/ui/Avatar";
import { useToast } from "@/shared/ui/Toast";
import { useMobileNavMenu } from "../../hooks/useMobileNavMenu";
import { MARKETING_TABS, PRICING_LABEL } from "./navItems";
import { PortalMobileMenu } from "./PortalMobileMenu";
import styles from "./PortalNavBar.module.css";

/** 64px white nav: logo, marketing tabs (static), Schedule · Join · Host ▾ · Web App ▾ · avatar; ☰ menu ≤1024. */
export function PortalNavBar() {
  const toast = useToast();
  const { user } = useCurrentUser();
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const menu = useMobileNavMenu(toggleRef);
  const chevron = <SchNavArrowDownGreyIcon width={10} height={5} className={styles.chevron} />;

  return (
    <>
      <nav className={styles.navBar} aria-label="Main">
        <Link href={routes.home()} className={styles.logo} aria-label="Zoom Workplace home">
          <SchZoomLogoIcon width={110} height={25} />
        </Link>
        <div className={styles.marketing}>
          {MARKETING_TABS.map((label) => (
            <button key={label} type="button" className={styles.tab} onClick={toast.notAvailable}>
              {label}
            </button>
          ))}
          <button type="button" className={styles.pricing} onClick={toast.notAvailable}>
            {PRICING_LABEL}
          </button>
        </div>
        <div className={styles.actions}>
          <Link href={routes.schedule()} className={clsx(styles.action, styles.hideMobile)}>
            Schedule
          </Link>
          <Link href={routes.joinShortcut()} className={styles.action}>
            Join
          </Link>
          <button type="button" className={styles.dropdown} onClick={toast.notAvailable}>
            Host {chevron}
          </button>
          <button type="button" className={clsx(styles.dropdown, styles.webApp)} onClick={toast.notAvailable}>
            Web App {chevron}
          </button>
          <span className={clsx(styles.avatar, styles.hideMobile)}>
            {user ? <Avatar name={user.display_name} color={avatarColorFromHex(user.avatar_color)} /> : null}
          </span>
          <button
            ref={toggleRef}
            type="button"
            className={clsx(styles.hamburger, { [styles.hamburgerOpen ?? ""]: menu.open })}
            aria-label="Toggle navigation"
            aria-expanded={menu.open}
            aria-controls={menu.open ? menuId : undefined}
            onClick={menu.toggle}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>
      {menu.open ? <PortalMobileMenu id={menuId} onClose={menu.close} /> : null}
    </>
  );
}
