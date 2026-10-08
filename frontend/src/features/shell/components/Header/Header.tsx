"use client";

import { ProfileButton } from "../ProfileMenu/ProfileButton";
import { DiscoverLinks } from "./DiscoverLinks";
import { HeaderLogo } from "./HeaderLogo";
import { HeaderTrailing } from "./HeaderTrailing";
import { NavCluster } from "./NavCluster";
import { SearchTrigger } from "./SearchTrigger";
import styles from "./Header.module.css";

/**
 * Workplace header (PRD §6.2): logo + "Workplace", then a right slot with
 * [leading ≥1440] [nav cluster + search, centred] [Admin · Download · Upgrade · bell] + avatar.
 */
export function Header() {
  return (
    <header className={styles.header}>
      <HeaderLogo />
      <div className={styles.right}>
        <div className={styles.slots}>
          <div className={styles.leading}>
            <DiscoverLinks />
          </div>
          <div className={styles.searchArea}>
            <div className={styles.searchCluster}>
              <NavCluster />
              <SearchTrigger />
            </div>
          </div>
          <HeaderTrailing />
        </div>
        <ProfileButton />
      </div>
    </header>
  );
}
