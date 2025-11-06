import React from 'react';
import styled, { css } from 'styled-components';

export type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'destructive' | 'warning';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonCorners = 'default' | 'rounded';
export type ButtonAlignContent = 'left' | 'center' | 'right';

export interface ButtonProps {
  /**
   * Element type to render as
   * @default 'button'
   */
  as?: React.ElementType;

  /**
   * Button variant
   * @default 'primary'
   */
  variant?: ButtonVariant;

  /**
   * Button size
   * @default 'md'
   */
  size?: ButtonSize;

  /**
   * Button corner style
   * @default 'default'
   */
  corners?: ButtonCorners;

  /**
   * Content alignment within the button
   * @default 'center'
   */
  alignContent?: ButtonAlignContent;

  /**
   * Button content - optional for icon-only buttons
   */
  children?: React.ReactNode;

  /**
   * Icon-only button (no text content)
   * @default false
   */
  iconOnly?: boolean;

  /**
   * Button expands to fill container width
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Is button disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Click event handler
   */
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;

  /**
   * Mouse enter event handler
   */
  onMouseEnter?: (event: React.MouseEvent<HTMLElement>) => void;

  /**
   * Mouse leave event handler
   */
  onMouseLeave?: (event: React.MouseEvent<HTMLElement>) => void;

  /**
   * Focus event handler
   */
  onFocus?: (event: React.FocusEvent<HTMLElement>) => void;

  /**
   * Blur event handler
   */
  onBlur?: (event: React.FocusEvent<HTMLElement>) => void;

  /**
   * Accessible label for screen readers
   */
  'aria-label'?: string;

  /**
   * Indicates current item in navigation
   */
  'aria-current'?: 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false';

  /**
   * Test ID for testing purposes
   */
  'data-testid'?: string;

  /**
   * Button type for form interaction (only applies when as='button')
   * @default "button"
   */
  type?: 'button' | 'submit' | 'reset';

  /**
   * URL to link to (when as='a')
   */
  href?: string;

  /**
   * Link target (when as='a')
   */
  target?: string;

  /**
   * Link rel attribute (when as='a')
   */
  rel?: string;
}

// Styled component props interface using transient props to avoid React DOM warnings
interface StyledButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  corners?: ButtonCorners;
  $alignContent?: ButtonAlignContent;
  $iconOnly?: boolean;
  $fullWidth?: boolean;
  disabled?: boolean;
  as?: React.ElementType;
}

