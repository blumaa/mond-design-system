import type { CSSProperties, HTMLAttributes, ReactElement, Ref } from "react";
import { cx } from "../../internal/cx";
import styles from "./Skeleton.module.css";

export type SkeletonVariant = "text" | "rect" | "circle";

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: SkeletonVariant;
  /** Any CSS length. Text defaults to full width, one line tall. */
  width?: string;
  height?: string;
  /** How many lines of text to stand in for. Above one, the last is cut short
      — a paragraph ends mid-line, and a block of full-width bars reads as a
      table. Text only: a rect or a circle is one shape however many lines of
      copy it replaces. */
  lines?: number;
  ref?: Ref<HTMLSpanElement>;
}

/* Where a paragraph's last line tends to land. */
const LAST_LINE = "62%";

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
 *       <Skeleton lines={3} />
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
  lines = 1,
  className,
  style,
  ...rest
}: SkeletonProps): ReactElement {
  const vars = {
    ...(width ? { "--skeleton-w": width } : {}),
    ...(height ? { "--skeleton-h": height } : {}),
  } as CSSProperties;
  const box = cx(styles.skeleton, styles[`variant-${variant}`], className);

  if (variant === "text" && lines > 1) {
    return (
      <span aria-hidden="true" className={styles.lines} style={style} {...rest}>
        {Array.from({ length: lines }, (_, line) => (
          <span
            key={line}
            className={box}
            style={line === lines - 1 ? { ...vars, "--skeleton-w": LAST_LINE } as CSSProperties : vars}
          />
        ))}
      </span>
    );
  }

  return <span aria-hidden="true" className={box} style={{ ...vars, ...style }} {...rest} />;
}
