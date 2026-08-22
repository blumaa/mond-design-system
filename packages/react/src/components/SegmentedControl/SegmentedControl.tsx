import type { ReactElement } from "react";
import { useId } from "react";
import { cx } from "../../internal/cx";
import styles from "./SegmentedControl.module.css";

export interface SegmentOption<T extends string = string> {
  value: T;
  label: string;
}

export type SegmentedControlSize = "sm" | "md";

export interface SegmentedControlProps<T extends string = string> {
  /** Accessible group name. */
  label: string;
  options: readonly SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Disables the whole control — e.g. a choice locked while editing. */
  disabled?: boolean;
  /** Stretch across the container, segments sharing the width equally —
      the usual shape when the control heads a screen-wide view switch. */
  fullWidth?: boolean;
  /** Control step. Default md. sm is for chrome — a switch sharing a header
      bar with an avatar and a menu, where the medium step is the tallest
      thing up there. */
  size?: SegmentedControlSize;
  /** Report the segment already chosen being picked again. Off by default:
      a radio only fires when its checked state changes, and for most choices
      that is the whole story. Turn it on where confirming the value on screen
      is itself an act — pinning a language that until now was inferred from
      the browser, so it stops following it. */
  repick?: boolean;
  /** Drop the frame: no tray, no padding around the segments. The tray is
      what makes the group read as a form field, and in a header bar a field
      is what it is not. The chosen segment still carries its own surface. */
  bare?: boolean;
  className?: string;
}

/**
 * Exclusive choice among few visible options. Native radios under the hood —
 * free keyboard model and semantics.
 *
 * ```tsx
 * <SegmentedControl
 *   label="View"
 *   options={[
 *     { value: "list", label: "List" },
 *     { value: "grid", label: "Grid" },
 *   ]}
 *   value={view}
 *   onChange={setView}
 * />
 * ```
 */
export function SegmentedControl<T extends string = string>({
  label,
  options,
  value,
  onChange,
  disabled = false,
  fullWidth = false,
  size = "md",
  bare = false,
  repick = false,
  className,
}: SegmentedControlProps<T>): ReactElement {
  const name = useId();
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cx(
        styles.group,
        styles[`size-${size}`],
        fullWidth && styles.fullWidth,
        bare && styles.bare,
        className,
      )}
    >
      {options.map((option) => (
        <label key={option.value} className={styles.segment}>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={option.value === value}
            onChange={() => onChange(option.value)}
            /* Only for the segment already chosen: for any other, the click
               is followed by a change event and this would say it twice. */
            onClick={
              repick && option.value === value ? () => onChange(option.value) : undefined
            }
            disabled={disabled}
            className={styles.input}
          />
          <span className={styles.face}>{option.label}</span>
        </label>
      ))}
    </div>
  );
}
