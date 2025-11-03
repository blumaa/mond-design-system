import React, { useId } from 'react';
import styled, { css } from 'styled-components';
import { Box } from '../Box/Box';
import { Label } from '../Label/Label';

export type RadioSize = 'sm' | 'md' | 'lg';

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  'data-testid'?: string;
  /**
   * Radio size
   * @default 'md'
   */
  size?: RadioSize;

  /**
   * Label text
   */
  label?: string;

  /**
   * Error message to display
   */
  error?: string;

  /**
   * Helper text
   */
  helperText?: string;
}

const RadioContainer = styled(Box)<{
  $size: RadioSize;
  $error?: boolean;
  $disabled?: boolean;
}>`
  display: inline-flex;
  position: relative;
`;

const StyledLabel = styled(Label)`
  display: flex;
  align-items: flex-start;
`;

const InputWrapper = styled(Box)<{ $size: RadioSize }>`
  position: relative;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return css`
          width: 16px;
          height: 16px;
        `;
      case 'lg':
        return css`
          width: 24px;
          height: 24px;
        `;
      default: // md
        return css`
          width: 20px;
          height: 20px;
        `;
    }
  }}
`;

const HiddenInput = styled.input<{ disabled?: boolean }>`
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  z-index: 1;
`;

const RadioCircle = styled(Box)<{
  $size: RadioSize;
  $error?: boolean;
  $disabled?: boolean;
}>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radii.full};
  border: 1px solid ${({ theme, $error }) => $error ? theme.colors.borderError : theme.colors.borderDefault};
  background-color: ${({ theme }) => theme.colors.surfaceInput};
  transition: all 150ms ease;
  flex-shrink: 0;

  ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return css`
          width: 16px;
          height: 16px;
        `;
      case 'lg':
        return css`
          width: 24px;
          height: 24px;
        `;
      default: // md
        return css`
          width: 20px;
          height: 20px;
        `;
    }
  }}

  /* Focus state */
  ${HiddenInput}:focus ~ & {
    outline: 2px solid ${({ theme, $error }) => $error ? theme.colors.feedbackErrorBackground : theme.colors.feedbackInfoBackground};
    outline-offset: 2px;
  }

  /* Disabled state */
  ${({ $disabled, theme }) => $disabled && css`
    opacity: 0.6;
    background-color: ${theme.colors.surfaceDisabled};
    cursor: not-allowed;
  `}
`;

const RadioDot = styled(Box)<{ $size: RadioSize }>`
  border-radius: ${({ theme }) => theme.radii.full};
  background-color: ${({ theme }) => theme.colors.brandInteractiveBackground};
  opacity: 0;
  transition: opacity 150ms ease;

  ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return css`
          width: 6px;
          height: 6px;
        `;
      case 'lg':
        return css`
          width: 10px;
          height: 10px;
        `;
      default: // md
        return css`
          width: 8px;
          height: 8px;
        `;
    }
  }}

  ${HiddenInput}:checked ~ ${RadioCircle} & {
    opacity: 1;
  }
`;

const LabelContent = styled(Box)`
  display: flex;
  flex-direction: column;
  margin-left: ${({ theme }) => theme.space[2]};
`;

const LabelText = styled(Box).attrs({ as: 'span' })<{ $size: RadioSize; $disabled?: boolean }>`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-weight: ${({ theme }) => theme.fontWeights.normal};
  color: ${({ theme, $disabled }) => $disabled ? theme.colors.textDisabled : theme.colors.textPrimary};
  user-select: none;

  ${({ $size, theme }) => {
    switch ($size) {
      case 'sm':
        return css`font-size: ${theme.fontSizes.sm};`;
      case 'lg':
        return css`font-size: ${theme.fontSizes.lg};`;
      default: // md
        return css`font-size: ${theme.fontSizes.base};`;
    }
  }}
`;

const Message = styled(Box).attrs({ as: 'span' })<{ $type: 'error' | 'helper' }>`
  display: block;
  margin-top: ${({ theme }) => theme.space[1]};
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme, $type }) =>
    $type === 'error' ? theme.colors.textError : theme.colors.textSecondary
  };
`;

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({
    size = 'md',
    label,
    error,
    helperText,
    disabled,
    checked,
    id: providedId,
    className,
    'data-testid': dataTestId,
    ...props
  }, ref) => {
    const generatedId = useId();
    const id = providedId || generatedId;

    // Determine message to display
    const message = error || helperText;
    const messageType = error ? 'error' : 'helper';

    return (
      <RadioContainer
        $size={size}
        $error={!!error}
        $disabled={disabled}
        className={className}
        data-size={size}
        data-error={error ? 'true' : undefined}
        data-disabled={disabled ? 'true' : undefined}
      >
        <StyledLabel htmlFor={id} disabled={disabled}>
          <InputWrapper $size={size}>
            <HiddenInput
              ref={ref}
              type="radio"
              id={id}
              checked={checked}
              disabled={disabled}
              data-testid={dataTestId}
              {...props}
            />
            <RadioCircle
              $size={size}
              $error={!!error}
              $disabled={disabled}
            >
              <RadioDot $size={size} />
            </RadioCircle>
          </InputWrapper>
          {label && (
            <LabelContent>
              <LabelText $size={size} $disabled={disabled}>{label}</LabelText>
              {message && (
                <Message $type={messageType}>
                  {message}
                </Message>
              )}
            </LabelContent>
          )}
        </StyledLabel>
      </RadioContainer>
    );
  }
);

Radio.displayName = 'Radio';
