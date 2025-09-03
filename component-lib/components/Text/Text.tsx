import React, { forwardRef } from 'react';
import { Box, type BoxProps } from '../Box/Box';
import { fontSizes, fontWeights, lineHeights, fontFamilies } from '../../tokens';
import { resolveSemanticToken } from '../../utils/theme';

export type TextVariant = 
  | 'body-lg' 
  | 'body-md' 
  | 'body-sm' 
  | 'caption' 
  | 'overline';

export type TextWeight = keyof typeof fontWeights;

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
  | 'error';

export interface TextProps extends Omit<BoxProps, 'as'> {
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
   * HTML element to render as
   * @default 'span'
   */
  as?: 'span' | 'p' | 'div' | 'label' | 'strong' | 'em' | 'small';

  /**
   * Text content
   */
  children: React.ReactNode;

  /**
   * Dark mode
   * @default false
   */
  isDarkMode?: boolean;
}

const getVariantStyles = (variant: TextVariant) => {
  const styles = {
    'body-lg': {
      fontSize: fontSizes.lg,
      lineHeight: lineHeights.relaxed,
    },
    'body-md': {
      fontSize: fontSizes.base,
      lineHeight: lineHeights.normal,
    },
    'body-sm': {
      fontSize: fontSizes.sm,
      lineHeight: lineHeights.normal,
    },
    'caption': {
      fontSize: fontSizes.xs,
      lineHeight: lineHeights.tight,
    },
    'overline': {
      fontSize: fontSizes.xs,
      lineHeight: lineHeights.tight,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.1em',
      fontWeight: fontWeights.medium,
    },
  };

  return styles[variant] || styles['body-md'];
};

const getSemanticColor = (semantic: TextSemantic, isDarkMode: boolean): string => {
  const mode = isDarkMode ? 'dark' : 'light';
  const theme = (path: string) => resolveSemanticToken(path, mode);

  const semanticColors = {
    primary: theme('text.primary'),
    secondary: theme('text.secondary'),
    tertiary: theme('text.tertiary'),
    disabled: theme('text.disabled'),
    inverse: theme('text.inverse'),
    link: theme('text.link'),
    success: theme('text.success'),
    warning: theme('text.warning'),
    error: theme('text.error'),
  };

  return semanticColors[semantic] || semanticColors.primary;
};

export const Text = forwardRef<HTMLElement, TextProps>(({
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
  isDarkMode = false,
  color,
  ...props
}, ref) => {
  const variantStyles = getVariantStyles(variant);
  const semanticColor = getSemanticColor(semantic, isDarkMode);
  
  // Use custom color if provided, otherwise use semantic color
  const textColor = color || semanticColor;

  const textDecorations = [];
  if (underline) textDecorations.push('underline');
  if (strikethrough) textDecorations.push('line-through');
  const textDecoration = textDecorations.length > 0 
    ? textDecorations.join(' ') 
    : 'none';

  return (
    <Box
      as={as}
      ref={ref}
      fontFamily={fontFamilies.sans}
      fontWeight={fontWeights[weight]}
      fontStyle={italic ? 'italic' : 'normal'}
      textAlign={align}
      textDecoration={textDecoration}
      color={textColor}
      isDarkMode={isDarkMode}
      {...variantStyles}
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

Text.displayName = 'Text';