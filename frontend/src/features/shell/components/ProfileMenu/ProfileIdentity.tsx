import { avatarColorFromHex } from "@/shared/lib/avatar";
import type { User } from "@/shared/types/api";
import { Avatar } from "@/shared/ui/Avatar";
import styles from "./ProfileMenu.module.css";

/** First profile-menu row: 32px avatar, name and e-mail (242×52). */
export function ProfileIdentity({ user }: { user: User }) {
  return (
    <div className={styles.identity}>
      <Avatar name={user.display_name} color={avatarColorFromHex(user.avatar_color)} className={styles.identityAvatar} />
      <div className={styles.identityText}>
        <span className={styles.name}>{user.display_name}</span>
        <span className={styles.email}>{user.email}</span>
      </div>
    </div>
  );
}
