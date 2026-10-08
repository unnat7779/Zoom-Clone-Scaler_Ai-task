"use client";

import clsx from "clsx";
import { ChevronDownIcon } from "@/shared/icons/generated/ChevronDownIcon";
import { HomeMenuChevronRightIcon } from "@/shared/icons/generated/HomeMenuChevronRightIcon";
import { HomeNavChatIcon } from "@/shared/icons/generated/HomeNavChatIcon";
import { NavSettingsIcon } from "@/shared/icons/generated/NavSettingsIcon";
import { RoomReactIconsMoreIcon } from "@/shared/icons/generated/RoomReactIconsMoreIcon";
import { SchPlusIcon } from "@/shared/icons/generated/SchPlusIcon";
import touch from "@/shared/styles/touch.module.css";
import { useToast } from "@/shared/ui/Toast";
import styles from "./PlaceholderPages.module.css";

const GROUPS = ["Apps", "Chats & Channels", "Starred", "Shared spaces"];

/** `/wc/team-chat` — static Team Chat skeleton (PRD §6.8, P1). */
export function ChatPlaceholderPage() {
  const toast = useToast();
  return (
    <div className={styles.page}>
      <aside className={styles.chatSidebar}>
        <div className={styles.chatHeader}>
          <span className={styles.chatTitle}>
            Chat <ChevronDownIcon width={12} height={12} />
          </span>
          <button type="button" aria-label="Chat settings" className={clsx(styles.squareButton, touch.target)} onClick={toast.notAvailable}>
            <NavSettingsIcon width={16} height={16} />
          </button>
          <button type="button" aria-label="New menu" className={clsx(styles.newButton, touch.target)} onClick={toast.notAvailable}>
            <SchPlusIcon width={16} height={16} />
          </button>
        </div>
        <div className={styles.pills}>
          <span className={clsx(styles.pill, styles.pillSelected)}>All</span>
          <span className={styles.pill}>@</span>
          <span className={styles.pill}>
            <HomeNavChatIcon width={14} height={14} />
          </span>
          <span className={styles.pill}>
            <RoomReactIconsMoreIcon width={12} height={3} />
          </span>
        </div>
        <ul className={styles.groups}>
          {GROUPS.map((group) => (
            <li key={group} className={styles.group}>
              <HomeMenuChevronRightIcon width={12} height={12} />
              {group}
            </li>
          ))}
        </ul>
      </aside>
      <section className={styles.emptyPane}>
        <p className={styles.chatEmptyText}>Start chatting by clicking or creating a chat in the left sidebar.</p>
      </section>
    </div>
  );
}
