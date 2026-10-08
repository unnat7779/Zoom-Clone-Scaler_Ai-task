import Image from "next/image";
import { MAIL_SERVICES } from "../../utils/inviteMail";
import styles from "./InviteEmail.module.css";

/** Default Email / Gmail / Yahoo Mail open a compose window with the invitation (new tab). */
export function InviteEmail({ invitation }: { invitation: string }) {
  return (
    <div className={styles.content}>
      <div className={styles.title}>Choose your email service to send invitation</div>
      <div className={styles.services}>
        {MAIL_SERVICES.map((service) => (
          <a key={service.label} className={styles.service} href={service.href(invitation)} target="_blank" rel="noreferrer">
            <Image src={service.image} alt="" width={service.width} height={service.height} unoptimized />
            <span className={styles.label}>{service.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
