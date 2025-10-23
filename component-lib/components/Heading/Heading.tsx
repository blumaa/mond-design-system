import React, { forwardRef } from 'react';
import { Box, type BoxProps } from '../Box/Box';
import { fontWeights, fontFamilies } from '../../tokens';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type HeadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';

export type HeadingWeight = keyof typeof fontWeights;

export type HeadingSemantic =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'inverse';

export interface HeadingProps extends Omit<BoxProps, 'as'> {
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
 * A semantic heading component (h1-h6) with flexible sizing and styling.
 * Uses CSS variables for theming.
 *
 * **SSR-Compatible**: Uses CSS classes and CSS variables instead of runtime theme resolution.
 * **Theme-Aware**: Automatically responds to data-theme attribute changes via CSS.
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
export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(({
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
}, ref) => {
  const headingElement = `h${level}` as keyof React.JSX.IntrinsicElements;
  const effectiveSize = size || getDefaultSizeForLevel(level);

  // Build CSS class names
  const classNames = [
    `mond-heading--${effectiveSize}`,
    `mond-heading--${semantic}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Box
      as={headingElement}
      ref={ref}
      className={classNames}
      fontFamily={fontFamilies.sans}
      fontWeight={fontWeights[weight]}
      textAlign={align}
      color={color} // Allow custom color to override semantic
      m="0" // Reset default heading margins
      {...(truncate && {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      })}
      {...props}
    >
      {children}
    </Box>
  );
});

Heading.displayName = 'Heading';

export default Heading;
