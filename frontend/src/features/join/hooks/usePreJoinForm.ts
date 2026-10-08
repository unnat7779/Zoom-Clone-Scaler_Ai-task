"use client";

import { useState } from "react";
import type { JoinFormErrors } from "../utils/joinErrors";
import { getRememberedName } from "../utils/rememberedName";

export interface PreJoinForm {
  name: string;
  setName: (value: string) => void;
  passcode: string;
  setPasscode: (value: string) => void;
  /** the "Meeting Passcode" row is visible */
  passcodeShown: boolean;
  /** show the passcode row even though validation said the link unlocks it (WRONG_PASSCODE) */
  revealPasscode: () => void;
  rememberName: boolean;
  setRememberName: (value: boolean) => void;
  /** "Remember my name" shows only for signed-out guests (Zoom renders it when `!isLogin`) */
  rememberShown: boolean;
  errors: JoinFormErrors;
  setErrors: (errors: JoinFormErrors) => void;
  /**
   * Join is enabled when the name (and, if shown, the passcode) is non-empty (PRD §7.10.3) and no
   * field error is showing — Zoom keeps it disabled until the field is edited.
   */
  canSubmit: boolean;
}

/**
 * "Enter Meeting Info" fields. A guest's name is prefilled from "Remember my name" (PRD §7.10.2);
 * in the shell the user is signed in, so like Zoom the name defaults to the account name (once it
 * has loaded, unless already typed) and the remember checkbox is hidden (critic C9).
 */
export function usePreJoinForm(passcodeRequired: boolean, accountName: string | null): PreJoinForm {
  const [name, setNameValue] = useState(() => getRememberedName() ?? "");
  const [accountApplied, setAccountApplied] = useState(false);
  const [edited, setEdited] = useState(false);
  if (accountName && !accountApplied) {
    setAccountApplied(true);
    if (!edited) setNameValue(accountName);
  }
  const [passcode, setPasscodeValue] = useState("");
  const [passcodeForced, setPasscodeForced] = useState(false);
  const [rememberName, setRememberName] = useState(true);
  const [errors, setErrors] = useState<JoinFormErrors>({});
  const passcodeShown = passcodeRequired || passcodeForced;
  const filled = name.trim() !== "" && (!passcodeShown || passcode.trim() !== "");

  return {
    name,
    setName: (value) => {
      setNameValue(value);
      setEdited(true);
      if (errors.name) setErrors({ ...errors, name: undefined });
    },
    passcode,
    setPasscode: (value) => {
      setPasscodeValue(value);
      if (errors.passcode) setErrors({ ...errors, passcode: undefined });
    },
    passcodeShown,
    revealPasscode: () => setPasscodeForced(true),
    rememberName,
    setRememberName,
    rememberShown: accountName === null,
    errors,
    setErrors,
    canSubmit: filled && !errors.name && !errors.passcode,
  };
}
