import React, { forwardRef } from 'react';
import { Box, type BoxProps } from '../../layout/Box/Box';
import { tokens } from '../../../tokens';
import { useTheme } from '../../providers/ThemeProvider';

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

export type TextWeight = keyof typeof tokens.fontWeights;

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
   * Dark mode control for theme resolution
   * @default false
   */
  isDarkMode?: boolean;

  /**
   * Text content
   */
  children: React.ReactNode;

}

const getVariantStyles = (variant: TextVariant) => {
  // Use semantic typography tokens for new variants
  const typographyTokens = tokens.semantic.typography;
  
  if (typographyTokens[variant as keyof typeof typographyTokens]) {
    const token = typographyTokens[variant as keyof typeof typographyTokens];
    const styles: Record<string, string | undefined> = {
      fontSize: token.fontSize,
      lineHeight: token.lineHeight,
      fontWeight: token.fontWeight,
      letterSpacing: token.letterSpacing,
    };

    // Only include optional properties if they're defined
    if ('textTransform' in token && token.textTransform) {
      styles.textTransform = token.textTransform;
    }
    if ('fontFamily' in token && token.fontFamily) {
      styles.fontFamily = token.fontFamily;
    }

    return styles;
  }
  
  // Fallback to legacy styles for backward compatibility
  const legacyStyles = {
    'body-lg': {
      fontSize: '1.125rem',
      lineHeight: '1.625',
    },
    'body-md': {
      fontSize: '1rem',
      lineHeight: '1.5',
    },
  };

  return legacyStyles[variant as keyof typeof legacyStyles] || legacyStyles['body-md'];
};

const getSemanticColor = (semantic: TextSemantic, theme: ReturnType<typeof useTheme>): string => {
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
    accent: theme('text.accent'),
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
  isDarkMode,
  children,
  color,
  ...props
}, ref) => {
  const theme = useTheme(isDarkMode);
  const variantStyles = getVariantStyles(variant);
  const semanticColor = getSemanticColor(semantic, theme);
  
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
      fontFamily={tokens.fontFamilies.sans}
      fontWeight={tokens.fontWeights[weight]}
      fontStyle={italic ? 'italic' : 'normal'}
      textAlign={align}
      textDecoration={textDecoration}
      color={textColor}
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