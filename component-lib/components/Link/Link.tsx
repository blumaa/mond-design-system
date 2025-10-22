'use client';
import React from 'react';

export type LinkSize = 'small' | 'medium' | 'large';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * Link size
   * @default 'medium'
   */
  size?: LinkSize;

  /**
   * Icon-only link (no text content)
   * @default false
   */
  iconOnly?: boolean;

  /**
   * Icon element to display
   */
  icon?: React.ReactNode;

  /**
   * Link content
   */
  children?: React.ReactNode;

  /**
   * Link href
   */
  href: string;

  /**
   * Custom link component for framework-specific routing
   * @default 'a'
   */
  as?: React.ElementType;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({
    as: Component = 'a',
    size = 'medium',
    iconOnly = false,
    icon,
    children,
    href,
    style = {},
    className = '',
    ...props
  }, ref) => {
    // Build class names
    const classNames = [
      'mond-link',
      `mond-link--${size}`,
      iconOnly && 'mond-link--icon-only',
      className,
    ].filter(Boolean).join(' ');

    return (
      <Component
        ref={ref}
        href={href}
        style={style}
        className={classNames}
        data-mond-link
        {...props}
      >
        {icon && icon}
        {!iconOnly && children}
      </Component>
    );
  }
);

Link.displayName = 'Link';

export default Link;
