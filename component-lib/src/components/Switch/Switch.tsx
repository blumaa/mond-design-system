import React, { useId } from 'react';
import styled, { css } from 'styled-components';
import { Box } from '../Box/Box';
import { Label } from '../Label/Label';

export type SwitchSize = 'sm' | 'md' | 'lg';

export interface SwitchProps {
  /**
   * Unique identifier for the switch
   * @default auto-generated
   */
  id?: string;

  /**
   * Test identifier
   */
  'data-testid'?: string;

  /**
   * Switch size
   * @default 'md'
   */
  size?: SwitchSize;

  /**
   * Label text
   */
  label?: string;

  /**
   * Helper text displayed below label
   */
  helperText?: string;

  /**
   * Error message to display (takes precedence over helperText)
   */
  error?: string;

  /**
   * Controlled checked state
   */
  checked?: boolean;

  /**
   * Default checked state for uncontrolled component
   */
  defaultChecked?: boolean;

  /**
   * Makes the input read-only
   */
  readOnly?: boolean;

  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;

  /**
   * Change event handler - receives the native change event
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;

  /**
   * Click event handler - receives the native click event
   */
  onClick?: (event: React.MouseEvent<HTMLInputElement>) => void;

  /**
   * Focus event handler
   */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;

  /**
   * Blur event handler
   */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

// Size configurations
const SIZE_CONFIG = {
  sm: {
    trackWidth: '32px',
    trackHeight: '18px',
    thumbSize: '14px',
    thumbOffset: '2px',
    fontSize: '0.875rem', // --mond-font-size-sm
  },
  md: {
    trackWidth: '44px',
    trackHeight: '24px',
    thumbSize: '20px',
    thumbOffset: '2px',
    fontSize: '1rem', // --mond-font-size-base
  },
  lg: {
    trackWidth: '56px',
    trackHeight: '32px',
    thumbSize: '28px',
    thumbOffset: '2px',
    fontSize: '1.125rem', // --mond-font-size-lg
  },
};

const SwitchContainer = styled(Box)`
  display: inline-flex;
`;

const StyledLabel = styled(Label)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  user-select: none;
`;

const TrackWrapper = styled(Box)<{ $size: SwitchSize }>`
  position: relative;
  flex-shrink: 0;
  width: ${({ $size }) => SIZE_CONFIG[$size].trackWidth};
  height: ${({ $size }) => SIZE_CONFIG[$size].trackHeight};
`;

const HiddenInput = styled.input<{ $disabled?: boolean }>`
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  z-index: 1;
`;

const Track = styled(Box)<{ $checked?: boolean; $disabled?: boolean; $error?: boolean }>`
  width: 100%;
  height: 100%;
  border-radius: ${({ theme }) => theme.radii.full};
  background-color: ${({ $checked, theme }) =>
    $checked ? theme.colors.brandPrimary600 : theme.colors.borderDefault};
  border: 1px solid ${({ $error, theme }) => ($error ? theme.colors.borderError : 'transparent')};
  transition: all 200ms ease;
  position: relative;
  pointer-events: none;

  ${({ $disabled }) =>
    $disabled &&
    css`
      opacity: 0.6;
      cursor: not-allowed;
    `}
`;

const Thumb = styled(Box)<{ $checked?: boolean; $size: SwitchSize }>`
  border-radius: ${({ theme }) => theme.radii.full};
  background-color: ${({ $checked, theme }) =>
    $checked ? theme.colors.textOnColor : theme.colors.surfaceBackground};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: all 200ms ease;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: ${({ $size }) => SIZE_CONFIG[$size].thumbSize};
  height: ${({ $size }) => SIZE_CONFIG[$size].thumbSize};
  left: ${({ $checked, $size }) => {
    if (!$checked) return SIZE_CONFIG[$size].thumbOffset;
    const trackWidth = parseFloat(SIZE_CONFIG[$size].trackWidth);
    const thumbSize = parseFloat(SIZE_CONFIG[$size].thumbSize);
    const offset = parseFloat(SIZE_CONFIG[$size].thumbOffset);
    return `${trackWidth - thumbSize - offset}px`;
  }};

  ${HiddenInput}:focus-visible ~ ${Track} & {
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.feedbackInfoBackground};
  }
`;

const LabelContent = styled(Box)`
  display: flex;
  flex-direction: column;
`;

const LabelText = styled(Box).attrs({ as: 'span' })<{ $size: SwitchSize; $disabled?: boolean }>`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-weight: ${({ theme }) => theme.fontWeights.normal};
  font-size: ${({ $size }) => SIZE_CONFIG[$size].fontSize};
  color: ${({ $disabled, theme }) =>
    $disabled ? theme.colors.textDisabled : theme.colors.textPrimary};
`;

const Message = styled(Box).attrs({ as: 'span' })<{ $error?: boolean }>`
  display: block;
  margin-top: ${({ theme }) => theme.space[1]};
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ $error, theme }) =>
    $error ? theme.colors.textError : theme.colors.textSecondary};
`;

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      id,
      'data-testid': dataTestId,
      size = 'md',
      label,
      helperText,
      error,
      checked,
      defaultChecked,
      readOnly,
      disabled = false,
      onChange,
      onClick,
      onFocus,
      onBlur,
    },
    ref
  ) => {
    const generatedId = useId();
    const switchId = id || `switch-${generatedId}`;

    // Determine message to display
    const message = error || helperText;

    return (
      <SwitchContainer
        className="mond-switch-container"
        data-size={size}
        data-disabled={disabled || undefined}
        data-checked={checked || undefined}
        data-error={error ? true : undefined}
      >
        <StyledLabel htmlFor={switchId} disabled={disabled} className="mond-switch__label-wrapper">
          {/* Switch visual container */}
          <TrackWrapper $size={size} className="mond-switch__track-wrapper">
            {/* Hidden checkbox - the actual form control */}
            <HiddenInput
              ref={ref}
              type="checkbox"
              id={switchId}
              checked={checked}
              defaultChecked={defaultChecked}
              readOnly={readOnly}
              disabled={disabled}
              onChange={onChange}
              onClick={onClick}
              onFocus={onFocus}
              onBlur={onBlur}
              $disabled={disabled}
              className="mond-switch__input"
              data-testid={dataTestId}
              aria-label={label || 'Switch'}
            />

            {/* Visual track */}
            <Track $checked={checked} $disabled={disabled} $error={!!error} className="mond-switch__track">
              {/* Visual thumb */}
              <Thumb $checked={checked} $size={size} className="mond-switch__thumb" />
            </Track>
          </TrackWrapper>

          {/* Label text and messages */}
          {label && (
            <LabelContent className="mond-switch__label-content">
              <LabelText $size={size} $disabled={disabled} className="mond-switch__label-text">
                {label}
              </LabelText>
              {message && (
                <Message $error={!!error} className="mond-switch__message">
                  {message}
                </Message>
              )}
            </LabelContent>
          )}
        </StyledLabel>
      </SwitchContainer>
    );
  }
);

Switch.displayName = 'Switch';

