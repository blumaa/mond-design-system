import { useState } from "react";
import type { ChangeEvent, ReactElement, Ref, TextareaHTMLAttributes } from "react";
import { cx } from "../../internal/cx";
import { useFieldContext } from "../Field/Field";
import styles from "./Textarea.module.css";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Character counter under the control; pairs with native maxLength. */
  showCount?: boolean;
  ref?: Ref<HTMLTextAreaElement>;
}

/** Multi-line text input. Inside a Field it inherits id/description/invalid. */
export function Textarea({ rows = 3, showCount = false, className, ...rest }: TextareaProps): ReactElement {
  const field = useFieldContext();
  const [tracked, setTracked] = useState(() => String(rest.defaultValue ?? ""));
  const current = rest.value !== undefined ? String(rest.value) : tracked;

  const onChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setTracked(event.target.value);
    rest.onChange?.(event);
  };

  const textarea = (
    <textarea
      id={rest.id ?? field?.id}
      aria-describedby={rest["aria-describedby"] ?? field?.describedBy}
      aria-invalid={rest["aria-invalid"] ?? (field?.invalid || undefined)}
      rows={rows}
      className={cx(styles.textarea, className)}
      {...rest}
      {...(showCount ? { onChange } : {})}
    />
  );

  if (!showCount) return textarea;
  return (
    <span className={styles.wrap}>
      {textarea}
      <span className={styles.count} aria-hidden="true">
        {rest.maxLength !== undefined ? `${current.length}/${rest.maxLength}` : current.length}
      </span>
    </span>
  );
}
