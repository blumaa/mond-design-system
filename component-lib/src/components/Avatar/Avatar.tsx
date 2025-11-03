import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { Box } from '../Box/Box';
import type { BoxProps } from '../Box/Box';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface AvatarProps extends Omit<BoxProps, 'size' | 'as'> {
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

// Styled Avatar Container
const StyledAvatar = styled(Box)<{ size?: AvatarSize }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radii.full};
  background-color: ${({ theme }) => theme.colors.surfaceElevated};
  border: 1px solid ${({ theme }) => theme.colors.borderSubtle};
  overflow: hidden;
  flex-shrink: 0;

  /* === SIZES === */

  /* Extra Small: 24x24 */
  ${({ size }) =>
    size === 'xs' &&
    css`
      width: 24px;
      height: 24px;
    `}

  /* Small: 32x32 */
  ${({ size }) =>
    size === 'sm' &&
    css`
      width: 32px;
      height: 32px;
    `}

  /* Medium: 40x40 (default) */
  ${({ size }) =>
    (size === 'md' || !size) &&
    css`
      width: 40px;
      height: 40px;
    `}

  /* Large: 48x48 */
  ${({ size }) =>
    size === 'lg' &&
    css`
      width: 48px;
      height: 48px;
    `}

  /* Extra Large: 64x64 */
  ${({ size }) =>
    size === 'xl' &&
    css`
      width: 64px;
      height: 64px;
    `}

  /* 2X Large: 80x80 */
  ${({ size }) =>
    size === '2xl' &&
    css`
      width: 80px;
      height: 80px;
    `}
`;

// Styled Image
const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

// Styled Fallback
const AvatarFallback = styled(Box)<{ size?: AvatarSize }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
  background-color: ${({ theme }) => theme.colors.surfaceElevated};
  text-transform: uppercase;
  user-select: none;

  /* Size-specific font sizes */
  ${({ size, theme }) =>
    size === 'xs' &&
    css`
      font-size: ${theme.fontSizes.xs};
    `}

  ${({ size, theme }) =>
    size === 'sm' &&
    css`
      font-size: ${theme.fontSizes.sm};
    `}

  ${({ size, theme }) =>
    (size === 'md' || !size) &&
    css`
      font-size: ${theme.fontSizes.base};
    `}

  ${({ size, theme }) =>
    size === 'lg' &&
    css`
      font-size: ${theme.fontSizes.lg};
    `}

  ${({ size, theme }) =>
    size === 'xl' &&
    css`
      font-size: ${theme.fontSizes.xl};
    `}

  ${({ size, theme }) =>
    size === '2xl' &&
    css`
      font-size: ${theme.fontSizes['2xl']};
    `}
`;

/**
 * Avatar Component
 *
 * A circular avatar component that displays images or fallback content (initials or custom).
 * Uses styled-components for theming.
 *
 * **Theme-Aware**: Uses theme object from styled-components ThemeProvider
 * **Client Component**: Uses 'use client' for image loading state management
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
export const Avatar = React.forwardRef<HTMLElement, AvatarProps>(
  (
    {
      size = 'md',
      src,
      alt,
      fallback,
      children,
      'data-testid': dataTestId,
      ...props
    },
    ref,
  ) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleImageLoad = () => {
      setImageLoaded(true);
      setImageError(false);
    };

    const handleImageError = () => {
      setImageError(true);
      setImageLoaded(false);
    };

    // Generate initials from fallback text
    const getInitials = (text: string) => {
      return text
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .slice(0, 2);
    };

    const showFallback = !src || imageError || !imageLoaded;
    const fallbackContent = children || (fallback ? getInitials(fallback) : '?');

    return (
      <StyledAvatar
        ref={ref as React.Ref<HTMLElement>}
        size={size}
        data-testid={dataTestId}
        data-size={size}
        {...props}
      >
        {src && (
          <AvatarImage
            src={src}
            alt={alt || fallback || 'Avatar'}
            style={{ display: imageLoaded && !imageError ? 'block' : 'none' }}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
        {showFallback && (
          <AvatarFallback
            size={size}
            data-testid={`${dataTestId || 'avatar'}-fallback`}
          >
            {fallbackContent}
          </AvatarFallback>
        )}
      </StyledAvatar>
    );
  },
);

Avatar.displayName = 'Avatar';
