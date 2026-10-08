"use client";

import { useRef } from "react";
import { MtgShareIcon } from "@/shared/icons/generated/MtgShareIcon";
import { useMeetingRoom } from "../../realtime/useMeetingRoom";
import { useRoomUi } from "../../state/useRoomUi";
import { ShareMenu } from "./ShareMenu";
import { ToolbarButton } from "./ToolbarButton";

/** Screen share is Static UI only (PRD §2.2): a silent no-op. The host also gets the "Host tools for share" caret. */
export function ShareButton() {
  const { isHost } = useMeetingRoom();
  const { menu, toggleMenu, closeMenu } = useRoomUi();
  const caretRef = useRef<HTMLButtonElement | null>(null);
  return (
    <ToolbarButton
      label="Share"
      ariaLabel="Share"
      icon={<MtgShareIcon size={27} />}
      onClick={closeMenu}
      caretRef={caretRef}
      caret={
        isHost
          ? { ariaLabel: "Host tools for share", open: menu === "share", onClick: () => toggleMenu("share") }
          : undefined
      }
    >
      {menu === "share" ? <ShareMenu anchorRef={caretRef} onClose={closeMenu} /> : null}
    </ToolbarButton>
  );
}
