import type { HTMLAttributes, LiHTMLAttributes, ReactElement, ReactNode } from "react";
import { cx } from "../../internal/cx";
import styles from "./List.module.css";

export interface ListGroupProps extends HTMLAttributes<HTMLUListElement> {
  children: ReactNode;
}

/** Card-styled list container for ListItems. */
export function ListGroup({ className, ...rest }: ListGroupProps): ReactElement {
  return <ul className={cx(styles.group, className)} {...rest} />;
}

export interface ListItemProps extends Omit<LiHTMLAttributes<HTMLLIElement>, "title" | "onClick"> {
  title: string;
  description?: string;
  /** Slot before the text — Avatar, Icon, … */
  leading?: ReactNode;
  /** Slot after the text — Badge, chevron, … */
  trailing?: ReactNode;
  /** Makes the whole row a button. */
  onClick?: () => void;
  /** Makes the whole row a link. Wins over onClick. */
  href?: string;
}

/** One row. Static by default; interactive as one whole-row button/link. */
export function ListItem({
  title,
  description,
  leading,
  trailing,
  onClick,
  href,
  className,
  ...rest
}: ListItemProps): ReactElement {
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
    <li className={cx(styles.item, className)} {...rest}>
      {href !== undefined ? (
        <a className={cx(styles.row, styles.interactive)} href={href}>
          {content}
        </a>
      ) : onClick !== undefined ? (
        <button type="button" className={cx(styles.row, styles.interactive)} onClick={onClick}>
          {content}
        </button>
      ) : (
        <span className={styles.row}>{content}</span>
      )}
    </li>
  );
}
