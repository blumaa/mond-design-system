import type { HTMLAttributes, ReactElement } from "react";
import { cx, type CSSVars } from "../../internal/cx";
import styles from "./Spinner.module.css";

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  /** Diameter in px. Default 20. */
  size?: number;
  /** Accessible label. Default "Loading". */
  label?: string;
}

/**
 * Indeterminate loading ring. Arc takes currentColor, so it matches whatever
 * text it sits beside. Keyframe is local: CSS Modules localizes
 * animation-name, a global one resolves to nothing. base.css stops it under
 * prefers-reduced-motion.
 *
 * ```tsx
 * <Spinner label="Loading sessions" />
 * ```
 */
export function Spinner({
  size = 20,
  label = "Loading",
  className,
  style,
  ...rest
}: SpinnerProps): ReactElement {
  /* Per-instance knobs, not design tokens. Ring thickness scales with the
     diameter, floored so small spinners stay visible. */
  const vars: CSSVars = {
    "--spinner-size": `${size}px`,
    "--spinner-border": `${Math.max(2, Math.round(size / 10))}px`,
  };
  return (
    <span
      role="status"
      aria-label={label}
      className={cx(styles.spinner, className)}
      style={{ ...vars, ...style }}
      {...rest}
    />
  );
}
