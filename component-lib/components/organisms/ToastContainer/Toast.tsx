'use client';
import React, { useEffect, useRef, useState } from 'react';
import { spacing, fontSizes, fontWeights, fontFamilies, radii } from '../../../tokens';
import { useThemeContext } from '../../providers/ThemeProvider';
import { Box } from '../../layout/Box/Box';
import { Button } from '../../atoms/Button/Button';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
}

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Unique identifier for the toast
   */
  id: string;
  
  /**
   * Toast type that determines colors and styling
   * @default 'info'
   */
  type?: ToastVariant;
  
  /**
   * Toast title
   */
  title: string;
  
  /**
   * Toast message content
   */
  message?: string;
  
  /**
   * Auto-dismissal duration in milliseconds (0 for no auto-dismiss)
   * @default 5000
   */
  duration?: number;
  
  /**
   * Whether the toast can be manually dismissed
   * @default true
   */
  dismissible?: boolean;
  
  /**
   * Action buttons to display
   */
  actions?: ToastAction[];
  
  /**
   * Custom icon to display instead of the default type icon
   */
  icon?: React.ReactNode;
  
  /**
   * Whether the toast is entering (mounting) or exiting (unmounting)
   * @default 'entering'
   */
  animationState?: 'entering' | 'visible' | 'exiting';
  
  /**
   * Callback when toast is dismissed
   */
  onDismiss: (toastId: string) => void;
  
  /**
   * Callback when toast timer is paused
   */
  onPause?: () => void;
  
  /**
   * Callback when toast timer is resumed
   */
  onResume?: () => void;
  
  /**
   * Dark mode
   * @default false
   */
  
  /**
   * Custom data testid for testing
   */
  'data-testid'?: string;
}

const getVariantStyles = (variant: ToastVariant, theme: (path: string) => string) => {
  switch (variant) {
    case 'success':
      return {
        backgroundColor: theme('feedback.success.background'),
        borderColor: theme('feedback.success.border'),
        iconColor: theme('feedback.success.text'),
        textColor: theme('text.primary'),
        icon: '✓',
      };
    case 'warning':
      return {
        backgroundColor: theme('feedback.warning.background'),
        borderColor: theme('feedback.warning.border'),
        iconColor: theme('feedback.warning.text'),
        textColor: theme('text.primary'),
        icon: '⚠',
      };
    case 'error':
      return {
        backgroundColor: theme('feedback.error.background'),
        borderColor: theme('feedback.error.border'),
        iconColor: theme('feedback.error.text'),
        textColor: theme('text.primary'),
        icon: '✕',
      };
    case 'info':
    default:
      return {
        backgroundColor: theme('feedback.info.background'),
        borderColor: theme('feedback.info.border'),
        iconColor: theme('feedback.info.text'),
        textColor: theme('text.primary'),
        icon: 'ℹ',
      };
  }
};

const getAnimationStyles = (animationState: 'entering' | 'visible' | 'exiting') => {
  const baseTransition = 'all 300ms cubic-bezier(0.16, 1, 0.3, 1)';
  
  switch (animationState) {
    case 'entering':
      return {
        transform: 'translateX(100%) scale(0.9)',
        opacity: 0,
        transition: baseTransition,
      };
    case 'visible':
      return {
        transform: 'translateX(0%) scale(1)',
        opacity: 1,
        transition: baseTransition,
      };
    case 'exiting':
      return {
        transform: 'translateX(100%) scale(0.9)',
        opacity: 0,
        transition: baseTransition,
      };
    default:
      return {};
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
    const { theme } = useThemeContext();
    const variantStyles = getVariantStyles(type, theme);
    const animationStyles = getAnimationStyles(animationState);
    
    // timeRemaining could be used for dynamic updates, currently uses duration
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

    // Progress calculation for potential progress indicator
    const progress = duration > 0 ? ((Date.now() - startTimeRef.current) / duration) * 100 : 0;

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
      <Box
        ref={ref}
        className={className}
        data-testid={dataTestId}
        role="alert"
        aria-live="polite"
        aria-atomic="true"
        tabIndex={0}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleKeyDown}
        style={{
          display: 'flex',
          padding: spacing[4],
          marginBottom: spacing[2],
          backgroundColor: variantStyles.backgroundColor,
          border: `1px solid ${variantStyles.borderColor}`,
          borderRadius: radii.lg,
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
          gap: spacing[3],
          minWidth: '320px',
          maxWidth: '420px',
          position: 'relative',
          cursor: 'default',
          ...animationStyles,
        }}
        {...props}
      >
        {/* Progress indicator for timed toasts */}
        {duration > 0 && !isPaused && (
          <Box
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              backgroundColor: variantStyles.iconColor,
              opacity: 0.3,
              borderRadius: `${radii.lg} ${radii.lg} 0 0`,
              transformOrigin: 'left',
              transform: `scaleX(${progress / 100})`,
              transition: 'transform 100ms linear',
            }}
          />
        )}

        {/* Icon */}
        <Box
          style={{
            flexShrink: 0,
            color: variantStyles.iconColor,
            fontSize: fontSizes.lg,
            fontWeight: fontWeights.bold,
            lineHeight: 1,
            marginTop: message ? '2px' : '0',
          }}
        >
          {icon || variantStyles.icon}
        </Box>

        {/* Content */}
        <Box
          style={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <Box
            as="h4"
            style={{
              margin: 0,
              marginBottom: message ? spacing[1] : 0,
              fontFamily: fontFamilies.sans,
              fontSize: fontSizes.sm,
              fontWeight: fontWeights.semibold,
              color: variantStyles.textColor,
              lineHeight: 1.4,
            }}
          >
            {title}
          </Box>
          
          {message && (
            <Box
              style={{
                fontFamily: fontFamilies.sans,
                fontSize: fontSizes.sm,
                color: variantStyles.textColor,
                lineHeight: 1.4,
                opacity: 0.9,
                margin: 0,
              }}
            >
              {message}
            </Box>
          )}

          {/* Actions */}
          {actions && actions.length > 0 && (
            <Box
              style={{
                display: 'flex',
                gap: spacing[2],
                marginTop: spacing[3],
                flexWrap: 'wrap',
              }}
            >
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
            </Box>
          )}
        </Box>

        {/* Dismiss Button */}
        {dismissible && (
          <Box
            style={{
              flexShrink: 0,
            }}
          >
            <Box
              as="button"
              onClick={handleDismiss}
              aria-label="Close toast"
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: spacing[1],
                color: variantStyles.textColor,
                fontSize: fontSizes.sm,
                lineHeight: 1,
                borderRadius: radii.sm,
                opacity: 0.6,
                transition: 'opacity 150ms ease',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.opacity = '0.6';
              }}
            >
              ×
            </Box>
          </Box>
        )}
      </Box>
    );
  }
);

Toast.displayName = 'Toast';

export default Toast;