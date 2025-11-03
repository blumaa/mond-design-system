import { forwardRef } from 'react';
import styled, { css } from 'styled-components';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type HeadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';

export type HeadingWeight = 'normal' | 'medium' | 'semibold' | 'bold';

export type HeadingSemantic =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'inverse';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /**
   * Heading level (h1-h6)
   * @default 1
   */
  level?: HeadingLevel;

  /**
   * Custom size override (independent of level)
   */
  size?: HeadingSize;

  /**
   * Font weight
   * @default 'bold'
   */
  weight?: HeadingWeight;

  /**
   * Semantic color variant
   * @default 'primary'
   */
  semantic?: HeadingSemantic;

  /**
   * Text alignment
   */
  align?: 'left' | 'center' | 'right';

  /**
   * Truncate text with ellipsis
   * @default false
   */
  truncate?: boolean;

  /**
   * Heading content
   */
  children: React.ReactNode;

  /**
   * Custom color override
   */
  color?: string;
}

interface StyledHeadingProps {
  $size: HeadingSize;
  $weight: HeadingWeight;
  $semantic: HeadingSemantic;
  $align?: 'left' | 'center' | 'right';
  $truncate: boolean;
  $color?: string;
}

const StyledHeading = styled.h1<StyledHeadingProps>`
  /* Reset */
  margin: 0;
  padding: 0;

  /* Base Styles */
  font-family: ${({ theme }) => theme.fonts.sans};
  font-weight: ${({ theme, $weight }) => theme.fontWeights[$weight]};
  text-align: ${({ $align }) => $align || 'left'};

  /* Truncation */
  ${({ $truncate }) =>
    $truncate &&
    css`
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    `}

  /* === SIZES === */

  ${({ $size, theme }) =>
    $size === 'xs' &&
    css`
      font-size: ${theme.fontSizes.xs};
      line-height: ${theme.lineHeights.tight};
    `}

  ${({ $size, theme }) =>
    $size === 'sm' &&
    css`
      font-size: ${theme.fontSizes.sm};
      line-height: ${theme.lineHeights.tight};
    `}

  ${({ $size, theme }) =>
    $size === 'md' &&
    css`
      font-size: ${theme.fontSizes.base};
      line-height: ${theme.lineHeights.tight};
    `}

  ${({ $size, theme }) =>
    $size === 'lg' &&
    css`
      font-size: ${theme.fontSizes.lg};
      line-height: ${theme.lineHeights.tight};
    `}

  ${({ $size, theme }) =>
    $size === 'xl' &&
    css`
      font-size: ${theme.fontSizes.xl};
      line-height: ${theme.lineHeights.tight};
    `}

  ${({ $size, theme }) =>
    $size === '2xl' &&
    css`
      font-size: ${theme.fontSizes['2xl']};
      line-height: ${theme.lineHeights.tight};
    `}

  ${({ $size, theme }) =>
    $size === '3xl' &&
    css`
      font-size: ${theme.fontSizes['3xl']};
      line-height: ${theme.lineHeights.tight};
    `}

  ${({ $size, theme }) =>
    $size === '4xl' &&
    css`
      font-size: ${theme.fontSizes['4xl']};
      line-height: ${theme.lineHeights.none};
    `}

  ${({ $size, theme }) =>
    $size === '5xl' &&
    css`
      font-size: ${(theme.fontSizes as Record<string, string>)['5xl']};
      line-height: ${theme.lineHeights.none};
    `}

  ${({ $size, theme }) =>
    $size === '6xl' &&
    css`
      font-size: ${(theme.fontSizes as Record<string, string>)['6xl']};
      line-height: ${theme.lineHeights.none};
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
      : $semantic === 'inverse'
      ? css`
          color: ${theme.colors.textInverse};
        `
      : css`
          color: ${theme.colors.textPrimary};
        `}
`;

const getDefaultSizeForLevel = (level: HeadingLevel): HeadingSize => {
  const levelSizeMap: Record<HeadingLevel, HeadingSize> = {
    1: '4xl',
    2: '3xl',
    3: '2xl',
    4: 'xl',
    5: 'lg',
    6: 'md',
  };

  return levelSizeMap[level];
};

/**
 * Heading Component
 *
 * A semantic heading component (h1-h6) with flexible sizing and styling.
 * Uses styled-components for theming.
 *
 * **Theme-Aware**: Uses theme object from styled-components ThemeProvider
 * **SSR-Compatible**: Styles are generated at build time
 *
 * @example
 * // H1 with default sizing
 * <Heading level={1}>Page Title</Heading>
 *
 * @example
 * // H2 with custom size
 * <Heading level={2} size="4xl">Large Subtitle</Heading>
 *
 * @example
 * // Semantic colors
 * <Heading semantic="secondary">Secondary Heading</Heading>
 */
export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      level = 1,
      size,
      weight = 'bold',
      semantic = 'primary',
      align,
      truncate = false,
      children,
      className,
      color,
      ...props
    },
    ref,
  ) => {
    const effectiveSize = size || getDefaultSizeForLevel(level);
    const headingElement = `h${level}` as keyof Pick<
      JSX.IntrinsicElements,
      'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
    >;

    return (
      <StyledHeading
        ref={ref}
        as={headingElement}
        $size={effectiveSize}
        $weight={weight}
        $semantic={semantic}
        $align={align}
        $truncate={truncate}
        $color={color}
        className={className}
        data-size={effectiveSize}
        data-semantic={semantic}
        {...props}
      >
        {children}
      </StyledHeading>
    );
  },
);

Heading.displayName = 'Heading';
