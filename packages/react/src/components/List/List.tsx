import type { ElementType, HTMLAttributes, ReactElement, ReactNode, Ref } from "react";
import { createContext, useContext, useId } from "react";
import { cx } from "../../internal/cx";
import styles from "./List.module.css";

/* Tells an item whether a group is painting the card around it. */
const ListGroupContext = createContext(false);

export interface ListGroupProps extends HTMLAttributes<HTMLUListElement> {
  children: ReactNode;
  /** Heading over the group. Also names the list to a screen reader. */
  label?: ReactNode;
  ref?: Ref<HTMLUListElement>;
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
  /** Slot after the text — Badge, chevron, … Inside the row's hit target, so
      it is for things that are read, not pressed. */
  trailing?: ReactNode;
  /** Controls of the row's own, beside it rather than in it. A roster row
      navigates to the member and carries an add/remove button: put that in
      `trailing` and it is a button inside the link. This slot sits outside
      the hit target, where a second control can be reached. */
  actions?: ReactNode;
  /** Makes the whole row a button — or, with `href`, reports the press on the
      way out: a notification marked read, a tap counted. */
  onClick?: () => void;
  /** Marks an onClick row as a toggle — a picker row that selects rather than
      navigates. Lands as aria-pressed on the row button itself, where the
      screen reader's focus is. Leave unset for rows that navigate. */
  pressed?: boolean;
  /** Makes the whole row a link. The row navigates rather than acts, and any
      onClick rides along with the navigation. */
  href?: string;
  /** Element override for that link, e.g. a router's Link. */
  as?: ElementType;
  /** What the row paints behind itself. Inside a ListGroup the group is the
      card, so grouped rows default to painting nothing; standalone rows
      default to their own card. `accent` is the tinted, accent-edged prompt
      row. The row paints it itself because a background drawn by a wrapper
      brings its own corner radius, which peeks past the row's in all four
      corners. */
  surface?: ListItemSurface;
  /** The root is an `<li>` inside a ListGroup and a `<div>` outside one, so
      the ref is typed to what both are. */
  ref?: Ref<HTMLElement>;
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
  actions,
  onClick,
  pressed,
  href,
  as,
  surface,
  className,
  ref,
  ...rest
}: ListItemProps): ReactElement {
  const inGroup = useContext(ListGroupContext);
  const Root = inGroup ? "li" : "div";
  const LinkElement: ElementType = as ?? "a";
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
      className={cx(
        styles.item,
        actions != null && styles.withActions,
        resolved && styles[`surface-${resolved}`],
        className,
      )}
      ref={ref as Ref<HTMLLIElement & HTMLDivElement>}
      {...rest}
    >
      {href !== undefined ? (
        <LinkElement className={cx(styles.row, styles.interactive)} href={href} onClick={onClick}>
          {content}
        </LinkElement>
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
      {actions != null && <span className={styles.actions}>{actions}</span>}
    </Root>
  );
}
