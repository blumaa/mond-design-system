import React, { useId } from 'react';
import styled, { css } from 'styled-components';
import { Box } from '../Box/Box';
import { Label } from '../Label/Label';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputVariant = 'default' | 'error' | 'success';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Input visual size variant
   * @default 'md'
   */
  inputSize?: InputSize;

  /**
   * Input variant
   * @default 'default'
   */
  variant?: InputVariant;

  /**
   * Label for the input
   */
  label?: string;

  /**
   * Error message to display
   */
  error?: string;

  /**
   * Success message to display
   */
  success?: string;

  /**
   * Helper text
   */
  helperText?: string;
}

const InputContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[1]};
`;

const StyledInput = styled.input<{
  $size: InputSize;
  $variant: InputVariant;
  disabled?: boolean;
}>`
  width: 100%;
  font-family: ${({ theme }) => theme.fonts.sans};
  color: ${({ theme }) => theme.colors.textPrimary};
  background-color: ${({ theme }) => theme.colors.surfaceInput};
  border: 1px solid ${({ theme }) => theme.colors.borderDefault};
  border-radius: ${({ theme }) => theme.radii.md};
  transition: all 150ms ease;
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  /* Size variants */
  ${({ $size, theme }) => {
    switch ($size) {
      case 'sm':
        return css`
          padding: ${theme.space[1]} ${theme.space[2]};
          font-size: ${theme.fontSizes.sm};
          height: 32px;
        `;
      case 'lg':
        return css`
          padding: ${theme.space[3]} ${theme.space[4]};
          font-size: ${theme.fontSizes.lg};
          height: 48px;
        `;
      default: // md
        return css`
          padding: ${theme.space[2]} ${theme.space[3]};
          font-size: ${theme.fontSizes.base};
          height: 40px;
        `;
    }
  }}

  /* Variant states */
  ${({ $variant, theme }) => {
    if ($variant === 'error') {
      return css`
        border-color: ${theme.colors.borderError};

        &:focus {
          border-color: ${theme.colors.borderError};
          box-shadow: 0 0 0 3px ${theme.colors.feedbackErrorBackground};
        }
      `;
    }
    if ($variant === 'success') {
      return css`
        border-color: ${theme.colors.borderSuccess};

        &:focus {
          border-color: ${theme.colors.borderSuccess};
          box-shadow: 0 0 0 3px ${theme.colors.feedbackSuccessBackground};
        }
      `;
    }
    return css`
      &:focus {
        border-color: ${theme.colors.brandInteractiveBackground};
        box-shadow: 0 0 0 3px ${theme.colors.feedbackInfoBackground};
      }
    `;
  }}

  /* Disabled state */
  ${({ disabled, theme }) => disabled && css`
    cursor: not-allowed;
    opacity: 0.6;
    background-color: ${theme.colors.surfaceDisabled};
  `}
`;

const InputMessage = styled(Box)<{ $type: 'error' | 'success' | 'helper' }>`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-top: ${({ theme }) => theme.space[1]};
  color: ${({ theme, $type }) => {
    switch ($type) {
      case 'error':
        return theme.colors.textError;
      case 'success':
        return theme.colors.textSuccess;
      default:
        return theme.colors.textSecondary;
    }
  }};
`;

/**
 * Input Component
 *
 * A text input component with labels, validation states, and helper text.
 * Styled with styled-components for theme integration.
 *
 * **SSR-Compatible**: Uses styled-components with theme prop passing.
 * **Theme-Aware**: Automatically responds to ThemeProvider theme changes.
 *
 * @example
 * <Input label="Email" type="email" placeholder="you@example.com" />
 *
 * @example
 * <Input label="Password" type="password" error="Password is required" variant="error" />
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  inputSize = 'md',
  variant = 'default',
  label,
  error,
  success,
  helperText,
  disabled,
  id: providedId,
  className,
  ...props
}, ref) => {
  const generatedId = useId();
  const id = providedId || generatedId;

  // Determine variant based on error/success
  const effectiveVariant = error ? 'error' : success ? 'success' : variant;

  // Get message to display
  const message = error || success || helperText;
  const messageType = error ? 'error' : success ? 'success' : 'helper';

  return (
    <InputContainer>
      {label && (
        <Label htmlFor={id} disabled={disabled}>
          {label}
        </Label>
      )}
      <StyledInput
        ref={ref}
        id={id}
        $size={inputSize}
        $variant={effectiveVariant}
        disabled={disabled}
        className={className}
        data-size={inputSize}
        data-variant={effectiveVariant}
        {...props}
      />
      {message && (
        <InputMessage $type={messageType}>
          {message}
        </InputMessage>
      )}
    </InputContainer>
  );
});

Input.displayName = 'Input';

