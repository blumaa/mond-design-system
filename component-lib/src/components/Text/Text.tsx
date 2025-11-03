import { forwardRef } from 'react';
import styled, { css } from 'styled-components';

export type TextVariant =
  | 'display'
  | 'headline'
  | 'title'
  | 'subtitle'
  | 'body'
  | 'body-sm'
  | 'caption'
  | 'overline'
  | 'code'
  // Legacy variants (for backward compatibility)
  | 'body-lg'
  | 'body-md';

export type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';

export type TextAlign = 'left' | 'center' | 'right' | 'justify';

export type TextSemantic =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'disabled'
  | 'inverse'
  | 'link'
  | 'success'
  | 'warning'
  | 'error'
  | 'accent';

export interface TextProps {
  /**
   * Text variant that controls size and line height
   * @default 'body-md'
   */
  variant?: TextVariant;

  /**
   * Font weight
   * @default 'normal'
   */
  weight?: TextWeight;

  /**
   * Text alignment
   */
  align?: TextAlign;

  /**
   * Semantic text color
   * @default 'primary'
   */
  semantic?: TextSemantic;

  /**
   * Whether text is italic
   * @default false
   */
  italic?: boolean;

  /**
   * Whether text is underlined
   * @default false
   */
  underline?: boolean;

  /**
   * Whether text is struck through
   * @default false
   */
  strikethrough?: boolean;

  /**
   * Truncate text with ellipsis
   * @default false
   */
  truncate?: boolean;

  /**
   * HTML element or component to render as
   * @default 'span'
   */
  as?: React.ElementType;

  /**
   * Text content
   */
  children: React.ReactNode;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Custom color override
   */
  color?: string;

