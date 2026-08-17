import type { ReactNode } from "react";
import styles from "./AppBar.module.css";

export interface AppBarProps {
  /** Page heading — rendered as the h1. A node is allowed for titles that
      are themselves a control (e.g. a thread title that opens the event). */
  title?: ReactNode;
  /** Second line under the title — a member count, a status. Kept out of
      the h1 so the accessible page name stays just the title. */
  subtitle?: ReactNode;
  /** Left slot — typically a back icon-only Button. */
  leading?: ReactNode;
  /** Right slot — actions. */
  trailing?: ReactNode;
}

/**
 * Top app bar. Sticky, one per screen; the title is the page h1.
 *
 * ```tsx
 * <AppBar
 *   title="Sessions"
 *   trailing={
 *     <Button iconOnly aria-label="Settings" variant="ghost" onClick={openSettings}>
 *       <Icon name="settings" />
 *     </Button>
 *   }
 * />
 * ```
 */
export function AppBar({ title, subtitle, leading, trailing }: AppBarProps) {
  const heading = title ? <h1 className={styles.title}>{title}</h1> : null;
  return (
    <header className={styles.bar}>
      {leading ? <div className={styles.slot}>{leading}</div> : null}
      {subtitle != null ? (
        <div className={styles.text}>
          {heading}
          <div className={styles.subtitle}>{subtitle}</div>
        </div>
      ) : (
        heading
      )}
      {trailing ? <div className={styles.slot}>{trailing}</div> : null}
    </header>
  );
}
