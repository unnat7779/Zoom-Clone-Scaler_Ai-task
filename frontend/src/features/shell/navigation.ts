import { HomeNavChatIcon } from "@/shared/icons/generated/HomeNavChatIcon";
import { HomeNavContactsIcon } from "@/shared/icons/generated/HomeNavContactsIcon";
import { NavHomeIcon } from "@/shared/icons/generated/NavHomeIcon";
import { NavMeetingsIcon } from "@/shared/icons/generated/NavMeetingsIcon";
import { routes } from "@/shared/lib/routes";
import type { RailTabId } from "./hooks/useRailSelection";

export interface NavRoute {
  id: RailTabId;
  label: string;
  href: string;
  Icon: typeof NavHomeIcon;
}

const HOME: NavRoute = { id: "home", label: "Home", href: routes.home(), Icon: NavHomeIcon };
const CHAT: NavRoute = { id: "chat", label: "Chat", href: routes.teamChat(), Icon: HomeNavChatIcon };
const MEETINGS: NavRoute = { id: "meetings", label: "Meetings", href: routes.meetings(), Icon: NavMeetingsIcon };
const CONTACTS: NavRoute = { id: "contacts", label: "Contacts", href: routes.contacts(), Icon: HomeNavContactsIcon };

/** The 80px rail, Zoom's order (PRD §6.7); Settings is pinned below them. */
export const RAIL_ROUTES = [HOME, CHAT, MEETINGS, CONTACTS];

/** The phone tab bar (≤767px) [D]: Meetings second, Settings last. */
export const TAB_BAR_ROUTES = [HOME, MEETINGS, CHAT, CONTACTS];
