"use client";

import { HomeMenuChevronRightIcon } from "@/shared/icons/generated/HomeMenuChevronRightIcon";
import { HomeMenuExternalIcon } from "@/shared/icons/generated/HomeMenuExternalIcon";
import { HomeMenuHelpIcon } from "@/shared/icons/generated/HomeMenuHelpIcon";
import { HomeMenuPlansBillingIcon } from "@/shared/icons/generated/HomeMenuPlansBillingIcon";
import { HomeMenuProfileIcon } from "@/shared/icons/generated/HomeMenuProfileIcon";
import { HomeMenuSettingsIcon } from "@/shared/icons/generated/HomeMenuSettingsIcon";
import type { User } from "@/shared/types/api";
import type { PresenceStatus } from "@/shared/ui/Avatar";
import { Menu, MenuDivider, MenuItem } from "@/shared/ui/Menu";
import { useToast } from "@/shared/ui/Toast";
import { useShellContext } from "../../context/ShellContext";
import { useHoverSubmenus } from "../../hooks/useHoverSubmenus";
import { useShellDialog } from "../../hooks/useShellIntegration";
import { DownloadAppRow } from "./DownloadAppRow";
import { HelpSubmenu } from "./HelpSubmenu";
import { ProfileIdentity } from "./ProfileIdentity";
import { StatusItem } from "./StatusItem";
import { StatusSubmenu } from "./StatusSubmenu";
import { UpgradeBanner } from "./UpgradeBanner";
import styles from "./ProfileMenu.module.css";

interface ProfileMenuBodyProps {
  user: User;
  presence: PresenceStatus;
  /** ≤768px full-screen sheet: submenus open on tap only and ↗ icons are always shown */
  sheet: boolean;
  onClose: () => void;
}

/**
 * Profile-menu rows (PRD §6.6). Status and Help open their submenus on hover (and click / → / Enter);
 * every other row closes the menu. Mounted only while the menu is open, so submenus start closed.
 */
export function ProfileMenuBody({ user, presence, sheet, onClose }: ProfileMenuBodyProps) {
  const toast = useToast();
  const settings = useShellDialog("settings");
  const about = useShellDialog("about");
  const setStatus = useShellContext()?.setStatus;
  const submenus = useHoverSubmenus<"status" | "help">(!sheet);
  const open = submenus.open;

  const select = (action: () => void) => () => {
    onClose();
    action();
  };
  const external = <HomeMenuExternalIcon width={14} height={14} />;
  const chevron = <HomeMenuChevronRightIcon width={16} height={16} className={styles.chevron} />;
  const link = { trailing: external, trailingOnHover: !sheet };
  const submenuProps = { focusFirst: open?.focusFirst ?? false, onBack: submenus.back, ...submenus.panelProps };

  return (
    <>
      <Menu density="profile" autoFocus aria-label="Profile options">
        <ProfileIdentity user={user} />
        <StatusItem status={presence} trailing={chevron} {...submenus.rowProps("status")} />
        <MenuDivider />
        <MenuItem icon={<HomeMenuProfileIcon />} {...link} onSelect={select(toast.notAvailable)}>
          Profile
        </MenuItem>
        <MenuItem icon={<HomeMenuSettingsIcon />} {...link} onSelect={select(settings.show)}>
          Settings
        </MenuItem>
        <MenuItem icon={<HomeMenuPlansBillingIcon />} {...link} onSelect={select(toast.notAvailable)}>
          Plans and billing
        </MenuItem>
        <MenuItem icon={<HomeMenuHelpIcon />} trailing={chevron} {...submenus.rowProps("help")}>
          Help
        </MenuItem>
        <MenuDivider />
        <MenuItem onSelect={select(toast.notAvailable)}>Add account</MenuItem>
        <MenuItem onSelect={select(toast.notAvailable)}>Sign out</MenuItem>
        <UpgradeBanner onUpgrade={select(toast.notAvailable)} />
        <DownloadAppRow onClick={select(toast.notAvailable)} />
      </Menu>
      {open?.id === "status" ? (
        <StatusSubmenu
          row={open.row}
          hoverEnabled={!sheet}
          onSelectStatus={(status) => select(() => setStatus?.(status))()}
          {...submenuProps}
        />
      ) : null}
      {open?.id === "help" ? (
        <HelpSubmenu
          row={open.row}
          externalOnHover={!sheet}
          onAbout={select(about.show)}
          onSelect={select(toast.notAvailable)}
          {...submenuProps}
        />
      ) : null}
    </>
  );
}
