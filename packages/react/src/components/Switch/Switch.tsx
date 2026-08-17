import type { InputHTMLAttributes, ReactElement, Ref } from "react";
import { cx } from "../../internal/cx";
import { Spinner } from "../Spinner/Spinner";
import styles from "./Switch.module.css";

interface SwitchBaseProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  /** Busy blocks toggling for the same reason disabled does — a second tap
      would queue a write against a value the first one is still deciding. */
  loading?: boolean;
  ref?: Ref<HTMLInputElement>;
}

/* A switch with no words beside it still needs a name — a row whose title
   already labels it, a column under one header. The type demands it. */
type SwitchLabelEnforcement =
  | { /** Inline label — part of the click target. */ label: string }
  | { label?: undefined; "aria-label": string };

export type SwitchProps = SwitchBaseProps & SwitchLabelEnforcement;

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
 * <Switch aria-label="Email on new posts" checked={on} loading={saving} onChange={toggle} />
 * ```
 */
export function Switch({
  label,
  loading = false,
  disabled = false,
  className,
  ...rest
}: SwitchProps): ReactElement {
  return (
    <label className={cx(styles.root, className)}>
      <span className={styles.trackWrap}>
        <input
          type="checkbox"
          role="switch"
          className={styles.track}
          disabled={disabled || loading}
          aria-busy={loading || undefined}
          {...rest}
        />
        {/* Purely visual — aria-busy on the input carries the state. */}
        {loading && (
          <Spinner size={12} label="" aria-hidden="true" className={styles.spinner} />
        )}
      </span>
      {label !== undefined && <span className={styles.label}>{label}</span>}
    </label>
  );
}
