import React from 'react';
import './badge.css';

export type BadgeVariant = 'default' | 'primary' | 'outline' | 'success' | 'warning' | 'error';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'size'> {
  'data-testid'?: string;
  /**
   * Badge variant
   * @default 'default'
   */
  variant?: BadgeVariant;

  /**
   * Badge size
   * @default 'md'
   */
  size?: BadgeSize;

  /**
   * Badge content
   */
  children: React.ReactNode;
}

/**
 * Badge Component
 *
 * A small status indicator or label that uses CSS variables for theming.
 * Supports multiple variants and sizes.
 *
 * **SSR-Compatible**: Uses CSS classes and CSS variables instead of runtime theme resolution.
 * **Theme-Aware**: Automatically responds to data-theme attribute changes via CSS.
 *
 * @example
 * // Primary badge
 * <Badge variant="primary">New</Badge>
 *
 * @example
 * // Success badge with custom size
 * <Badge variant="success" size="lg">Verified</Badge>
 *
 * @example
 * // Badge with number
 * <Badge variant="error" size="sm">99+</Badge>
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'default',
      size = 'md',
      className,
      children,
      'data-testid': dataTestId,
      ...props
    },
    ref,
  ) => {
    // Build CSS class names
    const classNames = [
      'mond-badge',
      `mond-badge--${variant}`,
      `mond-badge--${size}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <span
        ref={ref}
        className={classNames}
        data-testid={dataTestId}
        data-variant={variant}
        data-size={size}
        {...props}
      >
        {children}
      </span>
    );
  },
);

Badge.displayName = 'Badge';

export default Badge;
