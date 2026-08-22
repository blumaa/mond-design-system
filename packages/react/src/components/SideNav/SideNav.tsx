import type { ElementType, HTMLAttributes, MouseEventHandler, ReactElement, ReactNode, Ref } from "react";
import { useId } from "react";
import { cx } from "../../internal/cx";
import { Badge } from "../Badge/Badge";
import styles from "./SideNav.module.css";

export interface SideNavProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** Accessible name of the navigation landmark. There is more than one
      navigation on a page wide enough to show this one. */
  label: string;
  children: ReactNode;
  ref?: Ref<HTMLElement>;
}

/**
 * The standing column of destinations, from the width where it costs nothing.
 * TabBar is the same list on a phone; both are navigation landmarks whose
 * items stay in the natural tab order — roving focus is for composite
 * widgets, not for navigation.
 *
 * ```tsx
 * <SideNav label="Primary">
 *   <SideNavItem label="Home" icon={<Icon name="home" />} href="/" active />
 *   <Divider />
 *   <SideNavGroup label="More">
 *     <SideNavItem label="Settings" icon={<Icon name="settings" />} href="/settings" />
 *   </SideNavGroup>
 *   <Button fullWidth iconLeft={<Icon name="plus" />} onClick={compose}>New post</Button>
 * </SideNav>
 * ```
 *
 * The column's own placement is the host's — a sticky offset under a header,
 * a fixed rail, a plain block — so it takes a className and sets none of it.
 */
export function SideNav({ label, className, children, ref, ...rest }: SideNavProps): ReactElement {
  return (
    <nav ref={ref} aria-label={label} className={cx(styles.nav, className)} {...rest}>
      {children}
    </nav>
  );
}

export interface SideNavGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Heading over the run, which also names it to a screen reader. Without
      one the rows are still a run on screen and nothing to be told about, so
      the group takes no role. */
  label?: ReactNode;
  children: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

/** A run of destinations under one heading, or none. */
export function SideNavGroup({
  label,
  className,
  children,
  ref,
  ...rest
}: SideNavGroupProps): ReactElement {
  const headingId = useId();

  return (
    <div
      ref={ref}
      className={cx(styles.group, className)}
      role={label != null ? "group" : undefined}
      aria-labelledby={label != null ? headingId : undefined}
      {...rest}
    >
      {label != null && (
        <span className={styles.heading} id={headingId}>
          {label}
        </span>
      )}
      {children}
    </div>
  );
}

export interface SideNavItemProps {
  label: ReactNode;
  icon?: ReactNode;
  href?: string | undefined;
  onClick?: MouseEventHandler | undefined;
  /** The destination the reader is on. Lands as aria-current="page". */
  active?: boolean | undefined;
  /** How many are waiting, at the far end of the row. Nothing at zero: an
      absence needs no mark. */
  count?: number | undefined;
  /** What the count counts, in words — the badge is read as this, and a bare
      number is read as nothing. */
  countLabel?: string | undefined;
  /** The last number worth printing; above it the badge says `99+`, because
      the column's width is fixed and a fourth digit takes it from the word. */
  max?: number | undefined;
  /** Element override for the link, e.g. a router's Link. */
  as?: ElementType;
}

/** One destination. A link where it has one, a button where it does not. */
export function SideNavItem({
  label,
  icon,
  href,
  onClick,
  active = false,
  count,
  countLabel,
  max = 99,
  as,
}: SideNavItemProps): ReactElement {
  const className = cx(styles.item, active && styles.active);
  const current = active ? "page" : undefined;
  const content = (
    <>
      {icon != null && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      <span className={styles.label}>{label}</span>
      {count !== undefined && count > 0 && (
        <Badge tone="accent" role="status" aria-label={countLabel} className={styles.count}>
          {count > max ? `${max}+` : count}
        </Badge>
      )}
    </>
  );

  if (href !== undefined) {
    const Element: ElementType = as ?? "a";
    return (
      <Element href={href} className={className} aria-current={current} onClick={onClick}>
        {content}
      </Element>
    );
  }

  return (
    <button type="button" className={className} aria-current={current} onClick={onClick}>
      {content}
    </button>
  );
}
