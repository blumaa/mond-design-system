import type { ElementType, ReactElement } from "react";
import { createElement } from "react";
import { cx } from "../../internal/cx";
import type { AnyPolymorphic, Polymorphic } from "../../internal/polymorphic";
import styles from "./Inline.module.css";

export type InlineGap = "hairline" | "tight" | "base" | "loose";
export type InlineAlign = "start" | "center" | "end" | "baseline";
export type InlineJustify = "start" | "center" | "end" | "between";

export interface InlineOwnProps {
  /** Space between children, on the gap scale. Default "base". */
  gap?: InlineGap;
  /** Cross-axis alignment. Default "center". */
  align?: InlineAlign;
  /** Main-axis distribution. Default "start". */
  justify?: InlineJustify;
  /** Allow wrapping onto new lines. */
  wrap?: boolean;
}

export type InlineProps<T extends ElementType = "div"> = Polymorphic<T, InlineOwnProps>;

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
export function Inline<T extends ElementType = "div">(props: InlineProps<T>): ReactElement {
  const {
    gap = "base",
    align = "center",
    justify = "start",
    wrap = false,
    as = "div",
    className,
    ...rest
  } = props as AnyPolymorphic<InlineOwnProps>;

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
