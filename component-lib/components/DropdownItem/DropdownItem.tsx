'use client';
import { forwardRef } from 'react';
import { Box, BoxProps } from '../Box/Box';

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
  // Render divider
  if (divider) {
    return (
      <div
        ref={ref}
        className={`mond-dropdown-item mond-dropdown-item--divider ${className}`}
        style={style}
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

  const itemClassNames = [
    'mond-dropdown-item',
    focused && 'mond-dropdown-item--focused',
    disabled && 'mond-dropdown-item--disabled',
    hasChildren && 'mond-dropdown-item--has-children',
    className,
  ].filter(Boolean).join(' ');

  // Calculate padding for indentation
  const paddingLeft = depth > 0 ? `${0.75 + (depth * 1)}rem` : undefined;

  return (
    <Box
      ref={ref}
      className={itemClassNames}
      tabIndex={disabled ? -1 : 0}
      role="menuitem"
      aria-disabled={disabled}
      style={{
        paddingLeft,
        ...style,
      }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onFocus={handleFocus}
      data-option-value={value}
      {...props}
    >
      {icon && (
        <div className="mond-dropdown-item__icon">
          {icon}
        </div>
      )}

      <div className="mond-dropdown-item__label">
        {label}
      </div>

      {hasChildren && (
        <div className="mond-dropdown-item__expansion">
          {expansionIndicator}
        </div>
      )}
    </Box>
  );
});

DropdownItem.displayName = 'DropdownItem';
