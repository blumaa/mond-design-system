import type { HTMLAttributes, ReactElement, ReactNode, Ref } from "react";
import { cx } from "../../internal/cx";
import styles from "./Card.module.css";

export type CardVariant = "card" | "raised" | "sunken";

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, "onClick"> {
  children: ReactNode;
  /** card = flat on border, raised = elevated, sunken = recessed fill for
      secondary tiles. Default "card". */
  variant?: CardVariant;
  /** Accent border — marks the card out from its neighbours (a pinned post,
      the active choice) without changing its surface. */
  emphasis?: boolean;
  /** Makes the whole card a button. */
  onClick?: () => void;
  /** Makes the whole card a link. Wins over onClick. */
  href?: string;
  /** The root is an `<a>`, a `<button>` or a `<div>` depending on the props,
      so the ref is typed to what all three are. */
  ref?: Ref<HTMLElement>;
}

/**
 * Surface container. Compose with CardHeader/CardBody/CardFooter — the card
 * owns internal spacing, sections own their content.
 *
 * ```tsx
 * <Card>
 *   <CardHeader><Heading level={3}>Next session</Heading></CardHeader>
 *   <CardBody><Text>Tomorrow, 19:00</Text></CardBody>
 *   <CardFooter><Button size="sm">Join</Button></CardFooter>
 * </Card>
 *
 * <Card href="/items/42" variant="flat">…</Card>
 * ```
 */
export function Card({ children, variant = "card", emphasis = false, onClick, href, className, ref, ...rest }: CardProps): ReactElement {
  const cardClass = cx(styles.card, styles[`variant-${variant}`], emphasis && styles.emphasis, className);

  if (href !== undefined) {
    return (
      <a className={cx(cardClass, styles.interactive)} href={href} ref={ref as Ref<HTMLAnchorElement>} {...rest}>
        {children}
      </a>
    );
  }
  if (onClick !== undefined) {
    return (
      <button
        type="button"
        className={cx(cardClass, styles.interactive)}
        onClick={onClick}
        ref={ref as Ref<HTMLButtonElement>}
        {...rest}
      >
        {children}
      </button>
    );
  }
  return (
    <div className={cardClass} ref={ref as Ref<HTMLDivElement>} {...rest}>
      {children}
    </div>
  );
}

export type CardSectionProps = HTMLAttributes<HTMLDivElement> & { ref?: Ref<HTMLDivElement> };

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
