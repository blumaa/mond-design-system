import React, { forwardRef, ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { Box } from '../Box/Box';
import type { BoxProps } from '../Box/Box';
import { Icon } from '../Icon/Icon';

export interface TagProps extends Omit<BoxProps, 'children' | 'as'> {
  children: ReactNode;
  variant?: 'filled' | 'outlined' | 'ghost';
  semantic?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  removable?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  onRemove?: () => void;
}

interface StyledTagProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {
  $variant: 'filled' | 'outlined' | 'ghost';
  $semantic: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
  $size: 'sm' | 'md' | 'lg';
  $removable: boolean;
  $disabled: boolean;
  color?: string | number;
}

const StyledTag = styled(Box)<StyledTagProps>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[1]};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  white-space: nowrap;
  max-width: 100%;

  /* Size Variants */
  ${({ $size, $removable, theme }) => {
    switch ($size) {
      case 'sm':
        return css`
          font-size: ${theme.fontSizes.xs};
          padding: ${$removable ? `${theme.space[1]} ${theme.space[1]}` : `${theme.space[1]} ${theme.space[2]}`};
          height: 24px;
          border-radius: ${theme.radii.sm};
        `;
      case 'md':
        return css`
          font-size: ${theme.fontSizes.sm};
          padding: ${$removable ? `${theme.space[1]} ${theme.space[1]}` : `${theme.space[1]} ${theme.space[3]}`};
          height: 28px;
          border-radius: ${theme.radii.md};
        `;
      case 'lg':
        return css`
          font-size: ${theme.fontSizes.base};
          padding: ${$removable ? `${theme.space[2]} ${theme.space[1]}` : `${theme.space[2]} ${theme.space[4]}`};
          height: 36px;
          border-radius: ${theme.radii.lg};
        `;
      default:
        return css`
          font-size: ${theme.fontSizes.sm};
          padding: ${$removable ? `${theme.space[1]} ${theme.space[1]}` : `${theme.space[1]} ${theme.space[3]}`};
          height: 28px;
          border-radius: ${theme.radii.md};
        `;
    }
  }}

  /* Variant and Semantic Color Combinations */
  ${({ $variant, $semantic, theme }) => {
    if ($variant === 'filled') {
      switch ($semantic) {
        case 'default':
          return css`
            background-color: ${theme.colors.tagDefaultFilledBg};
            color: ${theme.colors.tagDefaultFilledText};
            border: none;
          `;
        case 'primary':
          return css`
            background-color: ${theme.colors.tagPrimaryFilledBg};
            color: ${theme.colors.tagPrimaryFilledText};
            border: none;
          `;
        case 'success':
          return css`
            background-color: ${theme.colors.tagSuccessFilledBg};
            color: ${theme.colors.tagSuccessFilledText};
            border: none;
          `;
        case 'warning':
          return css`
            background-color: ${theme.colors.tagWarningFilledBg};
            color: ${theme.colors.tagWarningFilledText};
            border: none;
          `;
        case 'error':
          return css`
            background-color: ${theme.colors.tagErrorFilledBg};
            color: ${theme.colors.tagErrorFilledText};
            border: none;
          `;
        case 'info':
          return css`
            background-color: ${theme.colors.tagInfoFilledBg};
            color: ${theme.colors.tagInfoFilledText};
            border: none;
          `;
      }
    } else if ($variant === 'outlined') {
      switch ($semantic) {
        case 'default':
          return css`
            background-color: transparent;
            color: ${theme.colors.tagDefaultOutlinedText};
            border: 1px solid ${theme.colors.tagDefaultOutlinedBorder};
          `;
        case 'primary':
          return css`
            background-color: transparent;
            color: ${theme.colors.tagPrimaryOutlinedText};
            border: 1px solid ${theme.colors.tagPrimaryOutlinedBorder};
          `;
        case 'success':
          return css`
            background-color: transparent;
            color: ${theme.colors.tagSuccessOutlinedText};
            border: 1px solid ${theme.colors.tagSuccessOutlinedBorder};
          `;
        case 'warning':
          return css`
            background-color: transparent;
            color: ${theme.colors.tagWarningOutlinedText};
            border: 1px solid ${theme.colors.tagWarningOutlinedBorder};
          `;
        case 'error':
          return css`
            background-color: transparent;
            color: ${theme.colors.tagErrorOutlinedText};
            border: 1px solid ${theme.colors.tagErrorOutlinedBorder};
          `;
        case 'info':
          return css`
            background-color: transparent;
            color: ${theme.colors.tagInfoOutlinedText};
            border: 1px solid ${theme.colors.tagInfoOutlinedBorder};
          `;
      }
    } else if ($variant === 'ghost') {
      switch ($semantic) {
        case 'default':
          return css`
            background-color: transparent;
            color: ${theme.colors.tagDefaultGhostText};
            border: none;
          `;
        case 'primary':
          return css`
            background-color: ${theme.colors.tagPrimaryGhostBg};
            color: ${theme.colors.tagPrimaryGhostText};
            border: none;
          `;
        case 'success':
          return css`
            background-color: ${theme.colors.tagSuccessGhostBg};
            color: ${theme.colors.tagSuccessGhostText};
            border: none;
          `;
        case 'warning':
          return css`
            background-color: ${theme.colors.tagWarningGhostBg};
            color: ${theme.colors.tagWarningGhostText};
            border: none;
          `;
        case 'error':
          return css`
            background-color: ${theme.colors.tagErrorGhostBg};
            color: ${theme.colors.tagErrorGhostText};
            border: none;
          `;
        case 'info':
          return css`
            background-color: ${theme.colors.tagInfoGhostBg};
            color: ${theme.colors.tagInfoGhostText};
            border: none;
          `;
      }
    }
  }}

  /* Disabled State */
  ${({ $disabled, theme }) =>
    $disabled &&
    css`
      cursor: not-allowed;
      opacity: 0.6;
      background-color: ${theme.colors.tagDisabledBg};
      color: ${theme.colors.tagDisabledText};
      border-color: ${theme.colors.tagDisabledBorder};
    `}
