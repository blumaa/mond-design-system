import type { ReactElement, ReactNode } from "react";
import { cx } from "../../internal/cx";
import { Heading } from "../Heading/Heading";
import { Text } from "../Text/Text";
import styles from "./EmptyState.module.css";

export interface EmptyStateProps {
  title: string;
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
export function EmptyState({ title, description, icon, action, className }: EmptyStateProps): ReactElement {
  return (
    <div className={cx(styles.root, className)}>
      {icon != null && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      <Heading level={3}>{title}</Heading>
      {description !== undefined && <Text tone="secondary">{description}</Text>}
      {action != null && <span className={styles.action}>{action}</span>}
    </div>
  );
}
