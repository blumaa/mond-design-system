import type { ReactElement, ReactNode } from "react";
import { createContext, useContext, useId } from "react";
import { cx } from "../../internal/cx";
import styles from "./Field.module.css";

export interface FieldContextValue {
  /** Control id — the label points here. */
  id: string;
  /** Space-joined ids of hint/error, for aria-describedby. */
  describedBy: string | undefined;
  invalid: boolean;
  /** The label's asterisk is aria-hidden decoration; controls carry the
   *  requirement as aria-required so assistive tech hears it too. */
  required: boolean;
}

const FieldContext = createContext<FieldContextValue | null>(null);

/** Controls call this to pick up Field wiring. Null outside a Field. */
export function useFieldContext(): FieldContextValue | null {
  return useContext(FieldContext);
}

export interface FieldProps {
  label: string;
  children: ReactNode;
  /** Guidance under the control. */
  hint?: string;
  /** Validation message; replaces the hint and flags the control invalid. */
  error?: string;
  required?: boolean;
  className?: string;
}

/**
 * Label + control + hint/error, wired for assistive tech. The control inside
 * (Input, Textarea, Select, …) picks up id, aria-describedby and aria-invalid
 * from context — no manual plumbing at call sites.
 *
 * ```tsx
 * <Field label="Email" hint="Work email preferred" error={errors.email} required>
 *   <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
 * </Field>
 * ```
 */
export function Field({ label, children, hint, error, required = false, className }: FieldProps): ReactElement {
  const id = useId();
  const messageId = `${id}-message`;
  const message = error ?? hint;

  return (
    <div className={cx(styles.field, className)}>
      <label className={styles.label} htmlFor={id}>
        {label}
        {required && (
          <span className={styles.required} aria-hidden="true">
            *
          </span>
        )}
      </label>
      <FieldContext.Provider
        value={{ id, describedBy: message ? messageId : undefined, invalid: error !== undefined, required }}
      >
        {children}
      </FieldContext.Provider>
      {message && (
        <span
          id={messageId}
          role={error !== undefined ? "alert" : undefined}
          className={cx(styles.message, error !== undefined && styles.error)}
        >
          {message}
        </span>
      )}
    </div>
  );
}
