import type { ReactElement, ReactNode } from "react";
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { cx } from "../../internal/cx";
import styles from "./Toast.module.css";

export type ToastTone = "neutral" | "success" | "danger";

export interface ToastOptions {
  title: string;
  description?: string | undefined;
  tone?: ToastTone | undefined;
  /** ms until auto-dismiss. 0 = stays until dismissed. Default 5000. */
  duration?: number | undefined;
}

interface ToastEntry extends Required<Pick<ToastOptions, "title" | "tone">> {
  id: number;
  description: string | undefined;
}

interface ToastContextValue {
  toast: (options: ToastOptions) => number;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (context === null) throw new Error("useToast needs a <ToastProvider> above it");
  return context;
}

export interface ToastProviderProps {
  children: ReactNode;
  /** Accessible name of the notification region, e.g. "Notifications".
      Required: it is read aloud, in the app's language. */
  regionLabel: string;
  /** Prefix of each dismiss button's accessible name. The toast's title follows
   *  it, so every dismiss control names its own toast: "Dismiss: Saved". */
  dismissLabel: string;
}

/**
 * Mount once near the root. Renders the notification region itself.
 *
 * ```tsx
 * // App root
 * <ToastProvider regionLabel="Notifications" dismissLabel="Dismiss">
 *   <App />
 * </ToastProvider>
 *
 * // Anywhere below
 * const { toast } = useToast();
 * toast({ title: "Saved", tone: "success" });
 * ```
 */
export function ToastProvider({
  children,
  regionLabel,
  dismissLabel,
}: ToastProviderProps): ReactElement {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((entry) => entry.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, description, tone = "neutral", duration = 5000 }: ToastOptions) => {
      const id = nextId.current++;
      setToasts((current) => [...current, { id, title, description, tone }]);
      if (duration > 0) setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div role="region" aria-label={regionLabel} className={styles.viewport}>
        {toasts.map((entry) => (
          <div key={entry.id} role="status" className={cx(styles.toast, styles[`tone-${entry.tone}`])}>
            <span className={styles.body}>
              <span className={styles.title}>{entry.title}</span>
              {entry.description !== undefined && (
                <span className={styles.description}>{entry.description}</span>
              )}
            </span>
            <button
              type="button"
              aria-label={`${dismissLabel}: ${entry.title}`}
              className={styles.close}
              onClick={() => dismiss(entry.id)}
            >
              <svg viewBox="0 0 16 16" aria-hidden="true" className={styles.closeGlyph}>
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
