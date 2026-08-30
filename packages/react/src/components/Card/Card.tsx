import type { CSSProperties, ElementType, HTMLAttributes, ReactElement, ReactNode, Ref } from "react";
import { useEffect, useRef } from "react";
import { cx } from "../../internal/cx";
import { forkRef } from "../../internal/forkRef";
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
  /** Element override for the root. With href, the link element — a router's
      Link. Without one, what the card is in the outline: a <section> that names
      itself, an <article> holding a post. No wrapper can supply that from
      outside, since the wrapper is not the card. Default div. */
  as?: ElementType;
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
export function Card({ children, variant = "card", emphasis = false, onClick, href, as, className, ref, ...rest }: CardProps): ReactElement {
  const cardClass = cx(styles.card, styles[`variant-${variant}`], emphasis && styles.emphasis, className);

  /* An interactive card is itself the control, so a control inside it is
     nested interactive: invalid inside a <button>, and unreachable or
     confusing for assistive tech either way. The children are opaque nodes,
     so the check is against the rendered DOM — a warning, since the tree is
     the caller's to fix. */
  const own = useRef<HTMLElement>(null);
  const interactive = href !== undefined || onClick !== undefined;
  useEffect(() => {
    if (!interactive) return;
    const nested = own.current?.querySelector(
      "a[href], button, input, select, textarea, [tabindex]",
    );
    if (nested != null) {
      console.warn(
        "Card: this card is a link or button, and it contains another interactive element. Move the control outside the card, or drop onClick/href.",
        nested,
      );
    }
  });

  if (href !== undefined) {
    const Element: ElementType = as ?? "a";
    return (
      <Element className={cx(cardClass, styles.interactive)} href={href} ref={forkRef(own, ref)} {...rest}>
        {children}
      </Element>
    );
  }
  if (onClick !== undefined) {
    return (
      <button
        type="button"
        className={cx(cardClass, styles.interactive)}
        onClick={onClick}
        ref={forkRef(own, ref) as Ref<HTMLButtonElement>}
        {...rest}
      >
        {children}
      </button>
    );
  }
  const Element: ElementType = as ?? "div";
  return (
    <Element className={cardClass} ref={ref as Ref<HTMLDivElement>} {...rest}>
      {children}
    </Element>
  );
}

export type CardSectionProps = HTMLAttributes<HTMLDivElement> & { ref?: Ref<HTMLDivElement> };

/** Top slot — title row, media, tabs. */
export function CardHeader({ className, ...rest }: CardSectionProps): ReactElement {
  return <div className={cx(styles.header, className)} {...rest} />;
}

export interface CardBodyProps extends CardSectionProps {
  /** How many lines of content the card affords. Past it the body clips, with
      an ellipsis on the last line. Unset, the body grows to what it holds. */
  lines?: number;
}

/**
 * Main content slot.
 *
 * The card is the box, so the box is what says how much of a thing fits:
 * `lines` clips whatever the body holds — a paragraph, two of them, a bare
 * string — rather than asking each child to clip itself.
 *
 * A budgeted body counts lines, which is a thing only `-webkit-box` does, so it
 * is no longer a flex column: `gap` between its children stops applying and a
 * margin is what separates them. A body doing layout for a card keeps its own
 * budget-free, and holds a budgeted one for the part that has to fit.
 */
export function CardBody({ lines, className, style, ...rest }: CardBodyProps): ReactElement {
  const vars = lines === undefined ? undefined : ({ "--card-lines": lines } as CSSProperties);
  return (
    <div
      className={cx(styles.body, lines !== undefined && styles.clipped, className)}
      style={{ ...vars, ...style }}
      {...rest}
    />
  );
}

/** Bottom slot — actions, meta. */
export function CardFooter({ className, ...rest }: CardSectionProps): ReactElement {
  return <div className={cx(styles.footer, className)} {...rest} />;
}
