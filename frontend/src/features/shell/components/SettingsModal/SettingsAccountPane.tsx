"use client";

import { useCurrentUser } from "@/shared/lib/api/useCurrentUser";
import { avatarColorFromHex } from "@/shared/lib/avatar";
import { Avatar } from "@/shared/ui/Avatar";
import { useToast } from "@/shared/ui/Toast";
import styles from "./SettingsModal.module.css";

/** Static "My account" pane [D]: the signed-in user and a "Manage account" link (demo toast). */
export function SettingsAccountPane() {
  const { user } = useCurrentUser();
  const toast = useToast();
  return (
    <div className={styles.general}>
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>My account</h3>
        {user ? (
          <div className={styles.account}>
            <Avatar name={user.display_name} color={avatarColorFromHex(user.avatar_color)} size={48} />
            <div className={styles.accountText}>
              <span className={styles.accountName}>{user.display_name}</span>
              <span className={styles.sectionHint}>{user.email}</span>
            </div>
          </div>
        ) : null}
        <button type="button" className={styles.manage} onClick={toast.notAvailable}>
          Manage account
        </button>
      </section>
    </div>
  );
}
