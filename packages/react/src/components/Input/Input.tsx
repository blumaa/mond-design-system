import type { InputHTMLAttributes, ReactElement, ReactNode, Ref } from "react";
import { cx } from "../../internal/cx";
import { useFieldContext } from "../Field/Field";
import styles from "./Input.module.css";

export type InputSize = "sm" | "md" | "lg";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: InputSize;
  /** Marks the value as failing validation — sets aria-invalid and the danger
      border. Inside a Field the field's error state does this already. */
  invalid?: boolean;
  /** Decorative icon inside the leading edge. Icons carry no name here —
      the input's label does the talking. */
  iconLeft?: ReactNode;
  /** Decorative icon inside the trailing edge. */
  iconRight?: ReactNode;
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
 * <Input aria-label="Search" iconLeft={<Icon name="search" />} />
 * ```
 */
export function Input({
  size = "md",
  invalid,
  iconLeft,
  iconRight,
  className,
  ...rest
}: InputProps): ReactElement {
  const field = useFieldContext();
  const input = (
    <input
      id={rest.id ?? field?.id}
      aria-describedby={rest["aria-describedby"] ?? field?.describedBy}
      aria-invalid={rest["aria-invalid"] ?? ((invalid ?? field?.invalid) || undefined)}
      className={cx(
        styles.input,
        styles[`size-${size}`],
        iconLeft != null && styles["with-icon-left"],
        iconRight != null && styles["with-icon-right"],
        className,
      )}
      {...rest}
    />
  );

  if (iconLeft == null && iconRight == null) return input;

  return (
    <span className={styles.iconWrap}>
      {input}
      {iconLeft != null && (
        <span className={cx(styles.icon, styles.iconLeft)} aria-hidden="true">
          {iconLeft}
        </span>
      )}
      {iconRight != null && (
        <span className={cx(styles.icon, styles.iconRight)} aria-hidden="true">
          {iconRight}
        </span>
      )}
    </span>
  );
}
