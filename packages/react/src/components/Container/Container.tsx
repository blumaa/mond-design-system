import type { ElementType, HTMLAttributes, ReactElement } from "react";
import { createElement } from "react";
import { cx } from "../../internal/cx";
import styles from "./Container.module.css";

export type ContainerWidth = "content" | "wide";

export interface ContainerProps extends HTMLAttributes<HTMLElement> {
  /** content = reading column, wide = desktop shell. Default "content". */
  width?: ContainerWidth;
  /** Element to render. Default div. */
  as?: ElementType;
}

/** Centered max-width column with page-edge padding. */
export function Container({
  width = "content",
  as = "div",
  className,
  ...rest
}: ContainerProps): ReactElement {
  return createElement(as, {
    className: cx(styles.container, styles[`width-${width}`], className),
    ...rest,
  });
}
