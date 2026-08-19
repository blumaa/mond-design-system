import type { HTMLAttributes, MouseEventHandler, ReactElement, ReactNode } from "react";
import { cx } from "../../internal/cx";
import styles from "./Chip.module.css";

export type ChipVariant = "soft" | "outline" | "highlight";

export interface ChipProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  /** Unselected appearance. Default "soft". */
  variant?: ChipVariant;
  /** Toggle state. When given on an interactive chip it also sets aria-pressed;
   * omit for a plain action chip so it does not announce as a toggle. */
  selected?: boolean;
  /** Leading glyph, sized by the chip. */
  icon?: ReactNode;
  /** When provided, Chip renders as a `<button>`. */
  onClick?: MouseEventHandler;
  disabled?: boolean;
}

/**
 * Compact pill for filters and single/multi choices. Interactive (a button,
 * with aria-pressed when `selected` is given) when `onClick` is set, otherwise
 * a static pill. For a passive content label use Tag instead.
 *
 * ```tsx
 * <Chip selected={filter === "all"} onClick={() => setFilter("all")}>All</Chip>
 * <Chip variant="outline" icon={<Icon name="pin" />}>Nearby</Chip>
 * ```
 */
export function Chip({
  children,
  variant = "soft",
  selected,
  icon,
  onClick,
  disabled = false,
  className,
  ...rest
}: ChipProps): ReactElement {
  const interactive = typeof onClick === "function";

  const shared = {
    className: cx(
      styles.chip,
      styles[`variant-${variant}`],
      selected && styles.selected,
      interactive && !disabled && styles.interactive,
      disabled && styles.disabled,
      className,
    ),
    ...rest,
  };

  const content = (
    <>
      {icon ? <span className={styles.icon}>{icon}</span> : null}
      {children}
    </>
  );

  return interactive ? (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected === undefined ? undefined : selected}
      {...shared}
    >
      {content}
    </button>
  ) : (
    <span {...shared}>{content}</span>
  );
}
