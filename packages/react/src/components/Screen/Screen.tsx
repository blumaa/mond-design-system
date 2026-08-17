import type { ReactNode } from "react";
import styles from "./Screen.module.css";

/**
 * Page scaffold. Compose:
 *
 *   <Screen>
 *     <AppBar title="Sessions" />
 *     <ScreenContent>…</ScreenContent>
 *     <TabBar label="Primary">…</TabBar>
 *   </Screen>
 */
export function Screen({ children }: { children: ReactNode }) {
  return <div className={styles.screen}>{children}</div>;
}

/** The scrollable main region of a Screen. */
export function ScreenContent({ children }: { children: ReactNode }) {
  return <main className={styles.content}>{children}</main>;
}
