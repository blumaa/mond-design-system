import React, { useId } from 'react';
import styled, { css } from 'styled-components';
import { Box } from '../Box/Box';
import { Label } from '../Label/Label';

export type TextareaSize = 'sm' | 'md' | 'lg';
export type TextareaVariant = 'default' | 'error' | 'success';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Textarea visual size variant
   * @default 'md'
   */
  textareaSize?: TextareaSize;

  /**
   * Textarea variant
   * @default 'default'
   */
  variant?: TextareaVariant;

  /**
   * Label for the textarea
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

  /**
   * Number of visible text lines
   * @default 4
   */
  rows?: number;
}

const TextareaContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[1]};
`;


const StyledTextarea = styled.textarea<{
  $size: TextareaSize;
  $variant: TextareaVariant;
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
  resize: vertical;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  /* Size variants */
  ${({ $size, theme }) => {
    switch ($size) {
      case 'sm':
        return css`
          padding: ${theme.space[2]} ${theme.space[3]};
          font-size: ${theme.fontSizes.sm};
        `;
      case 'lg':
        return css`
          padding: ${theme.space[3]} ${theme.space[4]};
          font-size: ${theme.fontSizes.lg};
        `;
      default: // md
        return css`
          padding: ${theme.space[2]} ${theme.space[3]};
          font-size: ${theme.fontSizes.base};
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

const TextareaMessage = styled(Box)<{ $type: 'error' | 'success' | 'helper' }>`
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

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    textareaSize = 'md',
    variant = 'default',
    label,
    error,
    success,
    helperText,
    disabled,
    id: providedId,
    className,
    rows = 4,
    ...props
  }, ref) => {
    const generatedId = useId();
    const id = providedId || generatedId;

    // Determine effective variant based on error/success props
    const effectiveVariant = error ? 'error' : success ? 'success' : variant;

    // Determine message to display
    const message = error || success || helperText;
    const messageType = error ? 'error' : success ? 'success' : 'helper';

    return (
      <TextareaContainer>
        {label && (
          <Label htmlFor={id} disabled={disabled}>
            {label}
          </Label>
        )}
        <StyledTextarea
          ref={ref}
          id={id}
          rows={rows}
          $size={textareaSize}
          $variant={effectiveVariant}
          disabled={disabled}
          className={className}
          data-size={textareaSize}
          data-variant={effectiveVariant}
          {...props}
        />
        {message && (
          <TextareaMessage $type={messageType}>
            {message}
          </TextareaMessage>
        )}
      </TextareaContainer>
    );
  }
);

Textarea.displayName = 'Textarea';

