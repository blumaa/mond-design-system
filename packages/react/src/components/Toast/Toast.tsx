import type { ReactElement, ReactNode } from "react";
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { cx } from "../../internal/cx";
import { CloseGlyph } from "../../internal/glyphs";
import styles from "./Toast.module.css";

export type ToastTone = "neutral" | "success" | "danger";

export interface ToastAction {
  /** The word on the button — localise. */
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  title: string;
  description?: string | undefined;
  tone?: ToastTone | undefined;
  /** ms until auto-dismiss. 0 = stays until dismissed. Default 5000. */
  duration?: number | undefined;
  /** One thing to do about the message, beside it. A toast that asks for
      something — "Update ready", "Add to home screen" — has nowhere else to
      put the doing. Taking it closes the toast: the message is answered. */
  action?: ToastAction | undefined;
  /** Fires however the toast leaves — timeout, dismiss button, or action.
      A nudge that must remember a refusal has one place to write it down,
      rather than three that can disagree. */
  onDismiss?: (() => void) | undefined;
}

interface ToastEntry extends Required<Pick<ToastOptions, "title" | "tone">> {
  id: number;
  description: string | undefined;
  action: ToastAction | undefined;
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
  /* Held outside the entry so that a toast already gone cannot fire its
     callback a second time when its timeout comes round: the way out that
     got there first takes the callback with it. */
  const leaving = useRef(new Map<number, () => void>());
  /* WCAG 2.2.1: the clocks stop while the reader is engaging with the region
     — pointer over it or focus inside it — and run on with the time they had
     left. Each open clock remembers when it started so pausing can bank the
     remainder. */
  const clocks = useRef(
    new Map<number, { handle: ReturnType<typeof setTimeout>; startedAt: number; remaining: number }>(),
  );
  const held = useRef(0);
  /* The toast elements by id, so a dismissal can tell whether it is taking
     the focused element with it. */
  const surfaces = useRef(new Map<number, HTMLDivElement>());

  const dismiss = useCallback((id: number) => {
    const clock = clocks.current.get(id);
    if (clock !== undefined) {
      clearTimeout(clock.handle);
      clocks.current.delete(id);
    }
    /* Taking the focused toast away would drop focus on <body> and send the
       next Tab back to the top of the page; its neighbour inherits it. The
       last toast has no neighbour, and nothing here knows where the reader
       was before, so that one is left to the browser. */
    const surface = surfaces.current.get(id);
    if (surface?.contains(document.activeElement)) {
      const neighbour = surface.nextElementSibling ?? surface.previousElementSibling;
      neighbour?.querySelector<HTMLButtonElement>("button:last-child")?.focus();
    }
    setToasts((current) => current.filter((entry) => entry.id !== id));
    const said = leaving.current.get(id);
    if (said !== undefined) {
      leaving.current.delete(id);
      said();
    }
  }, []);

  const start = useCallback(
    (id: number, remaining: number) => {
      clocks.current.set(id, {
        handle: setTimeout(() => dismiss(id), remaining),
        startedAt: Date.now(),
        remaining,
      });
    },
    [dismiss],
  );

  /* Hold/release rather than a boolean: focus moving between two buttons in
     the region fires a release and a hold back to back, and the pointer can
     be over the region while focus is inside it. */
  const hold = useCallback(() => {
    if (held.current++ > 0) return;
    for (const clock of clocks.current.values()) {
      clearTimeout(clock.handle);
      clock.remaining -= Date.now() - clock.startedAt;
    }
  }, []);

  const release = useCallback(() => {
    if (--held.current > 0) return;
    held.current = 0;
    for (const [id, clock] of clocks.current) {
      start(id, Math.max(clock.remaining, 0));
    }
  }, [start]);

  const toast = useCallback(
    ({ title, description, tone = "neutral", duration = 5000, action, onDismiss }: ToastOptions) => {
      const id = nextId.current++;
      if (onDismiss !== undefined) leaving.current.set(id, onDismiss);
      setToasts((current) => [...current, { id, title, description, tone, action }]);
      if (duration > 0) {
        start(id, duration);
        // Born into a held region: its clock waits for the release too.
        if (held.current > 0) clearTimeout(clocks.current.get(id)?.handle);
      }
      return id;
    },
    [start],
  );

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        role="region"
        aria-label={regionLabel}
        className={styles.viewport}
        onPointerEnter={hold}
        onPointerLeave={release}
        onFocus={hold}
        onBlur={release}
      >
        {toasts.map((entry) => (
          <div
            key={entry.id}
            ref={(node) => {
              if (node !== null) surfaces.current.set(entry.id, node);
              else surfaces.current.delete(entry.id);
            }}
            /* A refusal interrupts: what the reader asked for did not happen,
               and they are about to carry on as though it did. Anything
               calmer waits its turn. */
            role={entry.tone === "danger" ? "alert" : "status"}
            className={cx(styles.toast, styles[`tone-${entry.tone}`])}
          >
            <span className={styles.body}>
              <span className={styles.title}>{entry.title}</span>
              {entry.description !== undefined && (
                <span className={styles.description}>{entry.description}</span>
              )}
            </span>
            {entry.action !== undefined && (
              <button
                type="button"
                className={styles.action}
                onClick={() => {
                  entry.action?.onClick();
                  dismiss(entry.id);
                }}
              >
                {entry.action.label}
              </button>
            )}
            <button
              type="button"
              aria-label={`${dismissLabel}: ${entry.title}`}
              className={styles.close}
              onClick={() => dismiss(entry.id)}
            >
              <CloseGlyph className={styles.closeGlyph} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
