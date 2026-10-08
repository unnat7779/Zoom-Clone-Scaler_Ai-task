"use client";

import { createContext, useContext } from "react";

export type MenuTone = "light" | "dark";
/** default: zoom-ui dropdown rows (6px 8px) · profile: Workplace profile-menu rows (7px 8px) */
export type MenuDensity = "default" | "profile";

export interface MenuContextValue {
  tone: MenuTone;
  density: MenuDensity;
}

export const MenuContext = createContext<MenuContextValue>({ tone: "light", density: "default" });

export const useMenuContext = () => useContext(MenuContext);
