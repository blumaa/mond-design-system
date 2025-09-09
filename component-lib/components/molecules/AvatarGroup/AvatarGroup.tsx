'use client';
import React from 'react';
import { Box } from '../../layout/Box/Box';
import { Avatar, AvatarProps, AvatarSize } from '../../atoms/Avatar/Avatar';
import { useTheme } from '../../../utils/theme';
import { radii, fontSizes, fontWeights, fontFamilies } from '../../../tokens';

export interface AvatarData extends Omit<AvatarProps, 'size' | 'isDarkMode'> {
  /**
   * Unique identifier for the avatar
   */
  id: string;
  
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

export interface AvatarGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Array of avatar data
   */
  avatars: AvatarData[];
  
  /**
   * Avatar size for all avatars in the group
   * @default 'md'
   */
  size?: AvatarSize;
  
  /**
   * Maximum number of avatars to display before showing "+N more"
   * @default 5
   */
  maxCount?: number;
  
  /**
   * Spacing between avatars (overlap amount)
   * @default 'md'
   */
  spacing?: 'sm' | 'md' | 'lg';
  
  /**
   * Dark mode
   * @default false
   */
  isDarkMode?: boolean;
  
  /**
   * Custom render function for the "+N more" indicator
   */
  renderExcess?: (count: number, size: AvatarSize, isDarkMode: boolean) => React.ReactNode;
  
  /**
   * Callback when an avatar is clicked
   */
  onAvatarClick?: (avatar: AvatarData, index: number) => void;
  
  /**
   * Callback when the "+N more" indicator is clicked
   */
  onExcessClick?: (hiddenAvatars: AvatarData[]) => void;
  
  /**
   * Custom data testid for testing
   */
  'data-testid'?: string;
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
      return {
        width: '40px',
        height: '40px',
        fontSize: fontSizes.base,
      };
  }
};

const getSpacingOffset = (spacing: 'sm' | 'md' | 'lg', size: AvatarSize) => {
  const sizeMap = {
    xs: { sm: -6, md: -8, lg: -10 },
    sm: { sm: -8, md: -12, lg: -16 },
    md: { sm: -10, md: -16, lg: -20 },
    lg: { sm: -12, md: -18, lg: -24 },
    xl: { sm: -16, md: -24, lg: -32 },
    '2xl': { sm: -20, md: -30, lg: -40 },
  };
  
  return sizeMap[size]?.[spacing] ?? sizeMap.md[spacing];
};

const DefaultExcessAvatar: React.FC<{
  count: number;
  size: AvatarSize;
  isDarkMode: boolean;
  onClick?: () => void;
}> = ({ count, size, isDarkMode, onClick }) => {
  const theme = useTheme(isDarkMode);
  const sizeStyles = getSizeStyles(size);
  
  const excessStyles = {
    position: 'relative' as const,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: sizeStyles.width,
    height: sizeStyles.height,
    borderRadius: radii.full,
    backgroundColor: theme('surface.elevated'),
    border: `2px solid ${theme('surface.background')}`,
    fontSize: sizeStyles.fontSize,
    fontFamily: fontFamilies.sans,
    fontWeight: fontWeights.medium,
    color: theme('text.secondary'),
    cursor: onClick ? 'pointer' : 'default',
    flexShrink: 0,
    zIndex: 1,
  };

  const handleClick = () => {
    onClick?.();
  };

  return (
    <Box
      style={excessStyles}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? `Show ${count} more avatars` : undefined}
    >
      +{count}
    </Box>
  );
};

export const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ 
    avatars,
    size = 'md',
    maxCount = 5,
    spacing = 'md',
    isDarkMode = false,
    renderExcess,
    onAvatarClick,
    onExcessClick,
    'data-testid': dataTestId,
    ...props 
  }, ref) => {
    const theme = useTheme(isDarkMode);
    const spacingOffset = getSpacingOffset(spacing, size);
    
    // Split avatars into visible and hidden
    const visibleAvatars = avatars.slice(0, maxCount);
    const hiddenAvatars = avatars.slice(maxCount);
    const hasExcess = hiddenAvatars.length > 0;
    
    const containerStyles = {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row-reverse' as const, // Reverse to stack properly with negative margins
    };

    const avatarWrapperStyles = (index: number, isLast: boolean) => ({
      position: 'relative' as const,
      zIndex: visibleAvatars.length - index, // Higher z-index for later avatars
      marginLeft: isLast ? 0 : spacingOffset,
      transition: 'transform 150ms ease',
      cursor: onAvatarClick ? 'pointer' : 'default',
      // Hover effect
      ':hover': onAvatarClick ? {
        transform: 'scale(1.05)',
        zIndex: 999,
      } : {},
    });

    const handleAvatarClick = (avatar: AvatarData, index: number) => {
      onAvatarClick?.(avatar, index);
    };

    const handleExcessClick = () => {
      onExcessClick?.(hiddenAvatars);
    };

    return (
      <Box
        ref={ref}
        display="flex"
        alignItems="center"
        style={containerStyles}
        data-testid={dataTestId}
        {...props}
      >
        {/* Excess indicator (rendered first due to flex-direction: row-reverse) */}
        {hasExcess && (
          <Box
            style={{
              position: 'relative',
              zIndex: 0,
              marginLeft: spacingOffset,
            }}
          >
            {renderExcess ? (
              renderExcess(hiddenAvatars.length, size, isDarkMode)
            ) : (
              <DefaultExcessAvatar
                count={hiddenAvatars.length}
                size={size}
                isDarkMode={isDarkMode}
                onClick={onExcessClick ? handleExcessClick : undefined}
              />
            )}
          </Box>
        )}
        
        {/* Visible avatars (rendered in reverse order due to flex-direction) */}
        {visibleAvatars
          .slice()
          .reverse()
          .map((avatar, reverseIndex) => {
            const actualIndex = visibleAvatars.length - 1 - reverseIndex;
            const isLast = reverseIndex === 0; // Last in visual order (rightmost)
            
            return (
              <Box
                key={avatar.id}
                style={avatarWrapperStyles(actualIndex, isLast)}
                onClick={() => handleAvatarClick(avatar, actualIndex)}
                role={onAvatarClick ? 'button' : undefined}
                tabIndex={onAvatarClick ? 0 : undefined}
                aria-label={onAvatarClick ? `View ${avatar.alt || avatar.fallback || 'user'} profile` : undefined}
                data-testid={dataTestId ? `${dataTestId}-avatar-${actualIndex}` : undefined}
                onMouseEnter={(e) => {
                  if (onAvatarClick) {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.zIndex = '999';
                  }
                }}
                onMouseLeave={(e) => {
                  if (onAvatarClick) {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.zIndex = String(visibleAvatars.length - actualIndex);
                  }
                }}
              >
                <Avatar
                  {...avatar}
                  size={size}
                  isDarkMode={isDarkMode}
                  style={{
                    border: `2px solid ${theme('surface.background')}`,
                    ...avatar.style,
                  }}
                />
              </Box>
            );
          })}
      </Box>
    );
  }
);

AvatarGroup.displayName = 'AvatarGroup';

export default AvatarGroup;