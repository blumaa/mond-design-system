import { forwardRef } from 'react';
import { Box, BoxProps } from '../Box/Box';
import { tokens } from '../../tokens';

export interface LabelProps extends Omit<BoxProps, 'as' | 'children'> {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  weight?: 'normal' | 'medium' | 'semibold';
  semantic?: 'default' | 'error' | 'success';
  requiredIndicator?: string;
}

/**
 * Label Component
 *
 * A form label component that supports multiple sizes, semantic colors,
 * and required indicators. Uses CSS variables for theming.
 *
 * **SSR-Compatible**: Uses CSS classes and CSS variables instead of runtime theme resolution.
 * **Theme-Aware**: Automatically responds to data-theme attribute changes via CSS.
 *
 * @example
 * // Basic label
 * <Label htmlFor="email-input">Email Address</Label>
 *
 * @example
 * // Required label with error state
 * <Label htmlFor="password" required semantic="error">Password</Label>
 *
 * @example
 * // Disabled label
 * <Label htmlFor="disabled-input" disabled>Disabled Field</Label>
 */
export const Label = forwardRef<HTMLLabelElement, LabelProps>(({
  children,
  htmlFor,
  required = false,
  disabled = false,
  size = 'md',
  weight = 'medium',
  semantic = 'default',
  requiredIndicator = '*',
  className = '',
  style,
  ...props
}, ref) => {
  const fontWeight = tokens.fontWeights[weight as keyof typeof tokens.fontWeights];

  // Build CSS class names
  const classNames = [
    'mond-label',
    `mond-label--${size}`,
    `mond-label--${semantic}`,
    disabled && 'mond-label--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const labelStyle = {
    display: 'inline-block',
    fontFamily: tokens.fontFamilies.sans,
    fontWeight,
    cursor: disabled ? 'not-allowed' : 'pointer',
    marginBottom: tokens.spacing['1'], // 0.25rem
    ...style,
  };

  return (
    <Box
      ref={ref}
      as="label"
      className={classNames}
      style={labelStyle}
      {...(htmlFor && { htmlFor })}
      {...props}
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
    </Box>
  );
});

Label.displayName = 'Label';

export default Label;
