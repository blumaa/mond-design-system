import type { ReactElement } from "react";
import { useId } from "react";
import { cx } from "../../internal/cx";
import styles from "./SegmentedControl.module.css";

export interface SegmentOption<T extends string = string> {
  value: T;
  label: string;
}

export interface SegmentedControlProps<T extends string = string> {
  /** Accessible group name. */
  label: string;
  options: readonly SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Disables the whole control — e.g. a choice locked while editing. */
  disabled?: boolean;
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
  className,
}: SegmentedControlProps<T>): ReactElement {
  const name = useId();
  return (
    <div role="radiogroup" aria-label={label} className={cx(styles.group, className)}>
      {options.map((option) => (
        <label key={option.value} className={styles.segment}>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={option.value === value}
            onChange={() => onChange(option.value)}
            disabled={disabled}
            className={styles.input}
          />
          <span className={styles.face}>{option.label}</span>
        </label>
      ))}
    </div>
  );
}
