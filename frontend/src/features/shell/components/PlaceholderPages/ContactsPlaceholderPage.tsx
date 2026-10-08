"use client";

import clsx from "clsx";
import { HeaderSearchIcon } from "@/shared/icons/generated/HeaderSearchIcon";
import { SchPlusIcon } from "@/shared/icons/generated/SchPlusIcon";
import { Avatar } from "@/shared/ui/Avatar";
import touch from "@/shared/styles/touch.module.css";
import { Spinner } from "@/shared/ui/Spinner";
import { useToast } from "@/shared/ui/Toast";
import { useContacts } from "../../hooks/useContacts";
import styles from "./PlaceholderPages.module.css";

/** `/wc/contacts` — static Contacts skeleton listing the seeded users (PRD §6.8, P1). */
export function ContactsPlaceholderPage() {
  const toast = useToast();
  const users = useContacts();

  return (
    <div className={styles.page}>
      <aside className={styles.contactsList}>
        <div className={styles.contactsSearchRow}>
          <label className={styles.contactsSearch}>
            <HeaderSearchIcon width={12} height={12} className={styles.contactsSearchIcon} />
            <input type="search" placeholder="Search" aria-label="Search contacts" className={styles.contactsSearchInput} />
          </label>
          <button type="button" aria-label="Add a contact" className={clsx(styles.addContact, touch.target)} onClick={toast.notAvailable}>
            <SchPlusIcon width={12} height={12} />
          </button>
        </div>
        {users.isPending ? (
          <div className={styles.loading}>
            <Spinner size={24} />
            Loading
          </div>
        ) : (
          <ul>
            {(users.data ?? []).map((user) => (
              <li key={user.id} className={styles.contactRow}>
                <Avatar name={user.display_name} seed={user.email} />
                {user.display_name}
              </li>
            ))}
          </ul>
        )}
      </aside>
      <section className={styles.emptyPane}>
        <p className={styles.contactsEmptyText}>View Contact info by clicking a contact in the left panel</p>
      </section>
    </div>
  );
}
