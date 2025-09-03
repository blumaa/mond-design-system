'use client';
import React, { useState } from 'react';
import { radii, spacing, fontSizes, fontWeights, fontFamilies } from '../../tokens';
import { useTheme } from '../../utils/theme';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface AvatarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'size'> {
  'data-testid'?: string;
  /**
   * Avatar size
   * @default 'md'
   */
  size?: AvatarSize;
  
  /**
   * Dark mode
   * @default false
   */
  isDarkMode?: boolean;
  
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

const getSizeStyles = (size: AvatarSize) => {
  switch (size) {
    case 'xs':
      return {
        width: '24px',
        height: '24px',
        fontSize: fontSizes.xs,
      };
    case 'sm':
      return {
        width: '32px',
        height: '32px',
        fontSize: fontSizes.sm,
      };
    case 'md':
      return {
        width: '40px',
        height: '40px',
        fontSize: fontSizes.base,
      };
    case 'lg':
      return {
        width: '48px',
        height: '48px',
        fontSize: fontSizes.lg,
      };
    case 'xl':
      return {
        width: '64px',
        height: '64px',
        fontSize: fontSizes.xl,
      };
    case '2xl':
      return {
        width: '80px',
        height: '80px',
        fontSize: fontSizes['2xl'],
      };
    default:
      return {};
  }
};

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ 
    size = 'md',
    isDarkMode = false,
    src,
    alt,
    fallback,
    children,
    className,
    'data-testid': dataTestId,
    ...props 
  }, ref) => {
    const theme = useTheme(isDarkMode);
    const sizeStyles = getSizeStyles(size);
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const containerStyles = {
      position: 'relative' as const,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: sizeStyles.width,
      height: sizeStyles.height,
      borderRadius: radii.full,
      backgroundColor: theme('surface.elevated'),
      border: `1px solid ${theme('border.subtle')}`,
      overflow: 'hidden' as const,
      flexShrink: 0,
    };

    const imageStyles = {
      width: '100%',
      height: '100%',
      objectFit: 'cover' as const,
      display: imageLoaded && !imageError ? 'block' : 'none',
    };

    const fallbackStyles = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      fontSize: sizeStyles.fontSize,
      fontFamily: fontFamilies.sans,
      fontWeight: fontWeights.medium,
      color: theme('text.secondary'),
      backgroundColor: theme('surface.elevated'),
      textTransform: 'uppercase' as const,
      userSelect: 'none' as const,
    };

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
      <div
        ref={ref}
        className={className}
        data-testid={dataTestId}
        style={containerStyles}
        {...props}
      >
        {src && (
          <img
            src={src}
            alt={alt || fallback || 'Avatar'}
            style={imageStyles}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
        {showFallback && (
          <div style={fallbackStyles} data-testid={`${dataTestId || 'avatar'}-fallback`}>
            {fallbackContent}
          </div>
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export default Avatar;