import type { InputHTMLAttributes, ReactElement, Ref } from "react";
import { cx } from "../../internal/cx";
import styles from "./Radio.module.css";

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  /** Inline label — part of the click target. */
  label: string;
  ref?: Ref<HTMLInputElement>;
}

/**
 * Native radio, styled dot. Group by `name`; wrap the group in
 * `<fieldset>`/`<legend>` for a group label.
 *
 * ```tsx
 * <fieldset>
 *   <legend>Plan</legend>
 *   <Radio name="plan" label="Free" checked={plan === "free"} onChange={() => setPlan("free")} />
 *   <Radio name="plan" label="Pro" checked={plan === "pro"} onChange={() => setPlan("pro")} />
 * </fieldset>
 * ```
 */
export function Radio({ label, className, ...rest }: RadioProps): ReactElement {
  return (
    <label className={cx(styles.root, className)}>
      <input type="radio" className={styles.dot} {...rest} />
      <span className={styles.label}>{label}</span>
    </label>
  );
}
