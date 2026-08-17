import type { InputHTMLAttributes, ReactElement, ReactNode, Ref } from "react";
import { cx } from "../../internal/cx";
import styles from "./Checkbox.module.css";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  /** Inline label — part of the click target. Rich content welcome (an
      inline link, a Text run); the label element names the box either way. */
  label: ReactNode;
  ref?: Ref<HTMLInputElement>;
}

/**
 * Native checkbox, styled box. Label is the touch target too.
 *
 * ```tsx
 * <Checkbox label="Remember me" defaultChecked />
 * <Checkbox
 *   label="Accept terms"
 *   checked={accepted}
 *   onChange={(e) => setAccepted(e.target.checked)}
 * />
 * ```
 */
export function Checkbox({ label, className, ...rest }: CheckboxProps): ReactElement {
  return (
    <label className={cx(styles.root, className)}>
      <input type="checkbox" className={styles.box} {...rest} />
      <span className={styles.label}>{label}</span>
    </label>
  );
}
