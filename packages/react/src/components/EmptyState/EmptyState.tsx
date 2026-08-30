import type { ReactElement, ReactNode } from "react";
import { cx } from "../../internal/cx";
import type { HeadingLevel } from "../Heading/Heading";
import { Heading } from "../Heading/Heading";
import { Text } from "../Text/Text";
import styles from "./EmptyState.module.css";

export interface EmptyStateProps {
  title: string;
  /** Outline level of the title — the caller knows where the empty state
   *  sits in the page's heading structure. Default 3. */
  level?: HeadingLevel;
  description?: string;
  /** Illustration or Icon slot. */
  icon?: ReactNode;
  /** Usually a Button. */
  action?: ReactNode;
  className?: string;
}

/**
 * Nothing-here view: explains the empty screen and offers the next step.
 *
 * ```tsx
 * <EmptyState
 *   icon={<Icon name="inbox" size="lg" />}
 *   title="No sessions yet"
 *   description="Create your first session to get started."
 *   action={<Button onClick={create}>New session</Button>}
 * />
 * ```
 */
export function EmptyState({ title, level = 3, description, icon, action, className }: EmptyStateProps): ReactElement {
  return (
    <div className={cx(styles.root, className)}>
      {icon != null && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      <Heading level={level}>{title}</Heading>
      {description !== undefined && <Text tone="secondary">{description}</Text>}
      {action != null && <span className={styles.action}>{action}</span>}
    </div>
  );
}
