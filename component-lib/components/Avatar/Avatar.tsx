import React from 'react';
import { useAvatarImage } from './useAvatarImage';
import './avatar.css';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface AvatarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'size'> {
  'data-testid'?: string;
  /**
   * Avatar size
   * @default 'md'
   */
  size?: AvatarSize;

  /**
   * Image source URL
   */
  src?: string;

  /**
   * Alt text for the image
   */
  alt?: string;

  /**
   * Fallback text (usually initials)
   */
  fallback?: string;

  /**
   * Custom fallback content
   */
  children?: React.ReactNode;
}

/**
 * Avatar Component
 *
 * A circular avatar component that displays images or fallback content (initials or custom).
 * Uses CSS variables for theming.
 *
 * **SSR-Compatible with Client Features**: Uses 'use client' for image loading state management,
 * but removes runtime theme resolution in favor of CSS variables.
 * **Theme-Aware**: Automatically responds to data-theme attribute changes via CSS.
 *
 * @example
 * // Avatar with image
 * <Avatar src="https://example.com/user.jpg" alt="User Name" />
 *
 * @example
 * // Avatar with fallback initials
 * <Avatar fallback="John Doe" size="lg" />
 *
 * @example
 * // Avatar with custom fallback content
 * <Avatar size="md">
 *   <span>👤</span>
 * </Avatar>
 */
export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({
    size = 'md',
    src,
    alt,
    fallback,
    children,
    className,
    'data-testid': dataTestId,
    ...props
  }, ref) => {
    const imageStatus = useAvatarImage({ src });

    // Build CSS class names
    const classNames = [
      'mond-avatar',
      `mond-avatar--${size}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    // Generate initials from fallback text
    const getInitials = (text: string) => {
      return text
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .slice(0, 2);
    };

    const showImage = imageStatus === 'loaded';
    const showFallback = !src || imageStatus === 'error';
    const fallbackContent = children || (fallback ? getInitials(fallback) : '?');

    return (
      <div
        ref={ref}
        className={classNames}
        data-testid={dataTestId}
        data-size={size}
        {...props}
      >
        {showImage && (
          <img
            src={src}
            alt={alt || fallback || 'Avatar'}
            className="mond-avatar__image"
          />
        )}
        {showFallback && (
          <div
            className="mond-avatar__fallback"
            data-testid={`${dataTestId || 'avatar'}-fallback`}
          >
            {fallbackContent}
          </div>
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export default Avatar;
