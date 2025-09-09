import React, { forwardRef } from 'react';
import { Box, type BoxProps } from '../../layout/Box/Box';
import { fontSizes, fontWeights, lineHeights, fontFamilies } from '../../../tokens';
import { resolveSemanticToken } from '../../../utils/theme';

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

  /**
   * Dark mode
   * @default false
   */
  isDarkMode?: boolean;
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

const getSizeStyles = (size: HeadingSize) => {
  const sizeStyleMap = {
    xs: {
      fontSize: fontSizes.xs,
      lineHeight: lineHeights.tight,
    },
    sm: {
      fontSize: fontSizes.sm,
      lineHeight: lineHeights.tight,
    },
    md: {
      fontSize: fontSizes.base,
      lineHeight: lineHeights.tight,
    },
    lg: {
      fontSize: fontSizes.lg,
      lineHeight: lineHeights.tight,
    },
    xl: {
      fontSize: fontSizes.xl,
      lineHeight: lineHeights.tight,
    },
    '2xl': {
      fontSize: fontSizes['2xl'],
      lineHeight: lineHeights.tight,
    },
    '3xl': {
      fontSize: fontSizes['3xl'],
      lineHeight: lineHeights.tight,
    },
    '4xl': {
      fontSize: fontSizes['4xl'],
      lineHeight: lineHeights.none,
    },
    '5xl': {
      fontSize: fontSizes['5xl'],
      lineHeight: lineHeights.none,
    },
    '6xl': {
      fontSize: fontSizes['6xl'],
      lineHeight: lineHeights.none,
    },
  };

  return sizeStyleMap[size];
};

const getSemanticColor = (semantic: HeadingSemantic, isDarkMode: boolean): string => {
  const mode = isDarkMode ? 'dark' : 'light';
  const theme = (path: string) => resolveSemanticToken(path, mode);

  const semanticColors = {
    primary: theme('text.primary'),
    secondary: theme('text.secondary'),
    tertiary: theme('text.tertiary'),
    inverse: theme('text.inverse'),
  };

  return semanticColors[semantic] || semanticColors.primary;
};

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(({
  level = 1,
  size,
  weight = 'bold',
  semantic = 'primary',
  align,
  truncate = false,
  children,
  isDarkMode = false,
  color,
  ...props
}, ref) => {
  const headingElement = `h${level}` as keyof JSX.IntrinsicElements;
  const effectiveSize = size || getDefaultSizeForLevel(level);
  const sizeStyles = getSizeStyles(effectiveSize);
  const semanticColor = getSemanticColor(semantic, isDarkMode);
  
  // Use custom color if provided, otherwise use semantic color
  const headingColor = color || semanticColor;

  return (
    <Box
      as={headingElement}
      ref={ref}
      fontFamily={fontFamilies.sans}
      fontWeight={fontWeights[weight]}
      textAlign={align}
      color={headingColor}
      isDarkMode={isDarkMode}
      m="0" // Reset default heading margins
      {...sizeStyles}
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