// Styled Button Component
const StyledButton = styled.button<StyledButtonProps>`
  /* Reset */
  margin: 0;
  border: none;
  text-decoration: none;

  /* Layout */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  white-space: nowrap;
  min-width: fit-content;
  gap: ${({ theme }) => theme.space[2]};

  /* Typography */
  font-family: ${({ theme }) => theme.fonts.sans};
  font-weight: ${({ theme }) => theme.fontWeights.medium};

  /* State */
  cursor: pointer;
  opacity: 1;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;

  /* Full Width */
  ${({ $fullWidth }) =>
    $fullWidth &&
    css`
      display: flex;
      width: 100%;
      min-width: auto;
    `}

  /* Disabled State */
  ${({ disabled }) =>
    disabled &&
    css`
      cursor: not-allowed;
      opacity: 0.6;
      pointer-events: none;
    `}

  /* === VARIANTS === */

  /* Primary Variant */
  ${({ variant, theme }) =>
    variant === 'primary' &&
    css`
      background-color: ${theme.colors.brandPrimary600};
      color: ${theme.colors.white50};
      border: none;

      &:hover:not(:disabled) {
        background-color: ${theme.colors.brandPrimary700};
      }

      &:active:not(:disabled) {
        background-color: ${theme.colors.brandPrimary700};
        opacity: 0.9;
      }

      &:focus-visible {
        outline: 2px solid ${theme.colors.borderFocused};
        outline-offset: 2px;
      }
    `}

  /* Outline Variant */
  ${({ variant, theme }) =>
    variant === 'outline' &&
    css`
      background-color: transparent;
      color: ${theme.colors.brandPrimary600};
      border: 1px solid ${theme.colors.brandPrimary600};

      &:hover:not(:disabled) {
        background-color: ${theme.colors.brandPrimary600};
        color: ${theme.colors.white50};
      }

      &:active:not(:disabled) {
        background-color: ${theme.colors.brandPrimary700};
        color: ${theme.colors.white50};
      }

      &:focus-visible {
        outline: 2px solid ${theme.colors.borderFocused};
        outline-offset: 2px;
      }
    `}

  /* Ghost Variant */
  ${({ variant, theme }) =>
    variant === 'ghost' &&
    css`
      background-color: transparent;
      color: ${theme.colors.textPrimary};
      border: none;

      &:hover:not(:disabled) {
        background-color: ${theme.colors.surfaceElevated};
      }

      &:active:not(:disabled) {
        background-color: ${theme.colors.surfaceCard};
      }

      &:focus-visible {
        outline: 2px solid ${theme.colors.borderDefault};
        outline-offset: 2px;
      }
    `}

  /* Destructive Variant */
  ${({ variant, theme }) =>
    variant === 'destructive' &&
    css`
      background-color: ${theme.colors.brandError500};
      color: #ffffff;
      border: none;

      &:hover:not(:disabled) {
        background-color: ${theme.colors.brandError700};
        filter: brightness(0.8);
      }

      &:active:not(:disabled) {
        filter: brightness(0.7);
      }

      &:focus-visible {
        outline: 2px solid ${theme.colors.borderFocused};
        outline-offset: 2px;
      }
    `}

  /* Warning Variant */
  ${({ variant, theme }) =>
    variant === 'warning' &&
    css`
      background-color: ${theme.colors.brandWarning500};
      color: #000000;
      border: none;

      &:hover:not(:disabled) {
        filter: brightness(0.9);
      }

      &:active:not(:disabled) {
        filter: brightness(0.8);
      }

      &:focus-visible {
        outline: 2px solid ${theme.colors.borderFocused};
        outline-offset: 2px;
      }
    `}

  /* === SIZES === */

  /* Small Size */
  ${({ size, theme, $iconOnly }) =>
    size === 'sm' &&
    css`
      padding: ${$iconOnly
        ? theme.space[1]
        : `${theme.space[1]} ${theme.space[2]}`};
      font-size: ${theme.fontSizes.sm};
      ${$iconOnly &&
      css`
        width: 32px;
        height: 32px;
      `}
    `}

  /* Medium Size (Default) */
  ${({ size, theme, $iconOnly }) =>
    (size === 'md' || !size) &&
    css`
      padding: ${$iconOnly
        ? theme.space[2]
        : `${theme.space[2]} ${theme.space[4]}`};
      font-size: ${theme.fontSizes.base};
      ${$iconOnly &&
      css`
        width: 40px;
        height: 40px;
      `}
    `}

  /* Large Size */
  ${({ size, theme, $iconOnly }) =>
    size === 'lg' &&
    css`
      padding: ${$iconOnly
        ? theme.space[3]
        : `${theme.space[3]} ${theme.space[6]}`};
      font-size: ${theme.fontSizes.lg};
      ${$iconOnly &&
      css`
        width: 48px;
        height: 48px;
      `}
    `}

  /* === CORNERS === */

  ${({ corners, theme }) =>
    corners === 'default' &&
    css`
      border-radius: ${theme.radii.md};
    `}

  ${({ corners, theme }) =>
    corners === 'rounded' &&
    css`
      border-radius: ${theme.radii.full};
    `}

  /* === ALIGNMENT === */

  ${({ $alignContent }) =>
    $alignContent === 'left' &&
    css`
      justify-content: flex-start;
    `}

  ${({ $alignContent }) =>
    $alignContent === 'center' &&
    css`
      justify-content: center;
    `}

  ${({ $alignContent }) =>
    $alignContent === 'right' &&
    css`
      justify-content: flex-end;
    `}

  /* === ICON ONLY === */

  ${({ $iconOnly, theme }) =>
    $iconOnly &&
    css`
      padding: ${theme.space[2]};
      min-width: auto;
      aspect-ratio: 1;
    `}

  /* Link styles (when rendered as anchor) */
  ${({ as }) =>
    as === 'a' &&
    css`
      text-decoration: none;

      &[aria-disabled='true'] {
        cursor: not-allowed;
        opacity: 0.6;
        pointer-events: none;
      }
    `}
`;

