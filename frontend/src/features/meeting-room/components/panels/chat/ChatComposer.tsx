"use client";

import { useRef } from "react";
import clsx from "clsx";
import { useToggle } from "@/shared/hooks";
import { RoomChatChatEmojiIcon } from "@/shared/icons/generated/RoomChatChatEmojiIcon";
import { RoomChatChatEnterIcon } from "@/shared/icons/generated/RoomChatChatEnterIcon";
import { RoomChatChatFormatIcon } from "@/shared/icons/generated/RoomChatChatFormatIcon";
import { RoomChatChatMoreIcon } from "@/shared/icons/generated/RoomChatChatMoreIcon";
import { RoomChatFile2Icon } from "@/shared/icons/generated/RoomChatFile2Icon";
import { useChatComposer } from "../../../hooks/useChatComposer";
import { ChatRecipientMenu } from "./ChatRecipientMenu";
import styles from "./ChatComposer.module.css";

/**
 * "to: [Meeting Group Chat]" and `.chat-rtf-box__editor-outer` (padding 4px 8px 8px) holding the
 * 85px editor and the tool row; Send does nothing (Static UI).
 */
export function ChatComposer() {
  const composer = useChatComposer();
  const [menuOpen, toggleMenu, setMenuOpen] = useToggle(false);
  const pillRef = useRef<HTMLButtonElement | null>(null);
  return (
    <div className={styles.composer}>
      <div className={styles.recipientRow}>
        <span className={styles.to}>to:</span>
        <button ref={pillRef} type="button" className={styles.pill} aria-haspopup="menu" aria-expanded={menuOpen} onClick={toggleMenu}>
          {composer.recipient}
        </button>
      </div>
      <ChatRecipientMenu
        open={menuOpen}
        anchorRef={pillRef}
        selected={composer.recipient}
        onSelect={composer.setRecipient}
        onClose={() => setMenuOpen(false)}
      />
      <div className={styles.editorOuter}>
        <textarea
          className={styles.input}
          placeholder="Type message here ..."
          aria-label="Type message here"
          value={composer.text}
          onChange={composer.onChange}
          onKeyDown={composer.onKeyDown}
        />
        <div className={styles.bottom}>
          <button type="button" className={clsx(styles.tool, styles.format)} aria-label="Format">
            <RoomChatChatFormatIcon />
          </button>
          <button type="button" className={clsx(styles.tool, styles.file)} aria-label="File Transfer">
            <RoomChatFile2Icon />
          </button>
          <button type="button" className={clsx(styles.tool, styles.emoji)} aria-label="Emoji">
            <RoomChatChatEmojiIcon />
          </button>
          <button type="button" className={styles.tool} aria-label="More chat options">
            <RoomChatChatMoreIcon />
          </button>
          <button type="button" className={clsx(styles.send, composer.hasText && styles.ready)} aria-label="send">
            <RoomChatChatEnterIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
