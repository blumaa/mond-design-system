import type { HTMLAttributes, JSX, ReactElement } from "react";
import { createElement } from "react";
import { cx } from "../../internal/cx";
import styles from "./VisuallyHidden.module.css";

export interface VisuallyHiddenProps extends HTMLAttributes<HTMLElement> {
  /** Element override when the markup needs a particular tag — a page's h1, a
      table's thead. Default "span". */
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Text for screen readers and not for eyes.
 *
 * The design does not always draw what the markup owes: a screen whose title is
 * the tab bar underneath it still needs an h1, and a table whose columns are
 * obvious to look at still needs a thead. Both go here rather than into a
 * one-off class in the app.
 *
 * ```tsx
 * <VisuallyHidden as="h1">Discover</VisuallyHidden>
 * <VisuallyHidden role="status" aria-live="polite">{message}</VisuallyHidden>
 * ```
 */
export function VisuallyHidden({ as = "span", className, ...rest }: VisuallyHiddenProps): ReactElement {
  return createElement(as, { className: cx(styles.hidden, className), ...rest });
}
