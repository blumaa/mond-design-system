import type { InputHTMLAttributes, ReactElement, ReactNode, Ref } from "react";
import { useEffect, useRef } from "react";
import { cx } from "../../internal/cx";
import { forkRef } from "../../internal/forkRef";
import { VisuallyHidden } from "../VisuallyHidden/VisuallyHidden";
import styles from "./Checkbox.module.css";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  /** Inline label — part of the click target. Rich content welcome (an
      inline link, a Text run); the label element names the box either way. */
  label: ReactNode;
  /** Keep the name for readers and take it off the screen. A box in a table's
      select column has no room for the word and the column header says it
      anyway, but a reader who cannot see which row they are in still needs
      to be told. Naming it is not optional; showing it is. */
  labelHidden?: boolean;
  /** Neither checked nor unchecked: the third thing a box governing a set of
      others has to say. Only the DOM property carries it — there is no
      attribute — so a caller cannot set it without this. */
  indeterminate?: boolean;
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
export function Checkbox({
  label,
  labelHidden = false,
  indeterminate = false,
  className,
  ref,
  ...rest
}: CheckboxProps): ReactElement {
  const own = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (own.current !== null) own.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <label className={cx(styles.root, labelHidden && styles.bare, className)}>
      <input
        type="checkbox"
        className={styles.box}
        ref={forkRef(own, ref)}
        {...rest}
      />
      {labelHidden ? (
        <VisuallyHidden className={styles.label}>{label}</VisuallyHidden>
      ) : (
        <span className={styles.label}>{label}</span>
      )}
    </label>
  );
}
