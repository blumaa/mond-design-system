import type { HTMLAttributes, ReactElement } from "react";
import { cx } from "../../internal/cx";
import styles from "./Divider.module.css";

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

/** Visual separator. Semantic separator role via <hr>-equivalent div. */
export function Divider({ orientation = "horizontal", className, ...rest }: DividerProps): ReactElement {
  return (
    <div
      role="separator"
      aria-orientation={orientation === "vertical" ? "vertical" : undefined}
      className={cx(styles.divider, styles[orientation], className)}
      {...rest}
    />
  );
}
