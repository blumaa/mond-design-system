import type { ButtonHTMLAttributes, ReactElement, ReactNode } from "react";
import { cx } from "../../internal/cx";
import { Spinner } from "../Spinner/Spinner";
import styles from "./CountButton.module.css";

export type CountButtonTone = "accent" | "danger";

/* Matches --mds-icon-md; the spinner replaces an md glyph without reflow. */
const SPINNER_PX = 20;

export interface CountButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label" | "aria-pressed"> {
  /** Glyph shown before the text, e.g. `<Icon name="heart" />` (md). */
  icon: ReactNode;
  /** Accessible label (required) — describes the action for screen readers. */
  label: string;
  /**
   * Toggle state. When defined, sets `aria-pressed` and tints the control
   * with the tone colour. Omit for non-toggle actions (e.g. comment).
   */
  active?: boolean;
  /** Token the active tint reads. Default "accent". */
  tone?: CountButtonTone;
  /**
   * The write behind this action is in flight. Swaps the glyph for a spinner
   * of the same size and locks the control — a second tap in that window
   * would toggle the write straight back off.
   */
  loading?: boolean;
  /** Visible text beside the icon — typically a count or a word. */
  children?: ReactNode;
}

/**
 * Inline, chrome-less pressable pairing an icon with a count or word — like,
 * comment, react actions. Owns hover, press, disabled, loading and active
 * (`aria-pressed`) states so consumers never hand-roll button chrome.
 *
 * The app owns the glyph, so it also owns the filled/outline swap:
 *
 * ```tsx
 * <CountButton
 *   icon={<Icon name={liked ? "heart-filled" : "heart"} />}
 *   label={liked ? "Unlike" : "Like"}
 *   active={liked}
 *   loading={likeMutation.isPending}
 *   onClick={() => likeMutation.mutate()}
 * >
 *   {likeCount}
 * </CountButton>
 * ```
 */
export function CountButton({
  icon,
  label,
  active,
  tone = "accent",
  disabled = false,
  loading = false,
  className,
  children,
  ...rest
}: CountButtonProps): ReactElement {
  const isToggle = active !== undefined;

  return (
    <button
      type="button"
      disabled={disabled || loading}
      aria-label={label}
      aria-pressed={isToggle ? active : undefined}
      aria-busy={loading || undefined}
      className={cx(styles.button, active && styles[`tone-${tone}`], className)}
      {...rest}
    >
      {/* The button's own aria-busy announces the wait; the spinner is decor. */}
      {loading ? <Spinner size={SPINNER_PX} label="" aria-hidden="true" /> : <span className={styles.glyph}>{icon}</span>}
      {children != null ? <span>{children}</span> : null}
    </button>
  );
}
