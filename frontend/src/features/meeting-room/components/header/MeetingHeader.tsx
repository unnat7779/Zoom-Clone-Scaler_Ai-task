"use client";

import { useRef } from "react";
import clsx from "clsx";
import { useRoomUi } from "../../state/useRoomUi";
import { EncryptionPopover } from "./EncryptionPopover";
import { HeaderActions } from "./HeaderActions";
import { InfoPill } from "./InfoPill";
import { InfoPopover } from "./InfoPopover";
import { ViewMenu } from "./ViewMenu";
import styles from "./MeetingHeader.module.css";

/** Top bar: meeting-info pill, encryption, Zoom AI, View, Switch client (PRD §8.4). */
export function MeetingHeader({ hidden }: { hidden: boolean }) {
  const { menu, toggleMenu, closeMenu } = useRoomUi();
  const infoRef = useRef<HTMLButtonElement | null>(null);
  const encryptionRef = useRef<HTMLButtonElement | null>(null);
  const viewRef = useRef<HTMLButtonElement | null>(null);

  return (
    <>
      <div className={clsx(styles.header, hidden && styles.hidden)}>
        <InfoPill ref={infoRef} open={menu === "info"} onClick={() => toggleMenu("info")} />
        <div className={styles.side}>
          <HeaderActions
            encryptionRef={encryptionRef}
            viewRef={viewRef}
            encryptionOpen={menu === "encryption"}
            viewOpen={menu === "view"}
            onEncryption={() => toggleMenu("encryption")}
            onView={() => toggleMenu("view")}
          />
        </div>
      </div>
      {menu === "info" ? <InfoPopover anchorRef={infoRef} onClose={closeMenu} /> : null}
      {menu === "encryption" ? <EncryptionPopover anchorRef={encryptionRef} onClose={closeMenu} /> : null}
      {menu === "view" ? <ViewMenu anchorRef={viewRef} onClose={closeMenu} /> : null}
    </>
  );
}
