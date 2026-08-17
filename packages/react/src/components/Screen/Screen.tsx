import type { HTMLAttributes, ReactNode, Ref } from "react";
import { cx } from "../../internal/cx";
import styles from "./Screen.module.css";

/**
 * Page scaffold. Compose:
 *
 * ```tsx
 * <Screen>
 *   <AppBar title="Sessions" />
 *   <ScreenContent>…</ScreenContent>
 *   <TabBar label="Primary">…</TabBar>
 * </Screen>
 * ```
 *
 * Fills the height its host gives it — the app root, a device frame, a
 * `flex: 1; min-height: 0` slot — rather than claiming the viewport itself:
 * on iOS the software keyboard shrinks the visual viewport without shrinking
 * 100dvh, so only the host can know the real height. A standalone app gives
 * the root chain `height: 100%`.
 */
export function Screen({ children }: { children: ReactNode }) {
  return <div className={styles.screen}>{children}</div>;
}

export interface ScreenContentProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  /** Drop the page gutter — full-bleed lists whose rows carry their own
      padding. Default keeps it: forms and prose want the margin. */
  flush?: boolean;
  /** The scrolling element. A screen that drives the scroll — restores an
      offset on back, pins a thread to the bottom — has no other way to reach
      it. Read it; restyling it is the sheet's job. */
  ref?: Ref<HTMLElement>;
}

/** The scrollable main region of a Screen. */
export function ScreenContent({ children, flush = false, className, ref, ...rest }: ScreenContentProps) {
  return (
    <main ref={ref} className={cx(styles.content, flush && styles.flush, className)} {...rest}>
      {children}
    </main>
  );
}
