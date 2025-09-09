'use client';
import React from 'react';
import { spacing, fontSizes } from '../../../tokens';
import { Box } from '../../layout/Box/Box';
import { BreadcrumbItem } from '../../atoms/BreadcrumbItem/BreadcrumbItem';

export interface BreadcrumbItemData {
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
  items: BreadcrumbItemData[];
  
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

    const getSizeStyles = () => {
      switch (size) {
        case 'sm':
          return {
            fontSize: fontSizes.xs,
            padding: `${spacing[1]} ${spacing[2]}`,
          };
        case 'lg':
          return {
            fontSize: fontSizes.base,
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

    // Home icon for showHomeIcon prop
    const homeIcon = (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
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
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isFirst = index === 0;
          
          return (
            <BreadcrumbItem
              key={index}
              href={item.href}
              onClick={item.onClick}
              disabled={item.disabled}
              current={isLast}
              size={size}
              isDarkMode={isDarkMode}
              icon={isFirst && showHomeIcon ? homeIcon : item.icon}
              showSeparator={!isLast}
              separator={separator}
            >
              {item.label}
            </BreadcrumbItem>
          );
        })}
      </Box>
    );
  }
);

Breadcrumb.displayName = 'Breadcrumb';

export default Breadcrumb;

// Re-export the component for backward compatibility with the old interface name
export type { BreadcrumbItemData as BreadcrumbItem };