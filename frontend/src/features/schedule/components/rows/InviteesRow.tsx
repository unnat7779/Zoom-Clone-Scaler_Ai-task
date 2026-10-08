"use client";

import { SchCloseIcon } from "@/shared/icons/generated/SchCloseIcon";
import { Avatar } from "@/shared/ui/Avatar";
import { Banner } from "@/shared/ui/Banner";
import { IconButton } from "@/shared/ui/IconButton";
import { useToast } from "@/shared/ui/Toast";
import type { ScheduleFormApi } from "../../hooks/useScheduleForm";
import { inviteeAvatarColor } from "../../utils/inviteeAvatar";
import { InviteeInput } from "../controls/InviteeInput";
import { FormRow } from "../form/FormRow";
import formStyles from "../form/Form.module.css";
import styles from "./InviteesRow.module.css";

/** Invitees: autocomplete, permanent calendar banner, added list (stored only; no email is sent). */
export function InviteesRow({ form }: { form: ScheduleFormApi }) {
  const toast = useToast();
  const { invitees } = form.values;
  return (
    <FormRow label="Invitees">
      <InviteeInput existing={invitees} onAdd={form.addInvitee} />
      <Banner kind="warning" className={styles.banner}>
        <p className={formStyles.bannerText}>Participants won&apos;t receive this meeting invite until your calendar is connected.</p>
        <button type="button" className={styles.connect} onClick={toast.notAvailable}>
          Connect calendar
        </button>
      </Banner>
      {invitees.length > 0 ? (
        <ul className={styles.list} aria-label="Invitees">
          {invitees.map((email) => (
            <li key={email} className={styles.item}>
              <Avatar name={email.charAt(0)} color={inviteeAvatarColor(email)} size={24} shape="circle" />
              <span className={styles.email}>{email}</span>
              <IconButton label={`Remove ${email}`} size="sm" icon={<SchCloseIcon />} className={styles.remove} onClick={() => form.removeInvitee(email)} />
            </li>
          ))}
        </ul>
      ) : null}
    </FormRow>
  );
}
