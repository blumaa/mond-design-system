import React, { useState, ReactNode } from 'react';
import styled, { css } from 'styled-components';

export type AccordionItemSize = 'sm' | 'md' | 'lg';
export type AccordionItemVariant = 'default' | 'bordered' | 'filled';

export interface AccordionItemProps {
  title: ReactNode;
  children: ReactNode;
  expanded?: boolean;
  disabled?: boolean;
  size?: AccordionItemSize;
  variant?: AccordionItemVariant;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  animated?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  itemId?: string;
  className?: string;
  style?: React.CSSProperties;
}

interface StyledAccordionItemProps {
  $variant: AccordionItemVariant;
  $expanded: boolean;
  $disabled: boolean;
}

const StyledAccordionItem = styled.div<StyledAccordionItemProps>`
  transition: all 150ms ease;

  /* Variant: default */
  ${({ $variant, theme }) =>
    $variant === 'default' &&
    css`
      border: 1px solid ${theme.colors.borderDefault};
      border-bottom: none;

      &:last-child {
        border-bottom: 1px solid ${theme.colors.borderDefault};
      }
    `}

  /* Variant: bordered */
  ${({ $variant, theme }) =>
    $variant === 'bordered' &&
    css`
      border: none;
      border-bottom: 1px solid ${theme.colors.borderDefault};

      &:last-child {
        border-bottom: none;
      }
    `}

  /* Variant: filled */
  ${({ $variant, theme }) =>
    $variant === 'filled' &&
    css`
      border: none;
      margin-bottom: ${theme.space[2]};
    `}
`;

interface StyledHeaderProps {
  $variant: AccordionItemVariant;
  $size: AccordionItemSize;
}

const StyledHeader = styled.button<StyledHeaderProps>`
  display: flex;
  align-items: center;
  width: 100%;
  border: none;
  cursor: pointer;
  transition: background-color 150ms ease;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  text-align: left;
  color: ${({ theme }) => theme.colors.textPrimary};

  /* Variant background colors */
  ${({ $variant, theme }) =>
    $variant === 'default' &&
    css`
      background-color: transparent;

      &:hover:not(:disabled) {
        background-color: ${theme.colors.gray100};
      }
    `}

  ${({ $variant, theme }) =>
    $variant === 'bordered' &&
    css`
      background-color: transparent;

      &:hover:not(:disabled) {
        background-color: ${theme.colors.gray100};
      }
    `}

  ${({ $variant, theme }) =>
    $variant === 'filled' &&
    css`
      background-color: ${theme.colors.surfaceElevated};

      &:hover:not(:disabled) {
        background-color: ${theme.colors.gray100};
      }
    `}

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  /* Size variants */
  ${({ $size, theme }) =>
    $size === 'sm' &&
    css`
      padding: ${theme.space[2]} ${theme.space[3]};
      font-size: ${theme.fontSizes.sm};
    `}

  ${({ $size, theme }) =>
    $size === 'md' &&
    css`
      padding: ${theme.space[3]} ${theme.space[4]};
      font-size: ${theme.fontSizes.base};
    `}

  ${({ $size, theme }) =>
    $size === 'lg' &&
    css`
      padding: ${theme.space[4]} ${theme.space[6]};
      font-size: ${theme.fontSizes.lg};
    `}
`;

const StyledTitle = styled.div`
  flex: 1;
`;

interface StyledIconProps {
  $position: 'left' | 'right';
  $expanded: boolean;
}

const StyledIcon = styled.div<StyledIconProps>`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  transition: transform 150ms ease;

  ${({ $position, theme }) =>
    $position === 'left' &&
    css`
      margin-right: ${theme.space[2]};
    `}

  ${({ $position, theme }) =>
    $position === 'right' &&
    css`
      margin-left: ${theme.space[2]};
    `}

  ${({ $expanded }) =>
    $expanded &&
    css`
      transform: rotate(180deg);
    `}
`;

interface StyledContentProps {
  $expanded: boolean;
  $animated: boolean;
}

const StyledContent = styled.div<StyledContentProps>`
  overflow: hidden;
  max-height: 0;
  opacity: 0;

  ${({ $animated }) =>
    $animated
      ? css`
          transition: max-height 150ms ease, opacity 150ms ease;
        `
      : css`
          transition: none;
        `}

  ${({ $expanded }) =>
    $expanded &&
    css`
      max-height: 2000px;
      opacity: 1;
    `}
`;

interface StyledContentInnerProps {
  $variant: AccordionItemVariant;
  $size: AccordionItemSize;
}

const StyledContentInner = styled.div<StyledContentInnerProps>`
  color: ${({ theme }) => theme.colors.textSecondary};

  /* Variant styles */
  ${({ $variant, theme }) =>
    $variant === 'default' &&
    css`
      padding: ${theme.space[4]};
      background-color: transparent;
    `}

  ${({ $variant, theme }) =>
    $variant === 'bordered' &&
    css`
      padding: ${theme.space[4]};
      background-color: transparent;
    `}

  ${({ $variant, theme }) =>
    $variant === 'filled' &&
    css`
      padding: ${theme.space[4]};
      background-color: ${theme.colors.surfaceBackground};
    `}

  /* Size variants override padding */
  ${({ $size, theme }) =>
    $size === 'sm' &&
    css`
      padding: ${theme.space[2]} ${theme.space[3]};
    `}

  ${({ $size, theme }) =>
    $size === 'md' &&
    css`
      padding: ${theme.space[3]} ${theme.space[4]};
    `}

  ${({ $size, theme }) =>
    $size === 'lg' &&
    css`
      padding: ${theme.space[4]} ${theme.space[6]};
    `}
`;

const DefaultIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <polyline points="6,9 12,15 18,9" />
  </svg>
);

export const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(({
  title,
  children,
  expanded,
  disabled = false,
  size = 'md',
  variant = 'default',
  icon,
  iconPosition = 'right',
  animated = true,
  defaultExpanded = false,
  onExpandedChange,
  itemId,
  className = '',
  style,
  ...props
}, ref) => {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const isExpanded = expanded !== undefined ? expanded : internalExpanded;

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

  return (
    <StyledAccordionItem
      ref={ref}
      $variant={variant}
      $expanded={isExpanded}
      $disabled={disabled}
      className={className}
      style={style}
      {...props}
    >
      <StyledHeader
        type="button"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        $variant={variant}
        $size={size}
        aria-expanded={isExpanded}
        aria-controls={itemId ? `${itemId}-content` : undefined}
        aria-disabled={disabled}
        data-accordion-header={itemId}
      >
        {iconPosition === 'left' && (
          <StyledIcon $position="left" $expanded={isExpanded}>
            {icon || <DefaultIcon />}
          </StyledIcon>
        )}

        <StyledTitle>
          {title}
        </StyledTitle>

        {iconPosition === 'right' && (
          <StyledIcon $position="right" $expanded={isExpanded}>
            {icon || <DefaultIcon />}
          </StyledIcon>
        )}
      </StyledHeader>

      <StyledContent
        id={itemId ? `${itemId}-content` : undefined}
        $expanded={isExpanded}
        $animated={animated}
        aria-hidden={!isExpanded}
      >
        <StyledContentInner $variant={variant} $size={size}>
          {children}
        </StyledContentInner>
      </StyledContent>
    </StyledAccordionItem>
  );
});

AccordionItem.displayName = 'AccordionItem';