  // Allow additional props
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface StyledTextProps {
  $variant: TextVariant;
  $weight: TextWeight;
  $align?: TextAlign;
  $semantic: TextSemantic;
  $italic: boolean;
  $underline: boolean;
  $strikethrough: boolean;
  $truncate: boolean;
  $color?: string;
}

const StyledText = styled.span<StyledTextProps>`
  /* Reset */
  margin: 0;
  padding: 0;

  /* Base Styles */
  font-family: ${({ theme, $variant }) =>
    $variant === 'code' ? theme.fonts.mono : theme.fonts.sans};
  font-style: ${({ $italic }) => ($italic ? 'italic' : 'normal')};
  text-align: ${({ $align }) => $align || 'left'};

  /* Text Decorations */
  text-decoration: ${({ $underline, $strikethrough }) => {
    const decorations = [];
    if ($underline) decorations.push('underline');
    if ($strikethrough) decorations.push('line-through');
    return decorations.length > 0 ? decorations.join(' ') : 'none';
  }};

  /* Truncation */
  ${({ $truncate }) =>
    $truncate &&
    css`
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    `}

  /* === VARIANT STYLES === */

  ${({ $variant, theme }) =>
    $variant === 'display' &&
    css`
      font-size: ${theme.fontSizes['4xl']};
      line-height: ${theme.lineHeights.tight};
      font-weight: ${theme.fontWeights.bold};
      letter-spacing: ${theme.letterSpacings.tight};
    `}

  ${({ $variant, theme }) =>
    $variant === 'headline' &&
    css`
      font-size: ${theme.fontSizes['3xl']};
      line-height: ${theme.lineHeights.tight};
      font-weight: ${theme.fontWeights.bold};
      letter-spacing: ${theme.letterSpacings.tight};
    `}

  ${({ $variant, theme }) =>
    $variant === 'title' &&
    css`
      font-size: ${theme.fontSizes['2xl']};
      line-height: ${theme.lineHeights.normal};
      font-weight: ${theme.fontWeights.semibold};
      letter-spacing: ${theme.letterSpacings.normal};
    `}

  ${({ $variant, theme }) =>
    $variant === 'subtitle' &&
    css`
      font-size: ${theme.fontSizes.xl};
      line-height: ${theme.lineHeights.normal};
      font-weight: ${theme.fontWeights.medium};
      letter-spacing: ${theme.letterSpacings.normal};
    `}

  ${({ $variant, theme }) =>
    $variant === 'body' &&
    css`
      font-size: ${theme.fontSizes.base};
      line-height: ${theme.lineHeights.relaxed};
      font-weight: ${theme.fontWeights.normal};
      letter-spacing: ${theme.letterSpacings.normal};
    `}

  ${({ $variant, theme }) =>
    $variant === 'body-sm' &&
    css`
      font-size: ${theme.fontSizes.sm};
      line-height: ${theme.lineHeights.relaxed};
      font-weight: ${theme.fontWeights.normal};
      letter-spacing: ${theme.letterSpacings.normal};
    `}

  ${({ $variant, theme }) =>
    $variant === 'caption' &&
    css`
      font-size: ${theme.fontSizes.xs};
      line-height: ${theme.lineHeights.normal};
      font-weight: ${theme.fontWeights.normal};
      letter-spacing: ${theme.letterSpacings.wide};
    `}

  ${({ $variant, theme }) =>
    $variant === 'overline' &&
    css`
      font-size: ${theme.fontSizes.xs};
      line-height: ${theme.lineHeights.normal};
      font-weight: ${theme.fontWeights.semibold};
      letter-spacing: ${theme.letterSpacings.wide};
      text-transform: uppercase;
    `}

  ${({ $variant, theme }) =>
    $variant === 'code' &&
    css`
      font-size: ${theme.fontSizes.sm};
      line-height: ${theme.lineHeights.normal};
      font-weight: ${theme.fontWeights.normal};
      letter-spacing: ${theme.letterSpacings.normal};
      font-family: ${theme.fonts.mono};
    `}

  /* Legacy Variants */
  ${({ $variant }) =>
    $variant === 'body-lg' &&
    css`
      font-size: 1.125rem; /* 18px */
      line-height: 1.625;
      font-weight: 400;
      letter-spacing: normal;
    `}

  ${({ $variant }) =>
    $variant === 'body-md' &&
    css`
      font-size: 1rem; /* 16px */
      line-height: 1.5;
      font-weight: 400;
      letter-spacing: normal;
    `}

  /* === SEMANTIC COLORS === */

  ${({ $semantic, $color, theme }) =>
    $color
      ? css`
          color: ${$color};
        `
      : $semantic === 'primary'
      ? css`
          color: ${theme.colors.textPrimary};
        `
      : $semantic === 'secondary'
      ? css`
          color: ${theme.colors.textSecondary};
        `
      : $semantic === 'tertiary'
      ? css`
          color: ${theme.colors.textTertiary};
        `
      : $semantic === 'disabled'
      ? css`
          color: ${theme.colors.textDisabled};
        `
      : $semantic === 'inverse'
      ? css`
          color: ${theme.colors.textInverse};
        `
      : $semantic === 'link'
      ? css`
          color: ${theme.colors.textLink};
        `
      : $semantic === 'success'
      ? css`
          color: ${theme.colors.textSuccess};
        `
      : $semantic === 'warning'
      ? css`
          color: ${theme.colors.textWarning};
        `
      : $semantic === 'error'
      ? css`
          color: ${theme.colors.textError};
        `
      : $semantic === 'accent'
      ? css`
          color: ${theme.colors.textAccent};
        `
      : css`
          color: ${theme.colors.textPrimary};
        `}

  /* Font Weight - Applied last to override variant styles */
  font-weight: ${({ theme, $weight }) => theme.fontWeights[$weight]};
`;

/**
 * Text Component
 *
 * A flexible text component that supports multiple variants, semantic colors,
 * and text modifiers. Uses styled-components for theming.
 *
 * **Theme-Aware**: Uses theme object from styled-components ThemeProvider
 * **SSR-Compatible**: Styles are generated at build time
 *
 * @example
 * // Display text
 * <Text variant="display">Large Display Text</Text>
 *
 * @example
 * // Semantic colored text
 * <Text semantic="error" weight="bold">Error Message</Text>
 *
 * @example
 * // Text with modifiers
 * <Text variant="body" italic underline>Italic Underlined</Text>
 *
 * @example
 * // Custom element type
 * <Text as="p" variant="body">Paragraph text</Text>
 */
export const Text = forwardRef<HTMLElement, TextProps>(
  (
    {
      variant = 'body-md',
      weight = 'normal',
      align,
      semantic = 'primary',
      italic = false,
      underline = false,
      strikethrough = false,
      truncate = false,
      as = 'span',
      children,
      className,
      color,
      ...props
    },
    ref,
  ) => {
    return (
      <StyledText
        ref={ref}
        as={as}
        $variant={variant}
        $weight={weight}
        $align={align}
        $semantic={semantic}
        $italic={italic}
        $underline={underline}
        $strikethrough={strikethrough}
        $truncate={truncate}
        $color={color}
        className={className}
        data-variant={variant}
        data-semantic={semantic}
        {...props}
      >
        {children}
      </StyledText>
    );
  },
);

Text.displayName = 'Text';
