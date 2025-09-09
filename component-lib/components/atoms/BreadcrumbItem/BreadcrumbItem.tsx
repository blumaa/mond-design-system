import { forwardRef, ReactNode } from 'react';
import { Box, BoxProps } from '../../layout/Box/Box';
import { Link } from '../Link/Link';
import { Icon } from '../Icon/Icon';
import { tokens } from '../../../tokens/tokens';

export interface BreadcrumbItemProps extends Omit<BoxProps, 'children'> {
  /**
   * The text content of the breadcrumb item
   */
  children: ReactNode;
  
  /**
   * URL to navigate to when clicked
   */
  href?: string;
  
  /**
   * Click handler for the breadcrumb item
   */
  onClick?: () => void;
  
  /**
   * Whether the item is disabled
   */
  disabled?: boolean;
  
  /**
   * Whether this is the current/active item
   */
  current?: boolean;
  
  /**
   * Icon to display before the text
   */
  icon?: ReactNode;
  
  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Dark mode styling
   */
  isDarkMode?: boolean;
  
  /**
   * Custom separator after this item
   */
  separator?: ReactNode;
  
  /**
   * Whether to show the separator after this item
   */
  showSeparator?: boolean;
}

const getSizeStyles = (size: string) => {
  const sizeMap = {
    sm: {
      fontSize: tokens.fontSizes.xs,
      iconSize: 'xs' as const,
      padding: `${tokens.spacing['1']} ${tokens.spacing['2']}`,
    },
    md: {
      fontSize: tokens.fontSizes.sm,
      iconSize: 'sm' as const,
      padding: `${tokens.spacing['2']} ${tokens.spacing['3']}`,
    },
    lg: {
      fontSize: tokens.fontSizes.base,
      iconSize: 'md' as const,
      padding: `${tokens.spacing['3']} ${tokens.spacing['4']}`,
    },
  };
  return sizeMap[size as keyof typeof sizeMap];
};

const getItemColors = (current: boolean, disabled: boolean, isDarkMode: boolean) => {
  if (disabled) {
    return {
      color: isDarkMode ? tokens.colors.gray['600'] : tokens.colors.gray['400'],
      cursor: 'not-allowed',
    };
  }
  
  if (current) {
    return {
      color: isDarkMode ? tokens.colors.gray['200'] : tokens.colors.gray['900'],
      fontWeight: tokens.fontWeights.medium,
      cursor: 'default',
    };
  }
  
  return {
    color: isDarkMode ? tokens.colors.gray['400'] : tokens.colors.gray['600'],
    cursor: 'pointer',
    transition: 'color 150ms ease',
  };
};

export const BreadcrumbItem = forwardRef<HTMLElement, BreadcrumbItemProps>(({
  children,
  href,
  onClick,
  disabled = false,
  current = false,
  icon,
  size = 'md',
  isDarkMode = false,
  separator = '/',
  showSeparator = false,
  className = '',
  style,
  ...props
}, ref) => {
  const sizeStyles = getSizeStyles(size);
  const colors = getItemColors(current, disabled, isDarkMode);
  const isInteractive = (href || onClick) && !disabled && !current;

  const itemStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: tokens.spacing['1'],
    fontSize: sizeStyles.fontSize,
    fontWeight: colors.fontWeight || tokens.fontWeights.normal,
    color: colors.color,
    cursor: colors.cursor,
    textDecoration: 'none',
    padding: sizeStyles.padding,
    borderRadius: tokens.radii.sm,
    transition: colors.transition,
    ...style,
  };

  const hoverStyle = isInteractive ? {
    color: isDarkMode ? tokens.colors.blue['400'] : tokens.colors.blue['600'],
  } : {};

  const ItemContent = () => (
    <Box
      style={itemStyle}
      onMouseEnter={(e) => {
        if (isInteractive) {
          Object.assign((e.target as HTMLElement).style, hoverStyle);
        }
      }}
      onMouseLeave={(e) => {
        if (isInteractive) {
          (e.target as HTMLElement).style.color = colors.color;
        }
      }}
      onClick={disabled ? undefined : onClick}
    >
      {icon && (
        <Icon size={sizeStyles.iconSize} isDarkMode={isDarkMode}>
          {icon}
        </Icon>
      )}
      
      <span>{children}</span>
    </Box>
  );

  const renderItem = () => {
    if (href && !disabled && !current) {
      return (
        <Link 
          href={href} 
          style={{ textDecoration: 'none' }}
        >
          <ItemContent />
        </Link>
      );
    }

    const Component = onClick && !disabled && !current ? 'button' : 'span';
    
    return (
      <Box as={Component} style={{ border: 'none', background: 'transparent', padding: 0 }}>
        <ItemContent />
      </Box>
    );
  };

  return (
    <Box
      ref={ref}
      className={`mond-breadcrumb-item ${current ? 'mond-breadcrumb-item--current' : ''} ${disabled ? 'mond-breadcrumb-item--disabled' : ''} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
      }}
      {...props}
    >
      {renderItem()}
      
      {showSeparator && (
        <Box
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            color: isDarkMode ? tokens.colors.gray['600'] : tokens.colors.gray['400'],
            fontSize: sizeStyles.fontSize,
            margin: `0 ${tokens.spacing['2']}`,
          }}
          aria-hidden="true"
        >
          {separator}
        </Box>
      )}
    </Box>
  );
});

BreadcrumbItem.displayName = 'BreadcrumbItem';