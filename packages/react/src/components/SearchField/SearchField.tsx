import type { InputHTMLAttributes, ReactElement, Ref } from "react";
import { cx } from "../../internal/cx";
import styles from "./SearchField.module.css";

export interface SearchFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "value" | "onChange"> {
  /** Accessible name. */
  label: string;
  value: string;
  /** Receives the new text — "" when cleared. */
  onChange: (value: string) => void;
  ref?: Ref<HTMLInputElement>;
}

/** Controlled search input with a clear affordance once there is text. */
export function SearchField({ label, value, onChange, className, ...rest }: SearchFieldProps): ReactElement {
  return (
    <span className={cx(styles.wrap, className)}>
      <svg viewBox="0 0 16 16" aria-hidden="true" className={styles.glass}>
        <path
          d="M7 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm7 2-3.5-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <input
        type="search"
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={styles.input}
        {...rest}
      />
      {value !== "" && (
        <button
          type="button"
          aria-label="Clear search"
          className={styles.clear}
          onClick={() => onChange("")}
        >
          <svg viewBox="0 0 16 16" aria-hidden="true" className={styles.clearGlyph}>
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </span>
  );
}
