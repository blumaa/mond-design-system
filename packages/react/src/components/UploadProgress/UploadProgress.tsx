import type { HTMLAttributes, ReactElement, ReactNode, Ref } from "react";
import { cx } from "../../internal/cx";
import { CloseGlyph } from "../../internal/glyphs";
import { Button } from "../Button/Button";
import { ProgressBar } from "../ProgressBar/ProgressBar";
import { Text } from "../Text/Text";
import styles from "./UploadProgress.module.css";

export type UploadStatus = "uploading" | "processing" | "done" | "error";

export interface UploadProgressLabels {
  /** Names the bar while bytes are moving, and the state after. */
  uploading: string;
  processing: string;
  done: string;
  /** Shown when the caller has no more specific `error` to give. */
  error: string;
  cancel: string;
  retry: string;
  remove: string;
}

export interface UploadProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** The file, as the person who picked it would name it. */
  name: string;
  labels: UploadProgressLabels;
  /** Thumbnail of what is going up — an `<img>`, a `<video>`, anything. */
  preview?: ReactNode;
  /** Glyph for the state it ended in, from the app's icon set. Tinted by the
      status: the system says which state, the app says with what glyph. */
  mark?: ReactNode;
  /** 0–100. Ignored while processing, which reports no percentage. */
  value?: number;
  status?: UploadStatus;
  /** The progress in words — "2.1 MB of 5 MB". Read out instead of the
      percentage, and shown under the bar. */
  detail?: string;
  /** Why it failed. Falls back to `labels.error`. */
  error?: string;
  onCancel?: () => void;
  onRetry?: () => void;
  onRemove?: () => void;
  ref?: Ref<HTMLDivElement>;
}

/**
 * One file on its way up: what it is, how far it has got, and the way out.
 *
 * ```tsx
 * <UploadProgress
 *   name={file.name}
 *   status={upload.status}
 *   value={upload.percent}
 *   detail={`${sent} of ${total}`}
 *   onCancel={upload.abort}
 *   labels={t.upload}
 * />
 * ```
 */
export function UploadProgress({
  name,
  labels,
  preview,
  mark,
  value,
  status = "uploading",
  detail,
  error,
  onCancel,
  onRetry,
  onRemove,
  className,
  ...rest
}: UploadProgressProps): ReactElement {
  const running = status === "uploading" || status === "processing";

  return (
    <div className={cx(styles.upload, styles[`status-${status}`], className)} {...rest}>
      <div className={styles.head}>
        {preview !== undefined && <div className={styles.preview}>{preview}</div>}
        {/* The status is announced in words; the mark is its decoration. */}
        {mark !== undefined && (
          <span className={styles.mark} aria-hidden="true">
            {mark}
          </span>
        )}
        <Text variant="label" truncate className={styles.name}>
          {name}
        </Text>
        {running && onCancel !== undefined && (
          <Button iconOnly size="sm" variant="ghost" aria-label={labels.cancel} onClick={onCancel}>
            <CloseGlyph />
          </Button>
        )}
        {!running && onRemove !== undefined && (
          <Button iconOnly size="sm" variant="ghost" aria-label={labels.remove} onClick={onRemove}>
            <CloseGlyph />
          </Button>
        )}
        {status === "error" && onRetry !== undefined && (
          <Button size="sm" variant="secondary" onClick={onRetry}>
            {labels.retry}
          </Button>
        )}
      </div>

      {running && (
        <ProgressBar
          label={`${labels[status]} ${name}`}
          value={value ?? 0}
          indeterminate={status === "processing"}
          {...(detail === undefined ? {} : { valueText: detail })}
        />
      )}

      <div className={styles.foot}>
        {status === "error" ? (
          <Text variant="meta" tone="danger" role="alert">
            {error ?? labels.error}
          </Text>
        ) : (
          <>
            {/* Mounted empty from the start: a live region only reads out changes
                that happen inside it, so it must be there before the news is.
                The detail stays outside — it ticks with every progress event. */}
            <Text variant="meta" role="status">
              {status === "uploading" ? null : labels[status]}
            </Text>
            {detail !== undefined && <Text variant="meta">{detail}</Text>}
          </>
        )}
      </div>
    </div>
  );
}
