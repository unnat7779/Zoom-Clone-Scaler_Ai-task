"use client";

import { type ReactNode, useState } from "react";
import { OverlayScope } from "@/shared/ui/Portal";
import { useKeepFocusedFieldVisible } from "../../hooks/useKeepFocusedFieldVisible";
import { PortalFooter } from "../PortalFooter/PortalFooter";
import { PortalHeader } from "../PortalHeader/PortalHeader";
import { SideMenu } from "../SideMenu/SideMenu";
import { PortalHeaderOnlyContext } from "./usePortalHeaderOnly";
import styles from "./PortalShell.module.css";

/**
 * zoom.us portal chrome (PRD §7.5): fixed 104px header, then a 300px side
 * menu (Meetings selected) and the content column (padding 32 → x=332), then the static footer.
 * The document scrolls; pages render inside `.content`. Everything inside —
 * overlays appended to <body> included — uses the portal font and tracking.
 * A page calling `usePortalHeaderOnly()` gets the header-only layout (§7.8.6).
 */
export function PortalShell({ children }: { children: ReactNode }) {
  const [headerOnly, setHeaderOnly] = useState(false);
  useKeepFocusedFieldVisible();
  return (
    <PortalHeaderOnlyContext.Provider value={setHeaderOnly}>
      <OverlayScope className={styles.overlays ?? ""}>
        <div className={styles.portal}>
          <PortalHeader />
          <div className={styles.body}>
            {headerOnly ? null : <SideMenu />}
            <main className={headerOnly ? styles.headerOnly : styles.content}>{children}</main>
          </div>
          <PortalFooter />
        </div>
      </OverlayScope>
    </PortalHeaderOnlyContext.Provider>
  );
}
