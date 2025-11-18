import React, { forwardRef } from 'react';
import './icon.css';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Icon size
   * @default 'md'
   */
  size?: IconSize;

  /**
   * SVG element to display
   */
  children: React.ReactNode;

  /**
   * Icon color
   */
  color?: string;

  /**
   * Accessible label for the icon
   */
  label?: string;

  /**
   * Whether the icon is decorative (hidden from screen readers)
   * @default false
   */
  decorative?: boolean;

  /**
   * Badge content to display (e.g., notification count)
   * Appears as a small indicator on the bottom-right corner
   */
  badge?: number | string;

  /**
   * Maximum number to display in badge before showing "99+"
   * @default 99
   */
  badgeMax?: number;
}

export const Icon = forwardRef<HTMLSpanElement, IconProps>(({
  size = 'md',
  children,
  color,
  label,
  decorative = false,
  badge,
  badgeMax = 99,
  className = '',
  ...props
}, ref) => {
  const iconClassName = `mond-icon mond-icon--${size} ${className}`.trim();
  const inlineStyle = color ? { color } : undefined;

  // Format badge content
  const getBadgeContent = () => {
    if (badge === undefined || badge === null) return null;
    if (typeof badge === 'string') return badge;
    if (typeof badge === 'number') {
      return badge > badgeMax ? `${badgeMax}+` : badge.toString();
    }
    return null;
  };

  const badgeContent = getBadgeContent();
  const hasBadge = badgeContent !== null;

  return (
    <span
      ref={ref}
      className={`${iconClassName} ${hasBadge ? 'mond-icon--with-badge' : ''}`.trim()}
      style={inlineStyle}
      role={decorative ? 'presentation' : 'img'}
      aria-label={decorative ? undefined : label}
      {...(decorative && { 'aria-hidden': true })}
      {...props}
    >
      {children}
      {hasBadge && (
        <span className="mond-icon__badge" aria-label={`${badgeContent} notifications`}>
          {badgeContent}
        </span>
      )}
    </span>
  );
});

Icon.displayName = 'Icon';