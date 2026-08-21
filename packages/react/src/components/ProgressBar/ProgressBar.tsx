import type { CSSProperties, HTMLAttributes, ReactElement, Ref } from "react";
import { cx } from "../../internal/cx";
import styles from "./ProgressBar.module.css";

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  /** 0–100; clamped. Ignored when indeterminate. */
  value?: number;
  /** Accessible name — required. A bare bar announces nothing useful. */
  label: string;
  indeterminate?: boolean;
  ref?: Ref<HTMLDivElement>;
}

/**
 * Determinate or indeterminate progress track.
 *
 * ```tsx
 * <ProgressBar label="Upload" value={64} />
 * <ProgressBar label="Syncing" indeterminate />
 * ```
 */
export function ProgressBar({
  value = 0,
  label,
  indeterminate = false,
  className,
  style,
  ...rest
}: ProgressBarProps): ReactElement {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={indeterminate ? undefined : clamped}
      className={cx(styles.track, indeterminate && styles.indeterminate, className)}
      style={{ ...( { "--progress": `${clamped}%` } as CSSProperties), ...style }}
      {...rest}
    >
      <span className={styles.fill} />
    </div>
  );
}
