'use client';
import React, { useEffect, useRef, useState } from 'react';
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

    const toastClassNames = [
      'mond-toast',
      `mond-toast--${type}`,
      `mond-toast--${animationState}`,
      className,
    ].filter(Boolean).join(' ');

    const iconClassNames = [
      'mond-toast__icon',
      `mond-toast__icon--${type}`,
    ].filter(Boolean).join(' ');

    return (
      /* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */
      <div
        ref={ref}
        className={toastClassNames}
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
        <div className={iconClassNames}>
          {icon || getDefaultIcon(type)}
        </div>

        {/* Content */}
        <div className="mond-toast__content">
          <div className="mond-toast__title">
            {title}
          </div>

          {message && (
            <div className="mond-toast__message">
              {message}
            </div>
          )}

          {/* Actions */}
          {actions && actions.length > 0 && (
            <div className="mond-toast__actions">
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
            </div>
          )}
        </div>

        {/* Dismiss Button */}
        {dismissible && (
          <button
            className="mond-toast__close"
            onClick={handleDismiss}
            aria-label="Close toast"
          >
            ×
          </button>
        )}
      </div>
      /* eslint-enable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */
    );
  }
);

Toast.displayName = 'Toast';
export default Toast;
