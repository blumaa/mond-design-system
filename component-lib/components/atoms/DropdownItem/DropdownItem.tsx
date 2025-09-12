'use client';
import React, { forwardRef } from 'react';
import { spacing, fontSizes, fontWeights, fontFamilies, radii } from '../../../tokens';
import { useTheme } from '../../providers/ThemeProvider';
import { Box, BoxProps } from '../../layout/Box/Box';

export interface DropdownItemProps extends Omit<BoxProps, 'onClick' | 'children' | 'onMouseEnter' | 'onFocus' | 'onSelect'> {
  /**
   * Unique value for the dropdown item
   */
  value: string;
  
  /**
   * Display label for the dropdown item
   */
  label: string;
  
  /**
   * Whether the item is disabled
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Whether to render as a divider instead of a regular item
   * @default false
   */
  divider?: boolean;
  
  /**
   * Icon to display before the label
   */
  icon?: React.ReactNode;
  
  /**
   * Whether this item has nested children (shows expansion indicator)
   * @default false
   */
  hasChildren?: boolean;
  
  /**
   * Nesting depth for indentation
   * @default 0
   */
  depth?: number;
  
  /**
   * Whether this item is currently focused
   * @default false
   */
  focused?: boolean;
  
  /**
   * Click handler for the dropdown item
   */
  onSelect?: (value: string) => void;
  
  /**
   * Mouse enter handler
   */
  onMouseEnter?: (value: string) => void;
  
  /**
   * Focus handler
   */
  onFocus?: (value: string) => void;
  
  /**
   * Dark mode support
   * @default false
   */
  
  /**
   * Custom expansion indicator for items with children
   * @default '▸'
   */
  expansionIndicator?: React.ReactNode;
}

export const DropdownItem = forwardRef<HTMLDivElement, DropdownItemProps>(({
  value,
  label,
  disabled = false,
  divider = false,
  icon,
  hasChildren = false,
  depth = 0,
  focused = false,
  onSelect,
  onMouseEnter,
  onFocus,
  
  expansionIndicator = '▸',
  className = '',
  style,
  ...props
}, ref) => {
  const theme = useTheme();
  
  // Render divider
  if (divider) {
    return (
      <Box
        ref={ref}
        className={`mond-dropdown-item mond-dropdown-item--divider ${className}`}
        style={{
          height: '1px',
          backgroundColor: theme('border.default'),
          margin: `${spacing[1]} 0`,
          ...style,
        }}
        {...props}
      />
    );
  }
  
  const handleClick = () => {
    if (!disabled && onSelect) {
      onSelect(value);
    }
  };
  
  const handleMouseEnter = () => {
    if (!disabled && onMouseEnter) {
      onMouseEnter(value);
    }
  };
  
  const handleFocus = () => {
    if (!disabled && onFocus) {
      onFocus(value);
    }
  };
  
  const itemStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: `${spacing[2]} ${spacing[3]}`,
    paddingLeft: `${parseFloat(spacing[3]) * 16 + (depth * 16)}px`,
    cursor: disabled ? 'not-allowed' : 'pointer',
    color: disabled ? theme('text.disabled') : theme('text.primary'),
    backgroundColor: 'transparent',
    transition: 'background-color 150ms ease',
    fontSize: fontSizes.sm,
    fontFamily: fontFamilies.sans,
    borderRadius: radii.sm,
    margin: `0 ${spacing[1]}`,
    ...(hasChildren && {
      fontWeight: fontWeights.medium,
    }),
    ...(focused && !disabled && {
      backgroundColor: theme('interactive.secondary.backgroundHover'),
    }),
    ...style,
  };
  
  return (
    <Box
      ref={ref}
      className={`mond-dropdown-item ${focused ? 'mond-dropdown-item--focused' : ''} ${disabled ? 'mond-dropdown-item--disabled' : ''} ${hasChildren ? 'mond-dropdown-item--has-children' : ''} ${className}`}
      tabIndex={disabled ? -1 : 0}
      role="menuitem"
      aria-disabled={disabled}
      style={itemStyle}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onFocus={handleFocus}
      data-option-value={value}
      {...props}
    >
      {icon && (
        <Box
          style={{
            marginRight: spacing[2],
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
      )}
      
      <Box style={{ flex: 1 }}>
        {label}
      </Box>
      
      {hasChildren && (
        <Box
          style={{
            marginLeft: spacing[2],
            fontSize: fontSizes.xs,
          }}
        >
          {expansionIndicator}
        </Box>
      )}
    </Box>
  );
});

DropdownItem.displayName = 'DropdownItem';