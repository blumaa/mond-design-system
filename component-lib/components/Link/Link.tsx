import React, { forwardRef } from 'react';
import './link.css';

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

/**
 * Link Component
 *
 * A flexible link component that supports multiple sizes and icon combinations.
 * Uses CSS variables for theming.
 *
 * **SSR-Compatible**: Uses CSS classes and CSS variables instead of runtime theme resolution.
 * **Theme-Aware**: Automatically responds to data-theme attribute changes via CSS.
 *
 * @example
 * // Basic link
 * <Link href="/about">About Us</Link>
 *
 * @example
 * // Link with icon
 * <Link href="/docs" icon={<DocIcon />}>Documentation</Link>
 *
 * @example
 * // Icon-only link
 * <Link href="/profile" iconOnly icon={<UserIcon />} />
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({
    as: Component = 'a',
    size = 'medium',
    iconOnly = false,
    icon,
    children,
    href,
    className,
    ...props
  }, ref) => {
    // Build CSS class names
    const classNames = [
      'mond-link',
      `mond-link--${size}`,
      iconOnly && 'mond-link--icon-only',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <Component
        ref={ref}
        href={href}
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
