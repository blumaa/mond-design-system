import type { HTMLAttributes, ReactElement, ReactNode, Ref } from "react";
import { cx } from "../../internal/cx";
import styles from "./ChipGroup.module.css";

export type ChipGroupGap = "hairline" | "tight" | "base";

export interface ChipGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Chips (or any inline items) laid out in a wrapping group. */
  children: ReactNode;
  /** Space between items, on the gap scale. Default "tight". */
  gap?: ChipGroupGap;
  ref?: Ref<HTMLDivElement>;
}

/**
 * Wrapping row of Chips for multi-select choices inside a form (pick several
 * days, locations, tags…). Items wrap onto new lines so nothing scrolls
 * off-screen; use ChipBar for a single-line scrolling filter strip.
 *
 * ```tsx
 * <ChipGroup>
 *   {days.map((day) => (
 *     <Chip key={day} selected={picked.has(day)} onClick={() => toggle(day)}>
 *       {day}
 *     </Chip>
 *   ))}
 * </ChipGroup>
 * ```
 */
export function ChipGroup({ children, gap = "tight", className, ...rest }: ChipGroupProps): ReactElement {
  return (
    <div className={cx(styles.group, styles[`gap-${gap}`], className)} {...rest}>
      {children}
    </div>
  );
}
