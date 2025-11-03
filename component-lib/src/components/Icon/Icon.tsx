import { forwardRef } from 'react';
import styled, { css } from 'styled-components';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface IconProps extends Omit<React.HTMLAttributes<HTMLElement>, 'color'> {
  /**
   * Icon size
   * @default 'md'
   */
  size?: IconSize;

  /**
   * SVG element to display
   */
  children: React.ReactNode;

  /**
   * Icon color - accepts any CSS color value
   * @default 'currentColor'
   * @example
   * <Icon color="#ef4444"><HeartIcon /></Icon>
   * <Icon color="var(--custom-color)"><HeartIcon /></Icon>
   */
  color?: string;

  /**
   * Accessible label for the icon
   */
  label?: string;

  /**
   * Whether the icon is decorative (hidden from screen readers)
   * @default false
   */
  decorative?: boolean;

  /**
   * Custom className
   */
  className?: string;
}

interface StyledIconProps {
  $size: IconSize;
  $color?: string;
}

const StyledIcon = styled.span<StyledIconProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  flex-shrink: 0;
  color: ${({ theme, $color }) => $color || theme.colors.iconPrimary};

  /* Style the SVG child */
  > svg {
    display: block;
    width: 100%;
    height: 100%;
  }

  /* === SIZE VARIANTS === */

  ${({ $size }) =>
    $size === 'xs' &&
    css`
      width: 12px;
      height: 12px;
    `}

  ${({ $size }) =>
    $size === 'sm' &&
    css`
      width: 16px;
      height: 16px;
    `}

  ${({ $size }) =>
    ($size === 'md' || !$size) &&
    css`
      width: 20px;
      height: 20px;
    `}

  ${({ $size }) =>
    $size === 'lg' &&
    css`
      width: 24px;
      height: 24px;
    `}

  ${({ $size }) =>
    $size === 'xl' &&
    css`
      width: 32px;
      height: 32px;
    `}

  ${({ $size }) =>
    $size === '2xl' &&
    css`
      width: 40px;
      height: 40px;
    `}
`;

/**
 * Icon Component
 *
 * A wrapper component for SVG icons with consistent sizing and styling.
 * Uses styled-components for theming.
 *
 * **Theme-Aware**: Uses theme object from styled-components ThemeProvider
 * **SSR-Compatible**: Styles are generated at build time
 *
 * @example
 * // Basic usage
 * <Icon size="md">
 *   <svg>...</svg>
 * </Icon>
 *
 * @example
 * // With accessibility label
 * <Icon size="lg" label="Settings">
 *   <SettingsIcon />
 * </Icon>
 *
 * @example
 * // Decorative icon (hidden from screen readers)
 * <Icon decorative>
 *   <DecorativeIcon />
 * </Icon>
 */
export const Icon = forwardRef<HTMLElement, IconProps>(
  (
    {
      size = 'md',
      children,
      color,
      label,
      decorative = false,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <StyledIcon
        ref={ref as React.Ref<HTMLSpanElement>}
        $size={size}
        $color={color}
        className={className}
        aria-label={!decorative && label ? label : undefined}
        aria-hidden={decorative}
        role={decorative ? 'presentation' : 'img'}
        data-size={size}
        {...props}
      >
        {children}
      </StyledIcon>
    );
  },
);

Icon.displayName = 'Icon';
