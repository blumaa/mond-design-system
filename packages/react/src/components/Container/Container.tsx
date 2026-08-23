import type { ElementType, ReactElement } from "react";
import { createElement } from "react";
import { cx } from "../../internal/cx";
import type { AnyPolymorphic, Polymorphic } from "../../internal/polymorphic";
import styles from "./Container.module.css";

export type ContainerWidth = "content" | "wide";

export interface ContainerOwnProps {
  /** content = reading column, wide = desktop shell. Default "content". */
  width?: ContainerWidth;
}

export type ContainerProps<T extends ElementType = "div"> = Polymorphic<T, ContainerOwnProps>;

/**
 * Centered max-width column with page-edge padding.
 *
 * ```tsx
 * <Container>
 *   <Stack gap="section">…</Stack>
 * </Container>
 * ```
 */
export function Container<T extends ElementType = "div">(props: ContainerProps<T>): ReactElement {
  const { width = "content", as = "div", className, ...rest } = props as AnyPolymorphic<ContainerOwnProps>;

  return createElement(as, {
    className: cx(styles.container, styles[`width-${width}`], className),
    ...rest,
  });
}
