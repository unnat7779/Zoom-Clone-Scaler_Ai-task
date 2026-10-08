import clsx from "clsx";
import { HeaderSearchIcon } from "@/shared/icons/generated/HeaderSearchIcon";
import { avatarColorFromHex } from "@/shared/lib/avatar";
import type { User } from "@/shared/types/api";
import { Avatar } from "@/shared/ui";
import styles from "./InviteContacts.module.css";

interface InviteContactsProps {
  contacts: User[];
  selected: ReadonlySet<number>;
  onToggle: (id: number) => void;
}

/** Seeded contacts as tiles; selecting only enables the (no-op) Invite button. Zoom Rooms: empty list. */
export function InviteContacts({ contacts, selected, onToggle }: InviteContactsProps) {
  return (
    <div className={styles.wrap}>
      <label className={styles.search}>
        <HeaderSearchIcon className={styles.searchIcon} />
        <input className={styles.input} placeholder="Choose from the list or type to search" aria-label="Choose from the list or type to search" />
      </label>
      <div className={styles.grid}>
        {contacts.map((user) => (
          <button
            key={user.id}
            type="button"
            aria-pressed={selected.has(user.id)}
            className={clsx(styles.tile, selected.has(user.id) && styles.selected)}
            onClick={() => onToggle(user.id)}
          >
            <Avatar name={user.display_name} size={32} color={avatarColorFromHex(user.avatar_color)} className={styles.avatar} />
            <span className={styles.name}>{user.display_name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
