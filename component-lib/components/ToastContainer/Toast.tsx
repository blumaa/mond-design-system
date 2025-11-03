import React, { useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { Button } from '../Button/Button';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
}

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  type?: ToastVariant;
  title: string;
  message?: string;
  duration?: number;
  dismissible?: boolean;
  actions?: ToastAction[];
  icon?: React.ReactNode;
  animationState?: 'entering' | 'visible' | 'exiting';
  onDismiss: (toastId: string) => void;
  onPause?: () => void;
  onResume?: () => void;
  'data-testid'?: string;
}

interface StyledToastProps {
  $type: ToastVariant;
  $animationState: 'entering' | 'visible' | 'exiting';
}

const StyledToast = styled.div<StyledToastProps>`
  display: flex;
  gap: ${({ theme }) => theme.space[3]};
  padding: ${({ theme }) => theme.space[4]};
  border-radius: ${({ theme }) => theme.radii.md};
  border-width: 1px;
  border-style: solid;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  min-width: 320px;
  max-width: 500px;
  font-family: ${({ theme }) => theme.fonts.sans};
  position: relative;

  /* Animation states */
  ${({ $animationState }) =>
    $animationState === 'entering' &&
    css`
      transform: translateX(100%) scale(0.9);
      opacity: 0;
      transition: all 300ms cubic-bezier(0.16, 1, 0.3, 1);
    `}

  ${({ $animationState }) =>
    $animationState === 'visible' &&
    css`
      transform: translateX(0%) scale(1);
      opacity: 1;
      transition: all 300ms cubic-bezier(0.16, 1, 0.3, 1);
    `}

  ${({ $animationState }) =>
    $animationState === 'exiting' &&
    css`
      transform: translateX(100%) scale(0.9);
      opacity: 0;
      transition: all 300ms cubic-bezier(0.16, 1, 0.3, 1);
    `}

  /* Variant styles - background and border colors */
  ${({ $type, theme }) =>
    $type === 'success' &&
    css`
      background-color: ${theme.colors.brandSuccess50};
      border-color: ${theme.colors.brandSuccess200};
    `}

  ${({ $type, theme }) =>
    $type === 'warning' &&
    css`
      background-color: ${theme.colors.brandWarning50};
      border-color: ${theme.colors.brandWarning200};
    `}

  ${({ $type, theme }) =>
    $type === 'error' &&
    css`
      background-color: ${theme.colors.brandError50};
      border-color: ${theme.colors.brandError200};
    `}

  ${({ $type, theme }) =>
    $type === 'info' &&
    css`
      background-color: ${theme.colors.brandPrimary50};
      border-color: ${theme.colors.brandPrimary200};
    `}
`;

interface StyledIconProps {
  $type: ToastVariant;
}

const StyledIcon = styled.div<StyledIconProps>`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  line-height: 1;

  /* Icon color variants */
  ${({ $type, theme }) =>
    $type === 'success' &&
    css`
      color: ${theme.colors.textSuccess};
    `}

  ${({ $type, theme }) =>
    $type === 'warning' &&
    css`
      color: ${theme.colors.textWarning};
    `}

  ${({ $type, theme }) =>
    $type === 'error' &&
    css`
      color: ${theme.colors.textError};
    `}

  ${({ $type, theme }) =>
    $type === 'info' &&
    css`
      color: ${theme.colors.brandPrimary600};
    `}
`;

const StyledContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[1]};
`;

const StyledTitle = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: ${({ theme }) => theme.lineHeights.tight};
`;

const StyledMessage = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.lineHeights.normal};
`;

const StyledActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space[2]};
  margin-top: ${({ theme }) => theme.space[2]};
`;

const StyledCloseButton = styled.button`
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textTertiary};
  transition: color 150ms ease;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  line-height: 1;

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.borderFocused};
    outline-offset: 2px;
    border-radius: ${({ theme }) => theme.radii.sm};
  }
`;

const getDefaultIcon = (type: ToastVariant) => {
  switch (type) {
    case 'success': return '✓';
    case 'warning': return '⚠';
    case 'error': return '✕';
    case 'info':
    default: return 'ℹ';
  }
};

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({
    id,
    type = 'info',
    title,
    message,
    duration = 5000,
    dismissible = true,
    actions,
    icon,
    animationState = 'entering',
    onDismiss,
    onPause,
    onResume,
    'data-testid': dataTestId,
    className,
    ...props
  }, ref) => {
    const [isPaused, setIsPaused] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const startTimeRef = useRef<number>(Date.now());
    const pausedTimeRef = useRef<number>(0);

    // Auto-dismissal logic
    useEffect(() => {
      if (duration === 0 || animationState === 'exiting') return;

      const startTimer = () => {
        const remainingTime = duration - pausedTimeRef.current;
        timerRef.current = setTimeout(() => {
          onDismiss(id);
        }, remainingTime);
      };

      const stopTimer = () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      };

      if (isPaused) {
        stopTimer();
        onPause?.();
      } else {
        startTimer();
        onResume?.();
      }

      return stopTimer;
    }, [id, duration, isPaused, onDismiss, onPause, onResume, animationState]);

    const handleMouseEnter = () => {
      if (duration > 0) {
        setIsPaused(true);
        pausedTimeRef.current = Date.now() - startTimeRef.current;
      }
    };

    const handleMouseLeave = () => {
      if (duration > 0) {
        setIsPaused(false);
        startTimeRef.current = Date.now();
      }
    };

    const handleDismiss = () => {
      onDismiss(id);
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === 'Escape' && dismissible) {
        handleDismiss();
      }
    };

    return (
      /* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */
      <StyledToast
        ref={ref}
        $type={type}
        $animationState={animationState}
        className={className}
        data-testid={dataTestId}
        role="alert"
        aria-live="polite"
        aria-atomic="true"
        tabIndex={dismissible ? 0 : -1}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {/* Icon */}
        <StyledIcon $type={type}>
          {icon || getDefaultIcon(type)}
        </StyledIcon>

        {/* Content */}
        <StyledContent>
          <StyledTitle>
            {title}
          </StyledTitle>

          {message && (
            <StyledMessage>
              {message}
            </StyledMessage>
          )}

          {/* Actions */}
          {actions && actions.length > 0 && (
            <StyledActions>
              {actions.map((action, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant={action.variant || 'outline'}
                  onClick={action.onClick}
                >
                  {action.label}
                </Button>
              ))}
            </StyledActions>
          )}
        </StyledContent>

        {/* Dismiss Button */}
        {dismissible && (
          <StyledCloseButton
            onClick={handleDismiss}
            aria-label="Close toast"
          >
            ×
          </StyledCloseButton>
        )}
      </StyledToast>
      /* eslint-enable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */
    );
  }
);

Toast.displayName = 'Toast';
