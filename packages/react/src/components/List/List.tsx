import type { HTMLAttributes, ReactElement, ReactNode } from "react";
import { createContext, useContext, useId } from "react";
import { cx } from "../../internal/cx";
import styles from "./List.module.css";

/* Tells an item whether a group is painting the card around it. */
const ListGroupContext = createContext(false);

export interface ListGroupProps extends HTMLAttributes<HTMLUListElement> {
  children: ReactNode;
  /** Heading over the group. Also names the list to a screen reader. */
  label?: ReactNode;
}

/**
 * Card-styled list container for ListItems.
 *
 * ```tsx
 * <ListGroup label="Account">
 *   <ListItem
 *     title="Profile"
 *     description="Name, avatar"
 *     leading={<Icon name="user" />}
 *     href="/profile"
 *   />
 *   <ListItem title="Log out" onClick={logout} />
 * </ListGroup>
 * ```
 */
export function ListGroup({ label, className, ...rest }: ListGroupProps): ReactElement {
  const headingId = useId();

  const list = (
    <ListGroupContext.Provider value={true}>
      <ul
        className={cx(styles.group, className)}
        aria-labelledby={label != null ? headingId : undefined}
        {...rest}
      />
    </ListGroupContext.Provider>
  );

  if (label == null) return list;
  return (
    <div className={styles.labelledGroup}>
      <span className={styles.label} id={headingId}>
        {label}
      </span>
      {list}
    </div>
  );
}

export type ListItemSurface = "card" | "sunken" | "accent" | "plain";

export interface ListItemProps extends Omit<HTMLAttributes<HTMLElement>, "title" | "onClick"> {
  title: ReactNode;
  description?: ReactNode;
  /** Slot before the text — Avatar, Icon, … */
  leading?: ReactNode;
  /** Slot after the text — Badge, chevron, … */
  trailing?: ReactNode;
  /** Makes the whole row a button. */
  onClick?: () => void;
  /** Marks an onClick row as a toggle — a picker row that selects rather than
      navigates. Lands as aria-pressed on the row button itself, where the
      screen reader's focus is. Leave unset for rows that navigate. */
  pressed?: boolean;
  /** Makes the whole row a link. Wins over onClick. */
  href?: string;
  /** What the row paints behind itself. Inside a ListGroup the group is the
      card, so grouped rows default to painting nothing; standalone rows
      default to their own card. `accent` is the tinted, accent-edged prompt
      row. The row paints it itself because a background drawn by a wrapper
      brings its own corner radius, which peeks past the row's in all four
      corners. */
  surface?: ListItemSurface;
}

/**
 * One row. Static by default; interactive as one whole-row button/link.
 * An `<li>` inside a ListGroup, a standalone `<div>` row anywhere else.
 */
export function ListItem({
  title,
  description,
  leading,
  trailing,
  onClick,
  pressed,
  href,
  surface,
  className,
  ...rest
}: ListItemProps): ReactElement {
  const inGroup = useContext(ListGroupContext);
  const Root = inGroup ? "li" : "div";
  // Grouped rows paint nothing unless told otherwise; standalone rows carry
  // their own card.
  const resolved = surface ?? (inGroup ? undefined : "card");

  const content = (
    <>
      {leading != null && <span className={styles.leading}>{leading}</span>}
      <span className={styles.text}>
        <span className={styles.title}>{title}</span>
        {description != null && <span className={styles.description}>{description}</span>}
      </span>
      {trailing != null && <span className={styles.trailing}>{trailing}</span>}
    </>
  );

  return (
    <Root
      className={cx(styles.item, resolved && styles[`surface-${resolved}`], className)}
      {...rest}
    >
      {href !== undefined ? (
        <a className={cx(styles.row, styles.interactive)} href={href}>
          {content}
        </a>
      ) : onClick !== undefined ? (
        <button
          type="button"
          className={cx(styles.row, styles.interactive)}
          onClick={onClick}
          aria-pressed={pressed}
        >
          {content}
        </button>
      ) : (
        <span className={styles.row}>{content}</span>
      )}
    </Root>
  );
}
