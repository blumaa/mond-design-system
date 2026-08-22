import type { ElementType, HTMLAttributes, ReactElement } from "react";
import { createElement } from "react";
import { cx } from "../../internal/cx";
import styles from "./Stack.module.css";

export type StackGap = "hairline" | "tight" | "base" | "loose" | "group" | "section";
export type StackAlign = "start" | "center" | "end" | "stretch";

export interface StackProps extends HTMLAttributes<HTMLElement> {
  /** Space between children, on the gap scale. Default "base". */
  gap?: StackGap;
  /** Cross-axis alignment. Default "stretch". */
  align?: StackAlign;
  /** Element to render. Default div. */
  as?: ElementType;
}

/**
 * Vertical flow. The parent owns spacing between siblings via gap —
 * children carry no outer margins. Token-bounded on purpose: no arbitrary
 * lengths, no style prop.
 *
 * ```tsx
 * <Stack gap="base">
 *   <Heading level={2}>Profile</Heading>
 *   <Text tone="secondary">Public information</Text>
 * </Stack>
 * ```
 */
export function Stack({
  gap = "base",
  align = "stretch",
  as = "div",
  className,
  ...rest
}: StackProps): ReactElement {
  return createElement(as, {
    className: cx(styles.stack, styles[`gap-${gap}`], styles[`align-${align}`], className),
    ...rest,
  });
}
