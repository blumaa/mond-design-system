import type { ElementType, HTMLAttributes, ReactElement } from "react";
import { createElement } from "react";
import { cx } from "../../internal/cx";
import styles from "./Inline.module.css";

export type InlineGap = "hairline" | "tight" | "base" | "loose";
export type InlineAlign = "start" | "center" | "end" | "baseline";
export type InlineJustify = "start" | "center" | "end" | "between";

export interface InlineProps extends HTMLAttributes<HTMLElement> {
  /** Space between children, on the gap scale. Default "base". */
  gap?: InlineGap;
  /** Cross-axis alignment. Default "center". */
  align?: InlineAlign;
  /** Main-axis distribution. Default "start". */
  justify?: InlineJustify;
  /** Allow wrapping onto new lines. */
  wrap?: boolean;
  /** Element to render. Default div. */
  as?: ElementType;
}

/**
 * Horizontal flow — Stack's row twin. Same token-bounded contract.
 *
 * ```tsx
 * <Inline gap="tight" align="center" justify="between">
 *   <Text variant="label">Total</Text>
 *   <Text>42</Text>
 * </Inline>
 * ```
 */
export function Inline({
  gap = "base",
  align = "center",
  justify = "start",
  wrap = false,
  as = "div",
  className,
  ...rest
}: InlineProps): ReactElement {
  return createElement(as, {
    className: cx(
      styles.inline,
      styles[`gap-${gap}`],
      styles[`align-${align}`],
      styles[`justify-${justify}`],
      wrap && styles.wrap,
      className,
    ),
    ...rest,
  });
}
