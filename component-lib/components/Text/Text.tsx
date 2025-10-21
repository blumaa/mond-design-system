import React, { forwardRef } from 'react';
import { Box, type BoxProps } from '../Box/Box';
import { tokens } from '../../tokens';

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
   * HTML element or component to render as
   * @default 'span'
   */
  as?: React.ElementType;

  /**
   * Text content
   */
  children: React.ReactNode;

  // Allow additional props like framer-motion's variants
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

/**
 * Text Component
 *
 * A flexible text component that supports multiple variants, semantic colors,
 * and text modifiers. Uses CSS variables for theming.
 *
 * **SSR-Compatible**: Uses CSS classes and CSS variables instead of runtime theme resolution.
 * **Theme-Aware**: Automatically responds to data-theme attribute changes via CSS.
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
  className,
  color,
  ...props
}, ref) => {
  // Build CSS class names
  const classNames = [
    `mond-text--${variant}`,
    `mond-text--${semantic}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

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
      className={classNames}
      fontFamily={tokens.fontFamilies.sans}
      fontWeight={tokens.fontWeights[weight as TextWeight]}
      fontStyle={italic ? 'italic' : 'normal'}
      textAlign={align}
      textDecoration={textDecoration}
      color={color} // Allow custom color to override semantic
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

export default Text;
