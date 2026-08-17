import type { HTMLAttributes, ReactElement, ReactNode } from "react";
import { cx } from "../../internal/cx";
import styles from "./Card.module.css";

export type CardVariant = "card" | "raised";

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, "onClick"> {
  children: ReactNode;
  /** card = flat on border, raised = elevated. Default "card". */
  variant?: CardVariant;
  /** Makes the whole card a button. */
  onClick?: () => void;
  /** Makes the whole card a link. Wins over onClick. */
  href?: string;
}

/**
 * Surface container. Compose with CardHeader/CardBody/CardFooter — the card
 * owns internal spacing, sections own their content.
 */
export function Card({ children, variant = "card", onClick, href, className, ...rest }: CardProps): ReactElement {
  const cardClass = cx(styles.card, styles[`variant-${variant}`], className);

  if (href !== undefined) {
    return (
      <a className={cx(cardClass, styles.interactive)} href={href} {...rest}>
        {children}
      </a>
    );
  }
  if (onClick !== undefined) {
    return (
      <button type="button" className={cx(cardClass, styles.interactive)} onClick={onClick} {...rest}>
        {children}
      </button>
    );
  }
  return (
    <div className={cardClass} {...rest}>
      {children}
    </div>
  );
}

export type CardSectionProps = HTMLAttributes<HTMLDivElement>;

/** Top slot — title row, media, tabs. */
export function CardHeader({ className, ...rest }: CardSectionProps): ReactElement {
  return <div className={cx(styles.header, className)} {...rest} />;
}

/** Main content slot. */
export function CardBody({ className, ...rest }: CardSectionProps): ReactElement {
  return <div className={cx(styles.body, className)} {...rest} />;
}

/** Bottom slot — actions, meta. */
export function CardFooter({ className, ...rest }: CardSectionProps): ReactElement {
  return <div className={cx(styles.footer, className)} {...rest} />;
}
