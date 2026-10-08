"use client";

import { useId, useRef } from "react";
import clsx from "clsx";
import { useAnchoredPosition } from "@/shared/hooks/useAnchoredPosition";
import { useClickOutside } from "@/shared/hooks/useClickOutside";
import { Avatar } from "@/shared/ui/Avatar";
import { Input } from "@/shared/ui/Input";
import { Portal } from "@/shared/ui/Portal";
import { useInviteeInput } from "../../hooks/useInviteeInput";
import { inviteeAvatarColor } from "../../utils/inviteeAvatar";
import controls from "./controls.module.css";
import styles from "./InviteeInput.module.css";

interface InviteeInputProps {
  existing: string[];
  onAdd: (email: string) => void;
}

/** 490×32 autocomplete with the suggestion menu (51px rows, round 24px avatars, "Invalid email"). */
export function InviteeInput({ existing, onAdd }: InviteeInputProps) {
  const listId = useId();
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const invitee = useInviteeInput(existing, onAdd);
  useAnchoredPosition({ anchorRef, floatingRef: menuRef, open: invitee.open, placement: "bottom-start", offset: 4, matchAnchorWidth: true });
  useClickOutside([anchorRef, menuRef], invitee.close, invitee.open);

  return (
    <div ref={anchorRef} className={controls.long}>
      <Input
        value={invitee.query}
        placeholder="Enter user names or email addresses"
        role="combobox"
        aria-label="Invitees"
        aria-expanded={invitee.open}
        aria-controls={invitee.open ? listId : undefined}
        aria-activedescendant={invitee.open ? `${listId}-${invitee.activeIndex}` : undefined}
        autoComplete="off"
        onChange={(event) => invitee.onChange(event.target.value)}
        onKeyDown={invitee.onKeyDown}
        onBlur={invitee.close}
      />
      {invitee.open ? (
        <Portal>
          <div ref={menuRef} className={styles.menu} onMouseDown={(event) => event.preventDefault()}>
            <ul id={listId} role="listbox" className={styles.list}>
              {invitee.suggestions.map((suggestion, index) => (
                <li
                  key={suggestion.key}
                  id={`${listId}-${index}`}
                  role="option"
                  aria-selected={index === invitee.activeIndex}
                  aria-disabled={suggestion.invalid || undefined}
                  className={clsx(styles.option, { [styles.active ?? ""]: index === invitee.activeIndex && !suggestion.invalid })}
                  onClick={() => invitee.add(suggestion)}
                >
                  <Avatar name={suggestion.email.charAt(0)} color={inviteeAvatarColor(suggestion.email)} size={24} shape="circle" />
                  <span className={styles.text}>
                    <span className={styles.name}>{suggestion.name}</span>
                    <span className={styles.email}>{suggestion.email}</span>
                  </span>
                  {suggestion.invalid ? <span className={styles.invalid}>Invalid email</span> : null}
                </li>
              ))}
            </ul>
          </div>
        </Portal>
      ) : null}
    </div>
  );
}
