import type { MouseEventHandler, ReactNode } from "react";
import { cx } from "../../internal/cx";
import styles from "./TabBar.module.css";

export interface TabBarProps {
  /** Accessible name of the navigation landmark. */
  label: string;
  children: ReactNode;
}

/**
 * Bottom navigation. Items are links (or buttons for non-route actions);
 * they stay in the natural tab order — roving focus is for composite
 * widgets, not navigation landmarks.
 *
 * ```tsx
 * <TabBar label="Primary">
 *   <TabBarItem label="Home" icon={<Icon name="home" />} href="/" active />
 *   <TabBarItem label="Search" icon={<Icon name="search" />} href="/search" />
 * </TabBar>
 * ```
 */
export function TabBar({ label, children }: TabBarProps) {
  return (
    <nav aria-label={label} className={styles.bar}>
      {children}
    </nav>
  );
}

export interface TabBarItemProps {
  label: string;
  icon: ReactNode;
  href?: string | undefined;
  onClick?: MouseEventHandler | undefined;
  active?: boolean | undefined;
}

export function TabBarItem({ label, icon, href, onClick, active = false }: TabBarItemProps) {
  const className = cx(styles.item, active && styles.active);
  const content = (
    <>
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
      <span className={styles.label}>{label}</span>
    </>
  );
  if (href !== undefined) {
    return (
      <a href={href} className={className} aria-current={active ? "page" : undefined} onClick={onClick}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" className={className} aria-current={active ? "page" : undefined} onClick={onClick}>
      {content}
    </button>
  );
}
