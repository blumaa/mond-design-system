import { forwardRef } from 'react';
import styled, { css } from 'styled-components';

export interface DropdownItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect' | 'onMouseEnter' | 'onFocus'> {
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

interface StyledDropdownItemProps {
  $focused: boolean;
  $disabled: boolean;
  $divider: boolean;
  $hasChildren: boolean;
  $depth: number;
}

const StyledDropdownItem = styled.div<StyledDropdownItemProps>`
  display: flex;
  align-items: center;
  cursor: ${({ $disabled, $divider }) => ($disabled || $divider ? 'not-allowed' : 'pointer')};
  transition: background-color 150ms ease;
  font-family: ${({ theme }) => theme.fonts.sans};

  /* Divider variant */
  ${({ $divider, theme }) =>
    $divider &&
    css`
      height: 1px;
      background-color: ${theme.colors.borderDefault};
      margin: ${theme.space[1]} 0;
      padding: 0;
      cursor: default;
    `}

  /* Regular item styles (not divider) */
  ${({ $divider, theme }) =>
    !$divider &&
    css`
      padding: ${theme.space[2]} ${theme.space[3]};
      color: ${theme.colors.textPrimary};
      background-color: transparent;
      font-size: ${theme.fontSizes.sm};
      border-radius: ${theme.radii.sm};
      margin: 0 ${theme.space[1]};
    `}

  /* Focused state */
  ${({ $focused, $disabled, $divider, theme }) =>
    $focused && !$disabled && !$divider &&
    css`
      background-color: ${theme.colors.gray100};
    `}

  /* Disabled state */
  ${({ $disabled, $divider, theme }) =>
    $disabled && !$divider &&
    css`
      cursor: not-allowed;
      color: ${theme.colors.textDisabled};
    `}

  /* Has children (submenu) */
  ${({ $hasChildren, theme }) =>
    $hasChildren &&
    css`
      font-weight: ${theme.fontWeights.medium};
    `}

  /* Depth indentation */
  ${({ $depth }) =>
    $depth > 0 &&
    css`
      padding-left: ${0.75 + ($depth * 1)}rem;
    `}
`;

const StyledIcon = styled.div`
  margin-right: ${({ theme }) => theme.space[2]};
  flex-shrink: 0;
`;

const StyledLabel = styled.div`
  flex: 1;
`;

const StyledExpansion = styled.div`
  margin-left: ${({ theme }) => theme.space[2]};
  font-size: ${({ theme }) => theme.fontSizes.xs};
`;

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
      <StyledDropdownItem
        ref={ref}
        $focused={false}
        $disabled={false}
        $divider={true}
        $hasChildren={false}
        $depth={0}
        className={className}
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

  return (
    <StyledDropdownItem
      ref={ref}
      $focused={focused}
      $disabled={disabled}
      $divider={false}
      $hasChildren={hasChildren}
      $depth={depth}
      className={className}
      tabIndex={disabled ? -1 : 0}
      role="menuitem"
      aria-disabled={disabled}
      style={style}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onFocus={handleFocus}
      data-option-value={value}
      {...props}
    >
      {icon && (
        <StyledIcon>
          {icon}
        </StyledIcon>
      )}

      <StyledLabel>
        {label}
      </StyledLabel>

      {hasChildren && (
        <StyledExpansion>
          {expansionIndicator}
        </StyledExpansion>
      )}
    </StyledDropdownItem>
  );
});

DropdownItem.displayName = 'DropdownItem';
