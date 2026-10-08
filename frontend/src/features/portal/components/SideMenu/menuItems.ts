import { routes } from "@/shared/lib/routes";

/** Portal side-menu content (03-schedule.md §3.4). Only Home and Meetings navigate in the clone. */
export interface SideMenuLink {
  kind: "link";
  label: string;
  /** clone route; undefined → static (demo toast) */
  href?: string;
  isNew?: boolean;
  external?: boolean;
  /** extra space below (Discover More Products: 24px) */
  spaced?: boolean;
}

export interface SideMenuTitle {
  kind: "title";
  label: string;
}

export interface SideMenuGroup {
  kind: "group";
  label: string;
  children: Array<SideMenuLink | SideMenuGroup>;
}

export type SideMenuEntry = SideMenuLink | SideMenuTitle | SideMenuGroup;

const link = (label: string, extra: Omit<SideMenuLink, "kind" | "label"> = {}): SideMenuLink => ({ kind: "link", label, ...extra });
const ext = (label: string, isNew = false) => link(label, { external: true, isNew });
const group = (label: string, children: SideMenuGroup["children"]): SideMenuGroup => ({ kind: "group", label, children });

export const MEETINGS_ITEM_LABEL = "Meetings";

export const SIDE_MENU: SideMenuEntry[] = [
  link("Home", { href: routes.home() }),
  { kind: "title", label: "My Products" },
  ext("AI", true),
  link(MEETINGS_ITEM_LABEL, { href: routes.meetings() }),
  link("Recordings"),
  link("Summaries"),
  ext("Hub", true),
  ext("Whiteboards"),
  link("Notes"),
  ext("Clips"),
  ext("Canvas"),
  ext("Paper"),
  ext("Sheets"),
  ext("Slides"),
  ext("Tasks"),
  ext("Scheduler"),
  link("Discover More Products", { spaced: true }),
  group("My Account", [
    link("Profile"),
    link("Settings"),
    link("Personal Devices"),
    link("Personal Contacts"),
    link("Data & Privacy"),
  ]),
  group("Admin", [
    group("Plans and Billing", [link("Plan Management"), link("Billing Management"), link("Payment History")]),
    group("User Management", [link("Users")]),
    group("Account Management", [link("Account Profile"), link("Reports")]),
    group("Advanced", [link("App Marketplace"), link("Data & Privacy"), link("Integration")]),
  ]),
  group("Support", [ext("Zoom Learning Center"), ext("Video Tutorials"), link("Knowledge Base")]),
];