`;

const TagText = styled(Box)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
`;

const RemoveButton = styled(Box).attrs({ as: 'button' })`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: currentColor;
  opacity: 0.7;
  padding: 0;
  margin-left: ${({ theme }) => theme.space[1]};
  transition: opacity 0.2s ease;

  &:hover:not(:disabled) {
    opacity: 1;
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const getIconSize = (size: string) => {
  const sizeMap = {
    sm: 'xs' as const,
    md: 'sm' as const,
    lg: 'md' as const,
  };
  return sizeMap[size as keyof typeof sizeMap] || 'sm' as const;
};

export const Tag = forwardRef<HTMLElement, TagProps>(({
  children,
  variant = 'filled',
  semantic = 'default',
  size = 'md',
  removable = false,
  disabled = false,
  icon,
  onRemove,
  className = '',
  ...props
}, ref) => {
  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled && onRemove) {
      onRemove();
    }
  };

  const handleRemoveKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled && onRemove) {
      e.preventDefault();
      e.stopPropagation();
      onRemove();
    }
  };

  const iconSize = getIconSize(size);

  return (
    <StyledTag
      ref={ref as React.Ref<HTMLElement>}
      $variant={variant}
      $semantic={semantic}
      $size={size}
      $removable={removable}
      $disabled={disabled}
      className={className}
      data-variant={variant}
      data-semantic={semantic}
      data-size={size}
      data-removable={removable}
      data-disabled={disabled}
      {...props}
    >
      {icon && (
        <Icon size={iconSize}>
          {icon}
        </Icon>
      )}

      <TagText>
        {children}
      </TagText>

      {removable && (
        <RemoveButton
          type="button"
          onClick={handleRemoveClick}
          onKeyDown={handleRemoveKeyDown}
          disabled={disabled}
          aria-label="Remove tag"
          tabIndex={disabled ? -1 : 0}
        >
          <Icon size="xs">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M9 3L3 9M3 3L9 9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Icon>
        </RemoveButton>
      )}
    </StyledTag>
  );
});

Tag.displayName = 'Tag';
