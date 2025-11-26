import React, { forwardRef } from 'react';
import './text.css';

export type TextVariant =
  | 'display'
  | 'headline'
  | 'title'
  | 'subtitle'
  | 'body'
  | 'body-sm'
  | 'body-xs'
  | 'body-xxs'
  | 'caption'
  | 'overline'
  | 'code';

export type TextWeight = 'thin' | 'extralight' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';

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
   * @default 'body'
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
   * Direct color token for custom colors
   * Format: 'blue.500' | 'gray.600' | 'brand.primary.700' | etc.
   * Overrides semantic color if both are provided
   * Use semantic colors when possible for theme consistency
   */
  color?: string;

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
   * Accessible label for screen readers
   */
  'aria-label'?: string;

  /**
   * Test ID for testing purposes
   */
  'data-testid'?: string;

  /**
   * HTML title attribute
   */
  title?: string;
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
 * // Custom color using design tokens
 * <Text color="blue.500">Custom blue text</Text>
 * <Text color="brand.primary.700">Brand color text</Text>
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
  variant = 'body',
  weight = 'normal',
  align,
  semantic = 'primary',
  color,
  italic = false,
  underline = false,
  strikethrough = false,
  truncate = false,
  as = 'span',
  children,
  'aria-label': ariaLabel,
  'data-testid': dataTestId,
  title,
  ...props
}, ref) => {
  const Element = as as React.ElementType;

  // Convert color token to CSS variable if provided
  const colorStyle = color ? {
    '--text-color-override': `var(--mond-color-${color.replace(/\./g, '-')})`,
  } as React.CSSProperties : undefined;

  // Build CSS class names
  const classNames = [
    `mond-text--${variant}`,
    !color && `mond-text--${semantic}`, // Only apply semantic if no color prop
    weight && `mond-text--weight-${weight}`,
    align && `mond-text--align-${align}`,
    italic && 'mond-text--italic',
    underline && 'mond-text--underline',
    strikethrough && 'mond-text--strikethrough',
    truncate && 'mond-text--truncate',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Element
      ref={ref}
      className={classNames}
      style={colorStyle}
      aria-label={ariaLabel}
      data-testid={dataTestId}
      title={title}
      {...props}
    >
      {children}
    </Element>
  );
});

Text.displayName = 'Text';

export default Text;
