"use client";

import { useRef } from "react";
import { MtgChatIcon } from "@/shared/icons/generated/MtgChatIcon";
import { useRoomUi } from "../../state/useRoomUi";
import { ChatMenu } from "./ChatMenu";
import { ToolbarButton } from "./ToolbarButton";

/** Opens the (static) chat panel. */
export function ChatButton() {
  const { panels, menu, togglePanel, toggleMenu, closeMenu } = useRoomUi();
  const caretRef = useRef<HTMLButtonElement | null>(null);
  const open = panels.includes("chat");
  return (
    <ToolbarButton
      label="Chat"
      ariaLabel={open ? "close the chat panel" : "open the chat panel"}
      icon={<MtgChatIcon size={24} />}
      onClick={() => togglePanel("chat")}
      caretRef={caretRef}
      caret={{ ariaLabel: "Chat Settings", open: menu === "chat", onClick: () => toggleMenu("chat") }}
    >
      {menu === "chat" ? <ChatMenu anchorRef={caretRef} onClose={closeMenu} /> : null}
    </ToolbarButton>
  );
}
