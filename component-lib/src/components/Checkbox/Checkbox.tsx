import React, { useId, useRef, useEffect, useImperativeHandle } from 'react';
import styled, { css } from 'styled-components';
import { Box } from '../Box/Box';
import { Label } from '../Label/Label';

export type CheckboxSize = 'sm' | 'md' | 'lg';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  'data-testid'?: string;
  /**
   * Checkbox size
   * @default 'md'
   */
  size?: CheckboxSize;

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

  /**
   * Indeterminate state (partially checked)
   * @default false
   */
  indeterminate?: boolean;
}

const CheckboxContainer = styled(Box)<{
  $size: CheckboxSize;
  $error?: boolean;
  $disabled?: boolean;
  $indeterminate?: boolean;
}>`
  display: inline-flex;
  position: relative;
`;

const StyledLabel = styled(Label)`
  display: flex;
  align-items: flex-start;
`;


const InputWrapper = styled(Box)<{ $size: CheckboxSize }>`
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

const CheckboxBox = styled(Box)<{
  $size: CheckboxSize;
  $error?: boolean;
  $disabled?: boolean;
  $indeterminate?: boolean;
}>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radii.sm};
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

  /* Checked state */
  ${HiddenInput}:checked ~ & {
    background-color: ${({ theme }) => theme.colors.brandInteractiveBackground};
    border-color: ${({ theme }) => theme.colors.brandInteractiveBackground};
  }

  /* Indeterminate state */
  ${({ $indeterminate, theme }) => $indeterminate && css`
    background-color: ${theme.colors.brandInteractiveBackground};
    border-color: ${theme.colors.brandInteractiveBackground};
  `}

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

const Checkmark = styled(Box).attrs({ as: 'span' })<{ $size: CheckboxSize }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: ${({ theme }) => theme.colors.textOnColor};
  line-height: 1;
  opacity: 0;
  transition: opacity 150ms ease;
  pointer-events: none;

  ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return css`font-size: 10px;`;
      case 'lg':
        return css`font-size: 14px;`;
      default: // md
        return css`font-size: 12px;`;
    }
  }}

  ${HiddenInput}:checked ~ ${CheckboxBox} & {
    opacity: 1;
  }
`;

const IndeterminateIcon = styled(Box).attrs({ as: 'span' })<{ $size: CheckboxSize; $indeterminate?: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: ${({ theme }) => theme.colors.textOnColor};
  line-height: 1;
  opacity: ${({ $indeterminate }) => $indeterminate ? 1 : 0};
  transition: opacity 150ms ease;
  pointer-events: none;

  ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return css`font-size: 10px;`;
      case 'lg':
        return css`font-size: 14px;`;
      default: // md
        return css`font-size: 12px;`;
    }
  }}
`;

const LabelContent = styled(Box)`
  display: flex;
  flex-direction: column;
  margin-left: ${({ theme }) => theme.space[2]};
`;

const LabelText = styled(Box).attrs({ as: 'span' })<{ $size: CheckboxSize; $disabled?: boolean }>`
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

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({
    size = 'md',
    label,
    error,
    helperText,
    indeterminate = false,
    disabled,
    checked,
    id: providedId,
    className,
    'data-testid': dataTestId,
    ...props
  }, ref) => {
    const generatedId = useId();
    const id = providedId || generatedId;

    // Handle indeterminate state
    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => inputRef.current!);

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    // Determine message to display
    const message = error || helperText;
    const messageType = error ? 'error' : 'helper';

    return (
      <CheckboxContainer
        $size={size}
        $error={!!error}
        $disabled={disabled}
        $indeterminate={indeterminate}
        className={className}
        data-size={size}
        data-error={error ? 'true' : undefined}
        data-disabled={disabled ? 'true' : undefined}
        data-indeterminate={indeterminate ? 'true' : undefined}
      >
        <StyledLabel
          htmlFor={id}
          disabled={disabled}
        >
          <InputWrapper $size={size}>
            <HiddenInput
              ref={inputRef}
              type="checkbox"
              id={id}
              checked={checked}
              disabled={disabled}
              data-testid={dataTestId}
              {...props}
            />
            <CheckboxBox
              $size={size}
              $error={!!error}
              $disabled={disabled}
              $indeterminate={indeterminate}
            >
              <Checkmark $size={size}>✓</Checkmark>
              <IndeterminateIcon $size={size} $indeterminate={indeterminate}>−</IndeterminateIcon>
            </CheckboxBox>
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
      </CheckboxContainer>
    );
  }
);

Checkbox.displayName = 'Checkbox';

