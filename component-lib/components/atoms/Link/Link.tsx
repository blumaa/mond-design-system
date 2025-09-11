'use client';
import React from 'react';
import { radii, spacing, fontSizes, fontFamilies } from '../../../tokens';
import { useTheme } from '../../providers/ThemeProvider';

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
}

const getSizeStyles = (size: LinkSize, iconOnly: boolean = false) => {
  if (iconOnly) {
    switch (size) {
      case 'small':
        return {
          fontSize: fontSizes.sm,
        };
      case 'medium':
        return {
          fontSize: fontSizes.base,
        };
      case 'large':
        return {
          fontSize: fontSizes.lg,
        };
      default:
        return {};
    }
  }

  switch (size) {
    case 'small':
      return {
        fontSize: fontSizes.sm,
        gap: spacing[2],
      };
    case 'medium':
      return {
        fontSize: fontSizes.base,
        gap: spacing[2],
      };
    case 'large':
      return {
        fontSize: fontSizes.lg,
        gap: spacing[2],
      };
    default:
      return {};
  }
};

const getLinkStyles = (theme: ReturnType<typeof useTheme>) => {
  return {
    color: 'inherit',
    textDecoration: 'underline',
    textDecorationColor: theme('text.link'),
    textUnderlineOffset: '1px',
    hoverStyles: {
      textDecoration: 'none',
      textDecorationColor: theme('text.link'),
    },
    activeStyles: {
      textDecoration: 'underline',
      textDecorationColor: theme('text.link'),
    },
    focusStyles: {
      outline: `2px solid ${theme('border.focused')}`,
      outlineOffset: '2px',
      borderRadius: radii.sm,
    },
  };
};

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ 
    size = 'medium',
    iconOnly = false,
    icon,
    children,
    href,
    style = {},
    ...props
  }, ref) => {
    const theme = useTheme();
    const sizeStyles = getSizeStyles(size, iconOnly);
    const linkStyles = getLinkStyles(theme);

    const baseStyles: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      cursor: 'pointer',
      fontFamily: fontFamilies.sans,
      textDecoration: 'underline',
      textDecorationColor: theme('text.link'),
      textUnderlineOffset: '1px',
      color: 'inherit',
      ...sizeStyles,
      ...style,
    };

    // Handle hover, active, and focus states
    const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (linkStyles.hoverStyles) {
        Object.entries(linkStyles.hoverStyles).forEach(([key, value]) => {
          // @ts-expect-error - dynamic styles
          e.currentTarget.style[key] = value;
        });
      }
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (linkStyles.hoverStyles) {
        // Reset to base styles
        Object.entries(linkStyles.hoverStyles).forEach(([key]) => {
          const originalValue = baseStyles[key as keyof React.CSSProperties];
          if (originalValue !== undefined) {
            // @ts-expect-error - dynamic styles
            e.currentTarget.style[key] = originalValue;
          }
        });
      }
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (linkStyles.activeStyles) {
        Object.entries(linkStyles.activeStyles).forEach(([key, value]) => {
          // @ts-expect-error - dynamic styles
          e.currentTarget.style[key] = value;
        });
      }
    };

    const handleMouseUp = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (linkStyles.activeStyles) {
        // Reset to hover styles if still hovering, otherwise base styles
        const isHovering = e.currentTarget.matches(':hover');
        const stylesToApply = isHovering && linkStyles.hoverStyles ? linkStyles.hoverStyles : baseStyles;
        
        Object.entries(linkStyles.activeStyles).forEach(([key]) => {
          // @ts-expect-error - dynamic styles
          const resetValue = stylesToApply[key as keyof React.CSSProperties];
          if (resetValue !== undefined) {
            // @ts-expect-error - dynamic styles
            e.currentTarget.style[key] = resetValue;
          }
        });
      }
    };

    const handleFocus = (e: React.FocusEvent<HTMLAnchorElement>) => {
      if (linkStyles.focusStyles) {
        Object.entries(linkStyles.focusStyles).forEach(([key, value]) => {
          // @ts-expect-error - dynamic styles
          e.currentTarget.style[key] = value;
        });
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLAnchorElement>) => {
      if (linkStyles.focusStyles) {
        Object.entries(linkStyles.focusStyles).forEach(([key]) => {
          // @ts-expect-error - dynamic styles
          e.currentTarget.style[key] = '';
        });
      }
    };

    return (
      <a
        ref={ref}
        href={href}
        style={baseStyles}
        data-mond-link
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      >
        {icon && icon}
        {!iconOnly && children}
      </a>
    );
  }
);

Link.displayName = 'Link';

export default Link;