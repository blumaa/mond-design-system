'use client';
import React from 'react';
import { spacing, fontSizes, fontFamilies } from '../../tokens';
import { useTheme } from '../../utils/theme';
import { Box } from '../Box/Box';
import { Link } from '../Link/Link';
import { Icon } from '../Icon/Icon';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Breadcrumb items
   */
  items: BreadcrumbItem[];
  
  /**
   * Custom separator between items
   * @default '/'
   */
  separator?: React.ReactNode;
  
  /**
   * Maximum number of items to show before collapsing
   * @default undefined (show all)
   */
  maxItems?: number;
  
  /**
   * Show home icon on first item
   * @default false
   */
  showHomeIcon?: boolean;
  
  /**
   * Size variant
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Dark mode
   * @default false
   */
  isDarkMode?: boolean;
  
  /**
   * Custom data testid for testing
   */
  'data-testid'?: string;
}

export const Breadcrumb = React.forwardRef<HTMLDivElement, BreadcrumbProps>(
  ({ 
    items,
    separator = '/',
    maxItems,
    showHomeIcon = false,
    size = 'md',
    isDarkMode = false,
    'data-testid': dataTestId,
    className,
    ...props 
  }, ref) => {
    const theme = useTheme(isDarkMode);

    const getSizeStyles = () => {
      switch (size) {
        case 'sm':
          return {
            fontSize: fontSizes.xs,
            padding: `${spacing[1]} ${spacing[2]}`,
          };
        case 'lg':
          return {
            fontSize: fontSizes.md,
            padding: `${spacing[3]} ${spacing[4]}`,
          };
        case 'md':
        default:
          return {
            fontSize: fontSizes.sm,
            padding: `${spacing[2]} ${spacing[3]}`,
          };
      }
    };

    const sizeStyles = getSizeStyles();

    const processItems = () => {
      let processedItems = [...items];
      
      if (maxItems && items.length > maxItems) {
        const start = items.slice(0, 1);
        const end = items.slice(-(maxItems - 2));
        const ellipsis = { label: '...', disabled: true };
        processedItems = [...start, ellipsis, ...end];
      }
      
      return processedItems;
    };

    const displayItems = processItems();

    const renderItem = (item: BreadcrumbItem, index: number, isLast: boolean) => {
      const isEllipsis = item.label === '...';
      
      const itemContent = (
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing[1],
            color: isLast 
              ? theme('text.primary') 
              : item.disabled 
                ? theme('text.disabled') 
                : theme('text.secondary'),
            fontFamily: fontFamilies.sans,
            fontSize: sizeStyles.fontSize,
            fontWeight: isLast ? 'medium' : 'normal',
            textDecoration: 'none',
            cursor: item.disabled ? 'default' : (item.href || item.onClick) ? 'pointer' : 'default',
            transition: 'color 150ms ease',
          }}
          onClick={item.disabled ? undefined : item.onClick}
          onMouseEnter={(e) => {
            if (!item.disabled && !isLast && (item.href || item.onClick)) {
              (e.target as HTMLElement).style.color = theme('text.accent');
            }
          }}
          onMouseLeave={(e) => {
            if (!item.disabled && !isLast) {
              (e.target as HTMLElement).style.color = theme('text.secondary');
            }
          }}
        >
          {showHomeIcon && index === 0 && (
            <Icon name="home" size={14} />
          )}
          {item.icon && (
            <Box style={{ flexShrink: 0 }}>
              {item.icon}
            </Box>
          )}
          <span>{item.label}</span>
        </Box>
      );

      if (item.href && !item.disabled && !isLast && !isEllipsis) {
        return (
          <Link key={index} href={item.href} style={{ textDecoration: 'none' }}>
            {itemContent}
          </Link>
        );
      }

      return (
        <Box key={index} as={item.onClick && !item.disabled ? 'button' : 'span'}>
          {itemContent}
        </Box>
      );
    };

    const renderSeparator = (index: number) => (
      <Box
        key={`separator-${index}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          color: theme('text.disabled'),
          fontSize: sizeStyles.fontSize,
          margin: `0 ${spacing[2]}`,
        }}
        aria-hidden="true"
      >
        {separator}
      </Box>
    );

    return (
      <Box
        ref={ref}
        className={className}
        data-testid={dataTestId}
        role="navigation"
        aria-label="Breadcrumb"
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          padding: sizeStyles.padding,
        }}
        {...props}
      >
        {displayItems.map((item, index) => (
          <React.Fragment key={index}>
            {renderItem(item, index, index === displayItems.length - 1)}
            {index < displayItems.length - 1 && renderSeparator(index)}
          </React.Fragment>
        ))}
      </Box>
    );
  }
);

Breadcrumb.displayName = 'Breadcrumb';

export default Breadcrumb;