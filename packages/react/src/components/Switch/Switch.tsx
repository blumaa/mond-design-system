import type { InputHTMLAttributes, ReactElement, Ref } from "react";
import { cx } from "../../internal/cx";
import styles from "./Switch.module.css";

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  /** Inline label — part of the click target. */
  label: string;
  ref?: Ref<HTMLInputElement>;
}

/**
 * On/off toggle. Checkbox under the hood with role="switch" — native
 * semantics and forms integration, switch announcement.
 *
 * ```tsx
 * <Switch
 *   label="Notifications"
 *   checked={enabled}
 *   onChange={(e) => setEnabled(e.target.checked)}
 * />
 * ```
 */
export function Switch({ label, className, ...rest }: SwitchProps): ReactElement {
  return (
    <label className={cx(styles.root, className)}>
      <input type="checkbox" role="switch" className={styles.track} {...rest} />
      <span className={styles.label}>{label}</span>
    </label>
  );
}
