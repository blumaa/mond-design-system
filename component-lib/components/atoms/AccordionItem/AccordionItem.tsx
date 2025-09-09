'use client';
import React, { useState, ReactNode } from 'react';
import { Box, BoxProps } from '../../layout/Box/Box';
import { tokens } from '../../../tokens/tokens';

export type AccordionItemSize = 'sm' | 'md' | 'lg';
export type AccordionItemVariant = 'default' | 'bordered' | 'filled';

export interface AccordionItemProps extends Omit<BoxProps, 'children' | 'title'> {
  /**
   * The header content (trigger)
   */
  title: ReactNode;
  
  /**
   * The collapsible content
   */
  children: ReactNode;
  
  /**
   * Whether the item is expanded
   */
  expanded?: boolean;
  
  /**
   * Whether the item is disabled
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Size variant
   * @default 'md'
   */
  size?: AccordionItemSize;
  
  /**
   * Visual variant
   * @default 'default'
   */
  variant?: AccordionItemVariant;
  
  /**
   * Icon to display
   */
  icon?: ReactNode;
  
  /**
   * Icon position
   * @default 'right'
   */
  iconPosition?: 'left' | 'right';
  
  /**
   * Dark mode styling
   * @default false
   */
  isDarkMode?: boolean;
  
  /**
   * Default expanded state for uncontrolled mode
   */
  defaultExpanded?: boolean;
  
  /**
   * Callback when expanded state changes
   */
  onExpandedChange?: (expanded: boolean) => void;
  
  /**
   * Unique identifier
   */
  itemId?: string;
}

const getSizeStyles = (size: AccordionItemSize) => {
  const sizeMap = {
    sm: {
      headerPadding: `${tokens.spacing['2']} ${tokens.spacing['3']}`,
      contentPadding: `${tokens.spacing['2']} ${tokens.spacing['3']}`,
      fontSize: tokens.fontSizes.sm,
      iconSize: '16px',
      minHeight: '40px',
    },
    md: {
      headerPadding: `${tokens.spacing['3']} ${tokens.spacing['4']}`,
      contentPadding: `${tokens.spacing['3']} ${tokens.spacing['4']}`,
      fontSize: tokens.fontSizes.base,
      iconSize: '20px',
      minHeight: '48px',
    },
    lg: {
      headerPadding: `${tokens.spacing['4']} ${tokens.spacing['6']}`,
      contentPadding: `${tokens.spacing['4']} ${tokens.spacing['6']}`,
      fontSize: tokens.fontSizes.lg,
      iconSize: '24px',
      minHeight: '56px',
    },
  };
  return sizeMap[size];
};

const getVariantStyles = (variant: AccordionItemVariant, isDarkMode: boolean) => {
  const colors = {
    light: {
      background: tokens.colors.white['50'],
      border: tokens.colors.gray['200'],
      text: tokens.colors.gray['900'],
      textSecondary: tokens.colors.gray['600'],
      hover: tokens.colors.gray['50'],
    },
    dark: {
      background: tokens.colors.gray['900'],
      border: tokens.colors.gray['800'],
      text: tokens.colors.gray['100'],
      textSecondary: tokens.colors.gray['400'],
      hover: tokens.colors.gray['800'],
    },
  };
  
  const theme = isDarkMode ? colors.dark : colors.light;
  
  const variants = {
    default: {
      backgroundColor: 'transparent',
      borderWidth: '0 0 1px 0',
      borderStyle: 'solid',
      borderColor: theme.border,
    },
    bordered: {
      backgroundColor: 'transparent',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: theme.border,
      borderRadius: tokens.radii.md,
      overflow: 'hidden',
    },
    filled: {
      backgroundColor: theme.background,
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: theme.border,
      borderRadius: tokens.radii.md,
      overflow: 'hidden',
    },
  };
  
  return { ...variants[variant], theme };
};

export const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(({
  title,
  children,
  expanded,
  disabled = false,
  size = 'md',
  variant = 'default',
  icon,
  iconPosition = 'right',
  isDarkMode = false,
  defaultExpanded = false,
  onExpandedChange,
  itemId,
  className = '',
  style,
  ...props
}, ref) => {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const isExpanded = expanded !== undefined ? expanded : internalExpanded;
  
  const sizeStyles = getSizeStyles(size);
  const variantStyles = getVariantStyles(variant, isDarkMode);
  
  const handleToggle = () => {
    if (disabled) return;
    
    const newExpanded = !isExpanded;
    if (expanded === undefined) {
      setInternalExpanded(newExpanded);
    }
    onExpandedChange?.(newExpanded);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  };
  
  const DefaultIcon = () => (
    <svg 
      width={sizeStyles.iconSize} 
      height={sizeStyles.iconSize} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor"
      style={{
        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 0.2s ease',
      }}
    >
      <polyline points="6,9 12,15 18,9"/>
    </svg>
  );
  
  const containerStyle = {
    ...variantStyles,
    ...style,
  };
  
  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: sizeStyles.headerPadding,
    fontSize: sizeStyles.fontSize,
    fontWeight: tokens.fontWeights.medium,
    fontFamily: tokens.fontFamilies.sans,
    color: disabled ? variantStyles.theme.textSecondary : variantStyles.theme.text,
    backgroundColor: 'transparent',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    textAlign: 'left' as const,
    minHeight: sizeStyles.minHeight,
    transition: 'background-color 0.2s ease',
    opacity: disabled ? 0.5 : 1,
  };
  
  const contentStyle = {
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    maxHeight: isExpanded ? '1000px' : '0px',
    opacity: isExpanded ? 1 : 0,
  };
  
  const contentInnerStyle = {
    padding: isExpanded ? sizeStyles.contentPadding : `0 ${sizeStyles.contentPadding.split(' ')[1]}`,
    color: variantStyles.theme.text,
    fontSize: sizeStyles.fontSize,
    lineHeight: 1.6,
  };

  return (
    <Box
      ref={ref}
      className={`mond-accordion-item mond-accordion-item--${variant} mond-accordion-item--${size} ${isExpanded ? 'mond-accordion-item--expanded' : ''} ${disabled ? 'mond-accordion-item--disabled' : ''} ${className}`}
      style={containerStyle}
      {...props}
    >
      {/* Header/Trigger */}
      <button
        type="button"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        style={headerStyle}
        onMouseEnter={(e) => {
          if (!disabled) {
            (e.target as HTMLElement).style.backgroundColor = variantStyles.theme.hover;
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled) {
            (e.target as HTMLElement).style.backgroundColor = 'transparent';
          }
        }}
        aria-expanded={isExpanded}
        aria-controls={itemId ? `${itemId}-content` : undefined}
        aria-disabled={disabled}
        data-accordion-header={itemId}
      >
        {iconPosition === 'left' && (
          <Box style={{ marginRight: tokens.spacing['2'] }}>
            {icon || <DefaultIcon />}
          </Box>
        )}
        
        <Box style={{ flex: 1, minWidth: 0 }}>
          {title}
        </Box>
        
        {iconPosition === 'right' && (
          <Box style={{ marginLeft: tokens.spacing['2'] }}>
            {icon || <DefaultIcon />}
          </Box>
        )}
      </button>
      
      {/* Content */}
      <Box
        id={itemId ? `${itemId}-content` : undefined}
        style={contentStyle}
        aria-hidden={!isExpanded}
      >
        <Box style={contentInnerStyle}>
          {children}
        </Box>
      </Box>
    </Box>
  );
});

AccordionItem.displayName = 'AccordionItem';