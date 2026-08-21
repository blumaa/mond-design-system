import type { ElementType, MouseEventHandler, ReactNode } from "react";
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
  /** Attention dot on the icon — unread, pending. Boolean only: the count
      lives on the destination screen, the bar just says "something's there". */
  badge?: boolean | undefined;
  /** Element override for the link, e.g. a router's Link. A bottom bar is
      where a full page reload costs the most — it restarts the whole shell. */
  as?: ElementType;
}

export function TabBarItem({ label, icon, href, onClick, active = false, badge = false, as }: TabBarItemProps) {
  const className = cx(styles.item, active && styles.active);
  const content = (
    <>
      <span className={styles.icon} aria-hidden="true">
        {icon}
        {badge ? <span className={styles.badge} data-testid="mds-tabbar-badge" /> : null}
      </span>
      <span className={styles.label}>{label}</span>
    </>
  );
  if (href !== undefined) {
    const Element: ElementType = as ?? "a";
    return (
      <Element href={href} className={className} aria-current={active ? "page" : undefined} onClick={onClick}>
        {content}
      </Element>
    );
  }
  return (
    <button type="button" className={className} aria-current={active ? "page" : undefined} onClick={onClick}>
      {content}
    </button>
  );
}

export interface TabBarActionProps {
  /** Names the action — icon-only, so this is all a screen reader gets. */
  label: string;
  icon: ReactNode;
  onClick?: MouseEventHandler | undefined;
}

/** Raised center action (a create button). Place it between the item halves:
    it is a peer child, and the bar's flex layout leaves it its own width. */
export function TabBarAction({ label, icon, onClick }: TabBarActionProps) {
  return (
    <button type="button" aria-label={label} className={styles.action} onClick={onClick}>
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
    </button>
  );
}
