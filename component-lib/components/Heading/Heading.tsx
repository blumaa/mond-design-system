import React, { forwardRef } from 'react';
import './heading.css';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type HeadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';

export type HeadingWeight = 'thin' | 'extralight' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';

export type HeadingSemantic =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'inverse';

export interface HeadingProps {
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
   * Direct color token for custom colors
   * Format: 'blue.500' | 'gray.600' | 'brand.primary.700' | etc.
   * Overrides semantic color if both are provided
   * Use semantic colors when possible for theme consistency
   */
  color?: string;

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
   * Test ID for testing purposes
   */
  'data-testid'?: string;
}

const getDefaultSizeForLevel = (level: HeadingLevel): HeadingSize => {
  const levelSizeMap = {
    1: '4xl' as HeadingSize,
    2: '3xl' as HeadingSize,
    3: '2xl' as HeadingSize,
    4: 'xl' as HeadingSize,
    5: 'lg' as HeadingSize,
    6: 'md' as HeadingSize,
  };

  return levelSizeMap[level];
};

/**
 * Heading Component
 *
 * A flexible heading component that supports multiple levels, sizes, and semantic colors.
 * Uses CSS variables for theming.
 *
 * **SSR-Compatible**: Uses CSS classes and CSS variables instead of runtime theme resolution.
 * **Theme-Aware**: Automatically responds to data-theme attribute changes via CSS.
 *
 * @example
 * // H1 with default size
 * <Heading level={1}>Main Title</Heading>
 *
 * @example
 * // H2 with custom size and color
 * <Heading level={2} size="sm" semantic="secondary">Subtitle</Heading>
 *
 * @example
 * // Heading with alignment
 * <Heading level={3} align="center">Centered Heading</Heading>
 */
export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(({
  level = 1,
  size,
  weight = 'bold',
  semantic = 'primary',
  color,
  align,
  truncate = false,
  children,
  'data-testid': dataTestId,
  ...props
}, ref) => {
  const effectiveSize = size || getDefaultSizeForLevel(level);

  // Convert color token to CSS variable if provided
  const colorStyle = color ? {
    '--heading-color-override': `var(--mond-color-${color.replace(/\./g, '-')})`,
  } as React.CSSProperties : undefined;

  // Build CSS class names
  const classNames = [
    `mond-heading--${effectiveSize}`,
    !color && `mond-heading--${semantic}`, // Only apply semantic if no color prop
    weight && `mond-heading--weight-${weight}`,
    align && `mond-heading--align-${align}`,
    truncate && 'mond-heading--truncate',
  ]
    .filter(Boolean)
    .join(' ');

  const commonProps = {
    ref,
    className: classNames,
    style: colorStyle,
    'data-testid': dataTestId,
    ...props,
  };

  switch (level) {
    case 1:
      return <h1 {...commonProps}>{children}</h1>;
    case 2:
      return <h2 {...commonProps}>{children}</h2>;
    case 3:
      return <h3 {...commonProps}>{children}</h3>;
    case 4:
      return <h4 {...commonProps}>{children}</h4>;
    case 5:
      return <h5 {...commonProps}>{children}</h5>;
    case 6:
      return <h6 {...commonProps}>{children}</h6>;
    default:
      return <h1 {...commonProps}>{children}</h1>;
  }
});

Heading.displayName = 'Heading';

export default Heading;
