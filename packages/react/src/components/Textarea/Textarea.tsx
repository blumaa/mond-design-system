import type { ReactElement, Ref, TextareaHTMLAttributes } from "react";
import { cx } from "../../internal/cx";
import { useFieldContext } from "../Field/Field";
import styles from "./Textarea.module.css";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  ref?: Ref<HTMLTextAreaElement>;
}

/** Multi-line text input. Inside a Field it inherits id/description/invalid. */
export function Textarea({ rows = 3, className, ...rest }: TextareaProps): ReactElement {
  const field = useFieldContext();
  return (
    <textarea
      id={rest.id ?? field?.id}
      aria-describedby={rest["aria-describedby"] ?? field?.describedBy}
      aria-invalid={rest["aria-invalid"] ?? (field?.invalid || undefined)}
      rows={rows}
      className={cx(styles.textarea, className)}
      {...rest}
    />
  );
}
