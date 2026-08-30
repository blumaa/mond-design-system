import type { DragEvent, HTMLAttributes, ReactElement, ReactNode, Ref } from "react";
import { useRef, useState } from "react";
import { cx } from "../../internal/cx";
import { Text } from "../Text/Text";
import styles from "./FileDrop.module.css";

export interface FileDropProps extends Omit<HTMLAttributes<HTMLDivElement>, "onDrop"> {
  /** The invitation, in the app's words — what to hand over, and how. */
  label: string;
  /** The rule under it: the kinds taken, the size ceiling, how many fit. */
  hint?: string;
  /** Glyph above the words, from the app's icon set. */
  icon?: ReactNode;
  /** Passed to the picker, so it offers the right kinds. Same syntax as the
      input attribute: "image/*", ".pdf,.docx". */
  accept?: string;
  /** More than one at a time. A drop of several is cut to one without it —
      the picker would not have let them through either. */
  multiple?: boolean;
  disabled?: boolean;
  /** What arrived, picked or dropped. Never empty. */
  onFiles: (files: File[]) => void;
  ref?: Ref<HTMLDivElement>;
}

/**
 * A place to hand over a file: press it for the picker, or drop one on it.
 * The list of what is on its way up is UploadProgress' job.
 *
 * ```tsx
 * <FileDrop
 *   label={t.upload.drop}
 *   hint={t.upload.limit}
 *   accept="image/*"
 *   multiple
 *   onFiles={upload.add}
 * />
 * ```
 */
export function FileDrop({
  label,
  hint,
  icon,
  accept,
  multiple = false,
  disabled = false,
  onFiles,
  className,
  ref,
  ...rest
}: FileDropProps): ReactElement {
  const picker = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  const take = (list: FileList | null) => {
    if (disabled || list === null || list.length === 0) return;
    const files = [...list];
    onFiles(multiple ? files : files.slice(0, 1));
  };

  const dropped = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setOver(false);
    take(event.dataTransfer.files);
  };

  return (
    <div
      className={cx(styles.drop, over && styles.over, className)}
      ref={ref}
      onDragOver={(event) => {
        event.preventDefault();
        setOver(!disabled);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={dropped}
      {...rest}
    >
      <button
        type="button"
        className={styles.target}
        disabled={disabled}
        onClick={() => picker.current?.click()}
      >
        {/* Decoration for the words beside it — readers get the words. */}
        {icon !== undefined && (
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
        )}
        <Text variant="label">{label}</Text>
        {hint !== undefined && <Text variant="meta">{hint}</Text>}
      </button>

      {/* Off the screen rather than out of the tree: the button is the control
          a person sees, and the input is only how the browser opens a picker. */}
      <input
        type="file"
        className={styles.picker}
        ref={picker}
        tabIndex={-1}
        aria-hidden="true"
        multiple={multiple}
        {...(accept === undefined ? {} : { accept })}
        onChange={(event) => {
          take(event.target.files);
          event.target.value = "";
        }}
      />
    </div>
  );
}