/**
 * Button Component
 *
 * A versatile, SSR-compatible button component using styled-components.
 * Supports multiple variants, sizes, and can render as different elements (polymorphic).
 *
 * **Theme-Aware**: Uses theme object from styled-components ThemeProvider
 * **SSR-Compatible**: Styles are generated at build time
 *
 * @example
 * // Primary button
 * <Button variant="primary" size="md">Click me</Button>
 *
 * @example
 * // Outline button with icon
 * <Button variant="outline" size="sm">
 *   <Icon /> Save
 * </Button>
 *
 * @example
 * // Icon-only button
 * <Button iconOnly aria-label="Delete">
 *   <TrashIcon />
 * </Button>
 *
 * @example
 * // Link styled as button
 * <Button as="a" href="/about">About</Button>
 *
 * @example
 * // Next.js Link (custom component)
 * import Link from 'next/link';
 * <Button as={Link} href="/dashboard">Dashboard</Button>
 */
export const Button = React.forwardRef<HTMLElement, ButtonProps>(
  (
    {
      as = 'button',
      variant = 'primary',
      size = 'md',
      corners = 'default',
      alignContent = 'center',
      children,
      iconOnly = false,
      fullWidth = false,
      disabled = false,
      onClick,
      onMouseEnter,
      onMouseLeave,
      onFocus,
      onBlur,
      'aria-label': ariaLabel,
      'aria-current': ariaCurrent,
      'data-testid': dataTestId,
      type = 'button',
      href,
      target,
      rel,
      ...rest
    },
    ref,
  ) => {
    // Base props common to all elements
    const baseProps = {
      ref,
      variant,
      size,
      corners,
      $alignContent: alignContent,
      $iconOnly: iconOnly,
      $fullWidth: fullWidth,
      disabled,
      onClick: disabled ? undefined : onClick,
      onMouseEnter,
      onMouseLeave,
      onFocus,
      onBlur,
      'aria-label': ariaLabel,
      'aria-current': ariaCurrent,
      'data-testid': dataTestId,
      'data-variant': variant,
      'data-size': size,
    };

    // Element-specific props based on 'as' prop
    if (as === 'button') {
      return (
        <StyledButton
          {...baseProps}
          as={as}
          type={type}
          disabled={disabled}
          ref={ref as React.Ref<HTMLButtonElement>}
        >
          {children}
        </StyledButton>
      );
    }

    if (as === 'a') {
      return (
        <StyledButton
          {...baseProps}
          as={as}
          href={disabled ? undefined : href}
          target={target}
          rel={rel}
          aria-disabled={disabled ? 'true' : undefined}
          onClick={disabled ? (e: React.MouseEvent) => e.preventDefault() : onClick}
          ref={ref as React.Ref<HTMLAnchorElement>}
        >
          {children}
        </StyledButton>
      );
    }

    // Custom element - pass through all additional props (e.g., href for Next.js Link)
    return (
      <StyledButton
        {...baseProps}
        {...rest}
        as={as}
        href={disabled ? undefined : href}
        aria-disabled={disabled ? 'true' : undefined}
        ref={ref as React.Ref<HTMLElement>}
      >
        {children}
      </StyledButton>
    );
  },
);

Button.displayName = 'Button';
