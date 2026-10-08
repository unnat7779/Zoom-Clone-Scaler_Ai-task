"use client";

import clsx from "clsx";
import { HeaderSearchIcon } from "@/shared/icons/generated/HeaderSearchIcon";
import { HomeSearchChannelsIcon } from "@/shared/icons/generated/HomeSearchChannelsIcon";
import { HomeSearchContactsIcon } from "@/shared/icons/generated/HomeSearchContactsIcon";
import { HomeSearchFilesIcon } from "@/shared/icons/generated/HomeSearchFilesIcon";
import { HomeSearchMessagesIcon } from "@/shared/icons/generated/HomeSearchMessagesIcon";
import touch from "@/shared/styles/touch.module.css";
import type { SearchChipId } from "../../utils/searchView";
import styles from "./SearchChips.module.css";

const CHIPS: Array<{ id: SearchChipId; label: string; Icon: typeof HeaderSearchIcon }> = [
  { id: "top", label: "Top results", Icon: HeaderSearchIcon },
  { id: "contacts", label: "Contacts", Icon: HomeSearchContactsIcon },
  { id: "channels", label: "Chats & Channels", Icon: HomeSearchChannelsIcon },
  { id: "messages", label: "Messages", Icon: HomeSearchMessagesIcon },
  { id: "files", label: "Files", Icon: HomeSearchFilesIcon },
];

interface SearchChipsProps {
  selected: SearchChipId;
  onSelect: (chip: SearchChipId) => void;
}

/** `._searchTags`: five filter chips; the selected one is blue (only the style changes, no search). */
export function SearchChips({ selected, onSelect }: SearchChipsProps) {
  return (
    <div className={styles.row} role="group" aria-label="Search filters">
      {CHIPS.map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          aria-pressed={selected === id}
          className={clsx(styles.chip, touch.target, { [styles.selected ?? ""]: selected === id })}
          onClick={() => onSelect(id)}
        >
          <Icon width={12} height={12} className={styles.icon} />
          {label}
        </button>
      ))}
    </div>
  );
}
