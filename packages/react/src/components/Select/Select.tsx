import type { ReactElement, Ref, SelectHTMLAttributes } from "react";
import { cx } from "../../internal/cx";
import { useFieldContext } from "../Field/Field";
import styles from "./Select.module.css";

export type SelectSize = "sm" | "md" | "lg";

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  size?: SelectSize;
  ref?: Ref<HTMLSelectElement>;
}

/**
 * Native select, styled. Native = free keyboard, mobile pickers, screen
 * reader behavior; a custom popover earns its complexity only when options
 * need rich content.
 *
 * ```tsx
 * <Field label="Language">
 *   <Select value={lang} onChange={(e) => setLang(e.target.value)}>
 *     <option value="de">Deutsch</option>
 *     <option value="en">English</option>
 *   </Select>
 * </Field>
 * ```
 */
export function Select({ size = "md", className, children, ...rest }: SelectProps): ReactElement {
  const field = useFieldContext();
  return (
    <span className={styles.wrap}>
      <select
        id={rest.id ?? field?.id}
        aria-describedby={rest["aria-describedby"] ?? field?.describedBy}
        aria-invalid={rest["aria-invalid"] ?? (field?.invalid || undefined)}
        className={cx(styles.select, styles[`size-${size}`], className)}
        {...rest}
      >
        {children}
      </select>
      <svg viewBox="0 0 16 16" aria-hidden="true" className={styles.chevron}>
        <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
