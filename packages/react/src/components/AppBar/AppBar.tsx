import type { ReactNode } from "react";
import styles from "./AppBar.module.css";

export interface AppBarProps {
  title?: string | undefined;
  /** Left slot — typically a back icon-only Button. */
  leading?: ReactNode;
  /** Right slot — actions. */
  trailing?: ReactNode;
}

/** Top app bar. Sticky, one per screen; the title is the page h1. */
export function AppBar({ title, leading, trailing }: AppBarProps) {
  return (
    <header className={styles.bar}>
      {leading ? <div className={styles.slot}>{leading}</div> : null}
      {title ? <h1 className={styles.title}>{title}</h1> : null}
      {trailing ? <div className={styles.slot}>{trailing}</div> : null}
    </header>
  );
}
