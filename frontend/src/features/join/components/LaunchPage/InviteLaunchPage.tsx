"use client";

import { INVALID_MEETING_ID_MESSAGE, isLaunchableMeetingNumber } from "../../utils/inviteLink";
import { InvalidLinkPage } from "../InvalidLink/InvalidLinkPage";
import { LaunchView } from "./LaunchView";

interface InviteLaunchPageProps {
  number: string;
  pwd: string | null;
}

/** `/j/{n}` (PRD §7.9, P1): the launch page for a 9–11 digit number, Zoom's portal error otherwise. */
export function InviteLaunchPage({ number, pwd }: InviteLaunchPageProps) {
  return isLaunchableMeetingNumber(number) ? (
    <LaunchView number={number} pwd={pwd} />
  ) : (
    <InvalidLinkPage message={INVALID_MEETING_ID_MESSAGE} />
  );
}
