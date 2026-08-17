import type { InputHTMLAttributes, ReactElement, Ref } from "react";
import { cx } from "../../internal/cx";
import { useFieldContext } from "../Field/Field";
import styles from "./Input.module.css";

export type InputSize = "sm" | "md" | "lg";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: InputSize;
  ref?: Ref<HTMLInputElement>;
}

/**
 * Single-line text input. Inside a Field it inherits id/description/invalid.
 *
 * ```tsx
 * <Field label="Name">
 *   <Input value={name} onChange={(e) => setName(e.target.value)} />
 * </Field>
 *
 * <Input aria-label="Amount" type="number" size="sm" />
 * ```
 */
export function Input({ size = "md", className, ...rest }: InputProps): ReactElement {
  const field = useFieldContext();
  return (
    <input
      id={rest.id ?? field?.id}
      aria-describedby={rest["aria-describedby"] ?? field?.describedBy}
      aria-invalid={rest["aria-invalid"] ?? (field?.invalid || undefined)}
      className={cx(styles.input, styles[`size-${size}`], className)}
      {...rest}
    />
  );
}
