import type { ElementType, ReactElement } from "react";
import { createElement } from "react";
import { cx } from "../../internal/cx";
import type { AnyPolymorphic, Polymorphic } from "../../internal/polymorphic";
import styles from "./Stack.module.css";

export type StackGap = "hairline" | "tight" | "base" | "loose" | "group" | "section";
export type StackAlign = "start" | "center" | "end" | "stretch";

export interface StackOwnProps {
  /** Space between children, on the gap scale. Default "base". */
  gap?: StackGap;
  /** Cross-axis alignment. Default "stretch". */
  align?: StackAlign;
}

export type StackProps<T extends ElementType = "div"> = Polymorphic<T, StackOwnProps>;

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
export function Stack<T extends ElementType = "div">(props: StackProps<T>): ReactElement {
  const {
    gap = "base",
    align = "stretch",
    as = "div",
    className,
    ...rest
  } = props as AnyPolymorphic<StackOwnProps>;

  return createElement(as, {
    className: cx(styles.stack, styles[`gap-${gap}`], styles[`align-${align}`], className),
    ...rest,
  });
}
