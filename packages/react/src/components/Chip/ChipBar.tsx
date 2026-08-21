import type { HTMLAttributes, ReactElement, ReactNode, Ref } from "react";
import { Children } from "react";
import { cx } from "../../internal/cx";
import styles from "./ChipBar.module.css";

export type ChipBarGap = "hairline" | "tight" | "base";

export interface ChipBarProps extends HTMLAttributes<HTMLDivElement> {
  /** Chips (or any inline items) laid out in a single scrolling row. */
  children: ReactNode;
  /** Space between items, on the gap scale. Default "tight". */
  gap?: ChipBarGap;
  /** Frame the strip so overflow reads as a scroll area. Default false. */
  bordered?: boolean;
  /** Fade the trailing edge to hint that the row scrolls. Default true. */
  fade?: boolean;
  ref?: Ref<HTMLDivElement>;
}

/**
 * Horizontally scrollable single-line row of Chips — a filter strip. Items
 * never wrap; the row scrolls when they overflow. `fade` dissolves the
 * trailing edge so the last chip hints at more rather than getting chopped
 * mid-word. Use ChipGroup for a wrapping set of choices inside a form.
 *
 * ```tsx
 * <ChipBar>
 *   {segments.map((s) => (
 *     <Chip key={s} selected={s === segment} onClick={() => setSegment(s)}>
 *       {s}
 *     </Chip>
 *   ))}
 * </ChipBar>
 * ```
 */
export function ChipBar({
  children,
  gap = "tight",
  bordered = false,
  fade = true,
  className,
  ...rest
}: ChipBarProps): ReactElement {
  return (
    <div
      className={cx(styles.bar, styles[`gap-${gap}`], bordered && styles.bordered, fade && styles.fade, className)}
      {...rest}
    >
      {Children.map(children, (child) => (
        <div className={styles.item}>{child}</div>
      ))}
    </div>
  );
}
