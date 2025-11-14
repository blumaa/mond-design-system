import { forwardRef, ReactNode } from 'react';
import './label.css';

export type LabelSize = 'sm' | 'md' | 'lg';
export type LabelWeight = 'normal' | 'medium' | 'semibold';
export type LabelSemantic = 'default' | 'error' | 'success';

export interface LabelProps {
  /**
   * Label content
   */
  children: ReactNode;

  /**
   * Associates label with form element
   */
  htmlFor?: string;

  /**
   * Shows required indicator
   * @default false
   */
  required?: boolean;

  /**
   * Disables the label
   * @default false
   */
  disabled?: boolean;

  /**
   * Label size
   * @default 'md'
   */
  size?: LabelSize;

  /**
   * Font weight
   * @default 'medium'
   */
  weight?: LabelWeight;

  /**
   * Semantic color variant
   * @default 'default'
   */
  semantic?: LabelSemantic;

  /**
   * Direct color token for custom colors
   * Format: 'blue.500' | 'gray.600' | 'brand.primary.700' | etc.
   * Overrides semantic color if both are provided
   * Use semantic colors when possible for theme consistency
   */
  color?: string;

  /**
   * Custom required indicator
   * @default '*'
   */
  requiredIndicator?: string;

  /**
   * Test ID for testing purposes
   */
  'data-testid'?: string;
}

/**
 * Label Component
 *
 * A flexible label component that uses CSS variables for theming.
 * Supports multiple sizes, weights, and semantic colors.
 *
 * **SSR-Compatible**: Uses CSS classes and CSS variables instead of runtime theme resolution.
 * **Theme-Aware**: Automatically responds to data-theme attribute changes via CSS.
 *
 * @example
 * // Basic label
 * <Label htmlFor="email">Email</Label>
 *
 * @example
 * // Label with required indicator
 * <Label htmlFor="password" required>Password</Label>
 *
 * @example
 * // Label with semantic color
 * <Label semantic="error">Error Field</Label>
 */
export const Label = forwardRef<HTMLLabelElement, LabelProps>(({
  children,
  htmlFor,
  required = false,
  disabled = false,
  size = 'md',
  weight = 'medium',
  semantic = 'default',
  color,
  requiredIndicator = '*',
  'data-testid': dataTestId,
}, ref) => {
  // Convert color token to CSS variable if provided
  const colorStyle = color ? {
    '--label-color-override': `var(--mond-color-${color.replace(/\./g, '-')})`,
  } as React.CSSProperties : undefined;

  // Build CSS class names
  const classNames = [
    'mond-label',
    `mond-label--${size}`,
    `mond-label--weight-${weight}`,
    disabled ? 'mond-label--disabled' : (!color && `mond-label--${semantic}`), // Only apply semantic if no color prop
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <label
      ref={ref}
      className={classNames}
      style={colorStyle}
      htmlFor={htmlFor}
      data-testid={dataTestId}
    >
      {children}
      {required && (
        <span
          className="mond-label__required"
          aria-label="required"
        >
          {requiredIndicator}
        </span>
      )}
    </label>
  );
});

Label.displayName = 'Label';
