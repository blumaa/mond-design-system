import type { CSSProperties, HTMLAttributes, ReactElement } from "react";
import { cx } from "../../internal/cx";
import styles from "./Skeleton.module.css";

export type SkeletonVariant = "text" | "rect" | "circle";

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: SkeletonVariant;
  /** Any CSS length. Text defaults to full width, one line tall. */
  width?: string;
  height?: string;
}

/**
 * Loading placeholder. aria-hidden — the loading announcement belongs to the
 * region (aria-busy), not to each shimmering box.
 *
 * ```tsx
 * <div aria-busy={loading}>
 *   {loading ? (
 *     <Stack gap="tight">
 *       <Skeleton width="40%" />
 *       <Skeleton />
 *       <Skeleton variant="rect" height="8rem" />
 *     </Stack>
 *   ) : (
 *     content
 *   )}
 * </div>
 * ```
 */
export function Skeleton({
  variant = "text",
  width,
  height,
  className,
  style,
  ...rest
}: SkeletonProps): ReactElement {
  const vars = {
    ...(width ? { "--skeleton-w": width } : {}),
    ...(height ? { "--skeleton-h": height } : {}),
  } as CSSProperties;
  return (
    <span
      aria-hidden="true"
      className={cx(styles.skeleton, styles[`variant-${variant}`], className)}
      style={{ ...vars, ...style }}
      {...rest}
    />
  );
}
