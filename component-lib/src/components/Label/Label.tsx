import { forwardRef } from 'react';
import styled from 'styled-components';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  weight?: 'normal' | 'medium' | 'semibold';
  semantic?: 'default' | 'error' | 'success';
  requiredIndicator?: string;
}

const StyledLabel = styled.label<LabelProps>`
  display: inline-block;
  font-family: ${({ theme }) => theme.fonts.sans};
  margin-bottom: ${({ theme }) => theme.space[1]};
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};

  /* Font Weight */
  font-weight: ${({ weight, theme }) => {
    switch (weight) {
      case 'normal':
        return theme.fontWeights.normal;
      case 'semibold':
        return theme.fontWeights.semibold;
      default:
        return theme.fontWeights.medium;
    }
  }};

  /* Size Variants */
  ${({ size, theme }) => {
    switch (size) {
      case 'sm':
        return `
          font-size: ${theme.fontSizes.xs};
          line-height: ${theme.lineHeights.tight};
        `;
      case 'lg':
        return `
          font-size: ${theme.fontSizes.base};
          line-height: ${theme.lineHeights.normal};
        `;
      default: // md
        return `
          font-size: ${theme.fontSizes.sm};
          line-height: 1.43;
        `;
    }
  }}

  /* Semantic Colors */
  color: ${({ semantic, disabled, theme }) => {
    if (disabled) return theme.colors.textDisabled;

    switch (semantic) {
      case 'error':
        return theme.colors.textError;
      case 'success':
        return theme.colors.textSuccess;
      default:
        return theme.colors.textPrimary;
    }
  }};
`;

const RequiredIndicator = styled.span`
  color: ${({ theme }) => theme.colors.textError};
  margin-left: ${({ theme }) => theme.space[1]};
  font-size: inherit;
`;

/**
 * Label Component
 *
 * A form label component that supports multiple sizes, semantic colors,
 * and required indicators. Uses styled-components for theming.
 *
 * **SSR-Compatible**: Uses styled-components with theme tokens.
 * **Theme-Aware**: Automatically responds to theme changes via styled-components.
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
  ...props
}, ref) => {
  return (
    <StyledLabel
      ref={ref}
      htmlFor={htmlFor}
      disabled={disabled}
      size={size}
      weight={weight}
      semantic={semantic}
      data-size={size}
      data-semantic={semantic}
      data-disabled={disabled || undefined}
      {...props}
    >
      {children}
      {required && (
        <RequiredIndicator aria-label="required">
          {requiredIndicator}
        </RequiredIndicator>
      )}
    </StyledLabel>
  );
});

Label.displayName = 'Label';

