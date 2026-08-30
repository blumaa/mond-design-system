import type { InputHTMLAttributes, ReactElement, Ref } from "react";
import { cx } from "../../internal/cx";
import styles from "./Radio.module.css";

export type RadioSize = "sm" | "md" | "lg";

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  /** Inline label — part of the click target. */
  label: string;
  /** Control step. Default md. The 44px target holds at every step. */
  size?: RadioSize;
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
export function Radio({ label, size = "md", className, ...rest }: RadioProps): ReactElement {
  return (
    <label className={cx(styles.root, styles[`size-${size}`], className)}>
      <input type="radio" className={styles.dot} {...rest} />
      <span className={styles.label}>{label}</span>
    </label>
  );
}
