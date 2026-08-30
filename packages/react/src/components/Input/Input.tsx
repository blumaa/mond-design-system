import type {
  ChangeEvent,
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from "react";
import { useRef, useState } from "react";
import { cx } from "../../internal/cx";
import { forkRef } from "../../internal/forkRef";
import { CloseGlyph } from "../../internal/glyphs";
import { useFieldContext } from "../Field/Field";
import styles from "./Input.module.css";

export type InputSize = "sm" | "md" | "lg";

interface InputBaseProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** The native input type, passed straight through — the system adds no types
      of its own, so `email`, `tel`, `url` and `number` behave as the platform
      defines them, keyboard and validation included. Default "text".

      One type the component answers to: with `type="search"`, `onClear` takes
      over the browser's own clear cross, so the field shows one clear
      affordance rather than two. Without `onClear` the native cross is left
      alone — there it is the only way to empty the field. */
  type?: HTMLInputTypeAttribute;
  /** Control height and type size. The icon slots, the gutter and the clear
      button all step with it. Default "md". */
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

/* The clear button and iconRight are the same slot, so only one of them may be
   asked for, and a glyph button is nothing to a screen reader without a name —
   the type collects both rules. The words are the app's: "Clear search" and
   "Clear filter" are not interchangeable. */
type ClearEnforcement =
  | {
      /** Raises a clear button in the trailing slot whenever the field holds
          text, and runs when it is pressed. An uncontrolled field is emptied
          for you; a controlled one is yours to empty here. Rules out
          iconRight — they are the same slot. */
      onClear: () => void;
      /** Names that button, e.g. "Clear search". Required: the cross says
          nothing to a screen reader, and the words are the app's — "Clear
          search" and "Clear filter" are not interchangeable. */
      clearLabel: string;
      iconRight?: undefined;
    }
  | { onClear?: undefined; clearLabel?: undefined };

export type InputProps = InputBaseProps & ClearEnforcement;

/**
 * Single-line text input. Inside a Field it inherits id/description/invalid.
 *
 * Sizes are `sm` / `md` / `lg`; the icon slots and the clear button step with
 * them. `onClear` folds in what SearchField used to be — pair it with
 * `type="search"` and it replaces the browser's own clear cross.
 *
 * ```tsx
 * <Field label="Name">
 *   <Input value={name} onChange={(e) => setName(e.target.value)} />
 * </Field>
 *
 * <Input aria-label="Search" iconLeft={<Icon name="search" />} />
 *
 * <Input
 *   type="search"
 *   aria-label="Search sessions"
 *   iconLeft={<Icon name="search" />}
 *   value={query}
 *   onChange={(e) => setQuery(e.target.value)}
 *   clearLabel="Clear search"
 *   onClear={() => setQuery("")}
 * />
 * ```
 */
export function Input({
  size = "md",
  invalid,
  iconLeft,
  iconRight,
  onClear,
  clearLabel,
  className,
  ref,
  ...rest
}: InputProps): ReactElement {
  const field = useFieldContext();
  const own = useRef<HTMLInputElement>(null);

  /* Whether there is anything to clear. A controlled field answers from its
     own value; an uncontrolled one only knows what it has been typed into, so
     the change events carry the answer. */
  const [typedInto, setTypedInto] = useState(() => String(rest.defaultValue ?? "") !== "");
  const hasText = rest.value !== undefined ? String(rest.value) !== "" : typedInto;
  const showClear = onClear != null && hasText;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (onClear != null) setTypedInto(event.target.value !== "");
    rest.onChange?.(event);
  };

  const clear = () => {
    /* An uncontrolled field holds its text in the DOM, so emptying it is a DOM
       write; a controlled one is the caller's to empty in onClear. */
    if (rest.value === undefined && own.current != null) own.current.value = "";
    setTypedInto(false);
    own.current?.focus();
    onClear?.();
  };

  const input = (
    <input
      ref={forkRef(own, ref)}
      id={rest.id ?? field?.id}
      aria-describedby={rest["aria-describedby"] ?? field?.describedBy}
      aria-invalid={rest["aria-invalid"] ?? ((invalid ?? field?.invalid) || undefined)}
      aria-required={rest["aria-required"] ?? (field?.required || undefined)}
      className={cx(
        styles.input,
        styles[`size-${size}`],
        iconLeft != null && styles["with-icon-left"],
        (iconRight != null || showClear) && styles["with-icon-right"],
        onClear != null && styles["own-clear"],
        className,
      )}
      {...rest}
      onChange={handleChange}
    />
  );

  if (iconLeft == null && iconRight == null && onClear == null) return input;

  return (
    <span className={cx(styles.iconWrap, styles[`slot-${size}`])}>
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
      {showClear && (
        <button type="button" aria-label={clearLabel} className={styles.clear} onClick={clear}>
          <CloseGlyph className={styles.clearGlyph} />
        </button>
      )}
    </span>
  );
}
