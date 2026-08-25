import { useState } from "react";
import type { ReactElement } from "react";
import { cx } from "../../internal/cx";
import { Input } from "../Input/Input";
import type { InputProps } from "../Input/Input";
import styles from "./PasswordInput.module.css";

/* The reveal toggle is this field's trailing slot, so nothing else may claim
   it — and Omit collapses Input's either/or branch anyway, which would leave
   the clear button's two halves separable. Both reasons drop the same keys. */
export interface PasswordInputProps
  extends Omit<InputProps, "type" | "onClear" | "clearLabel" | "iconRight"> {
  /** Names the reveal button while the password is hidden, e.g. "Show password".
      Required: the button carries no visible text, so this is the only thing a
      screen reader has, and it is the app's language rather than the system's. */
  showLabel: string;
  /** Names the same button while the password is visible, e.g. "Hide password". */
  hideLabel: string;
}

/**
 * Password field with a reveal toggle. Composes Input, so inside a Field it
 * inherits id/description/invalid the same way.
 *
 * ```tsx
 * <Field label="Password" hint="At least 12 characters">
 *   <PasswordInput showLabel="Show password" hideLabel="Hide password" autoComplete="new-password" />
 * </Field>
 * ```
 */
export function PasswordInput({
  showLabel,
  hideLabel,
  className,
  ...rest
}: PasswordInputProps): ReactElement {
  const [visible, setVisible] = useState(false);
  return (
    <span className={styles.wrap}>
      <Input {...rest} type={visible ? "text" : "password"} className={cx(styles.input, className)} />
      <button
        type="button"
        className={styles.toggle}
        aria-label={visible ? hideLabel : showLabel}
        aria-pressed={visible}
        onClick={() => setVisible((v) => !v)}
      >
        {visible ? (
          /* eye-off */
          <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
            <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        ) : (
          /* eye */
          <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
    </span>
  );
}
