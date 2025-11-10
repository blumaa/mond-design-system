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
}

export const Icon = forwardRef<HTMLSpanElement, IconProps>(({
  size = 'md',
  children,
  color,
  label,
  decorative = false,
  className = '',
  ...props
}, ref) => {
  const iconClassName = `mond-icon mond-icon--${size} ${className}`.trim();
  const inlineStyle = color ? { color } : undefined;

  return (
    <span
      ref={ref}
      className={iconClassName}
      style={inlineStyle}
      role={decorative ? 'presentation' : 'img'}
      aria-label={decorative ? undefined : label}
      {...(decorative && { 'aria-hidden': true })}
      {...props}
    >
      {children}
    </span>
  );
});

Icon.displayName = 'Icon';