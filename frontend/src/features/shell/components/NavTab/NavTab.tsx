"use client";

import type { MouseEvent, ReactNode } from "react";
import Link from "next/link";
import { useShellContext } from "../../context/ShellContext";

/** CSS-module classes of one navigation surface (the 80px rail, the phone tab bar). */
export interface NavTabClasses {
  tab: string | undefined;
  inner: string | undefined;
  icon: string | undefined;
  label: string | undefined;
}

interface NavTabProps {
  label: string;
  icon: ReactNode;
  classes: NavTabClasses;
  /** route tab; without it the tab is a button (Settings) */
  href?: string;
  selected?: boolean;
  onClick?: () => void;
}

/**
 * A Workplace navigation tab: icon + label, a link with `aria-current="page"` when selected (or a
 * button). Rail clicks ask the shell's navigation guard first (in a meeting: End/Leave, PRD §6.7).
 */
export function NavTab({ label, icon, classes, href, selected = false, onClick }: NavTabProps) {
  const shell = useShellContext();
  const content = (
    <span className={classes.inner}>
      <span className={classes.icon}>{icon}</span>
      <span className={classes.label}>{label}</span>
    </span>
  );

  if (!href) {
    return (
      <button type="button" className={classes.tab} aria-label={label} onClick={onClick}>
        {content}
      </button>
    );
  }

  const onNavigate = (event: MouseEvent<HTMLAnchorElement>) => {
    if (shell && !shell.canNavigate(href)) event.preventDefault();
  };
  return (
    <Link href={href} aria-current={selected ? "page" : undefined} className={classes.tab} onClick={onNavigate}>
      {content}
    </Link>
  );
}
