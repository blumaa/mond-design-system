import React from 'react';
import styled, { css } from 'styled-components';
import { Box } from '../Box/Box';
import type { BoxProps } from '../Box/Box';

export type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends Omit<BoxProps, 'size'> {
  'data-testid'?: string;
  /**
   * Badge variant
   * @default 'default'
   */
  variant?: BadgeVariant;

  /**
   * Badge size
   * @default 'md'
   */
  size?: BadgeSize;

  /**
   * Badge content
   */
  children: React.ReactNode;
}

// Styled Badge Component
const StyledBadge = styled(Box).attrs({ as: 'span' })<BadgeProps>`
  /* Layout */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;

  /* Typography */
  font-family: ${({ theme }) => theme.fonts.sans};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  text-align: center;
  white-space: nowrap;
  user-select: none;

  /* Shape */
  border-radius: ${({ theme }) => theme.radii.full};

  /* Animation */
  transition: all 150ms ease;

  /* === SIZES === */

  /* Small Size */
  ${({ size, theme }) =>
    size === 'sm' &&
    css`
      font-size: ${theme.fontSizes.xs};
      padding: ${theme.space[1]} ${theme.space[2]};
      height: 20px;
    `}

  /* Medium Size (Default) */
  ${({ size, theme }) =>
    (size === 'md' || !size) &&
    css`
      font-size: ${theme.fontSizes.sm};
      padding: ${theme.space[1]} ${theme.space[3]};
      height: 24px;
    `}

  /* Large Size */
  ${({ size, theme }) =>
    size === 'lg' &&
    css`
      font-size: ${theme.fontSizes.base};
      padding: ${theme.space[2]} ${theme.space[4]};
      height: 32px;
    `}

  /* === VARIANTS === */

  /* Default Variant */
  ${({ variant, theme }) =>
    (variant === 'default' || !variant) &&
    css`
      background-color: ${theme.colors.surfaceElevated};
      color: ${theme.colors.textSecondary};
      border: 1px solid ${theme.colors.borderDefault};
    `}

  /* Primary Variant */
  ${({ variant, theme }) =>
    variant === 'primary' &&
    css`
      background-color: ${theme.colors.brandPrimary600};
      color: ${theme.colors.white50};
      border: none;
    `}

  /* Secondary Variant */
  ${({ variant, theme }) =>
    variant === 'secondary' &&
    css`
      background-color: ${theme.colors.surfaceElevated};
      color: ${theme.colors.textPrimary};
      border: 1px solid ${theme.colors.borderSubtle};
    `}

  /* Success Variant */
  ${({ variant, theme }) =>
    variant === 'success' &&
    css`
      background-color: ${theme.colors.brandSuccess600};
      color: ${theme.colors.white50};
      border: 1px solid ${theme.colors.brandSuccess600};
      box-shadow: ${theme.shadows['glow-success']};
    `}

  /* Warning Variant */
  ${({ variant, theme }) =>
    variant === 'warning' &&
    css`
      background-color: ${theme.colors.brandWarning500};
      color: ${theme.colors.black900};
      border: 1px solid ${theme.colors.brandWarning600};
    `}

  /* Error Variant */
  ${({ variant, theme }) =>
    variant === 'error' &&
    css`
      background-color: ${theme.colors.brandError500};
      color: ${theme.colors.white50};
      border: 1px solid ${theme.colors.brandError600};
    `}
`;

/**
 * Badge Component
 *
 * A small status indicator or label that uses styled-components for theming.
 * Supports multiple variants and sizes.
 *
 * **Theme-Aware**: Uses theme object from styled-components ThemeProvider
 * **SSR-Compatible**: Styles are generated at build time
 *
 * @example
 * // Primary badge
 * <Badge variant="primary">New</Badge>
 *
 * @example
 * // Success badge with custom size
 * <Badge variant="success" size="lg">Verified</Badge>
 *
 * @example
 * // Badge with number
 * <Badge variant="error" size="sm">99+</Badge>
 */
export const Badge = React.forwardRef<HTMLElement, BadgeProps>(
  (
    {
      variant = 'default',
      size = 'md',
      children,
      'data-testid': dataTestId,
      ...props
    },
    ref,
  ) => {
    return (
      <StyledBadge
        ref={ref as React.Ref<HTMLElement>}
        variant={variant}
        size={size}
        data-testid={dataTestId}
        data-variant={variant}
        data-size={size}
        {...props}
      >
        {children}
      </StyledBadge>
    );
  },
);

Badge.displayName = 'Badge';
