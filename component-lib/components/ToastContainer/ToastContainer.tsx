import React, { useState, useCallback, useEffect } from 'react';
import { Toast, ToastAction, ToastVariant } from './Toast';
import './toastcontainer.css';

export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

export interface ToastData {
  id: string;
  type: ToastVariant;
  title: string;
  message?: string;
  duration?: number; // milliseconds, 0 for persistent
  actions?: ToastAction[];
  icon?: React.ReactNode;
  dismissible?: boolean;
}

export interface ToastContainerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'className'> {
  /**
   * Position of the toast container on screen
   * @default 'top-right'
   */
  position?: ToastPosition;

  /**
   * Maximum number of toasts to display simultaneously
   * @default 5
   */
  maxToasts?: number;

  /**
   * Array of toast data to display
   */
  toasts: ToastData[];

  /**
   * Callback when a toast is dismissed
   */
  onDismiss: (toastId: string) => void;

  /**
   * Custom data testid for testing
   */
  'data-testid'?: string;
}

interface ToastWithAnimation extends ToastData {
  animationState: 'entering' | 'visible' | 'exiting';
}

export const ToastContainer = React.forwardRef<HTMLDivElement, ToastContainerProps>(
  ({
    position = 'top-right',
    maxToasts = 5,
    toasts,
    onDismiss,
    'data-testid': dataTestId,
    ...props
  }, ref) => {
    const [animatedToasts, setAnimatedToasts] = useState<ToastWithAnimation[]>([]);

    // Handle toast animations and lifecycle
    useEffect(() => {
      setAnimatedToasts(prevAnimatedToasts => {
        const currentIds = new Set(toasts.map(t => t.id));
        const prevIds = new Set(prevAnimatedToasts.map(t => t.id));

        // Handle new toasts (entering)
        const newToasts = toasts.filter(toast => !prevIds.has(toast.id));
        const enteringToasts: ToastWithAnimation[] = newToasts.map(toast => ({
          ...toast,
          animationState: 'entering',
        }));

        // Handle existing toasts
        const existingToasts = prevAnimatedToasts.map(toast => {
          if (currentIds.has(toast.id)) {
            // Toast still exists - ensure it's visible if it was entering
            return {
              ...toast,
              ...toasts.find(t => t.id === toast.id)!,
              animationState: toast.animationState === 'entering' ? 'visible' : toast.animationState,
            };
          } else {
            // Toast should be removed - mark as exiting
            return {
              ...toast,
              animationState: 'exiting' as const,
            };
          }
        });

        const updatedToasts = [...existingToasts, ...enteringToasts];

        // Respect maxToasts limit by only showing the most recent toasts
        const nonExitingToasts = updatedToasts.filter(t => t.animationState !== 'exiting');
        if (nonExitingToasts.length > maxToasts) {
          // Keep only the most recent toasts (last maxToasts items)
          const toastsToShow = nonExitingToasts.slice(-maxToasts);
          const toastsToShowIds = new Set(toastsToShow.map(t => t.id));

          return updatedToasts.filter(toast => {
            if (toast.animationState === 'exiting') return true;
            return toastsToShowIds.has(toast.id);
          });
        }

        return updatedToasts;
      });
    }, [toasts, maxToasts]);

    // Animation state transitions
    useEffect(() => {
      const enteringToasts = animatedToasts.filter(t => t.animationState === 'entering');

      if (enteringToasts.length > 0) {
        // Set entering toasts to visible after a short delay
        const timer = setTimeout(() => {
          setAnimatedToasts(prev => prev.map(toast =>
            toast.animationState === 'entering'
              ? { ...toast, animationState: 'visible' }
              : toast
          ));
        }, 50);

        return () => clearTimeout(timer);
      }
    }, [animatedToasts]);

    const handleDismiss = useCallback((toastId: string) => {
      // Mark toast as exiting
      setAnimatedToasts(prev => prev.map(toast =>
        toast.id === toastId
          ? { ...toast, animationState: 'exiting' }
          : toast
      ));

      // Remove from DOM after animation completes
      setTimeout(() => {
        setAnimatedToasts(prev => prev.filter(toast => toast.id !== toastId));
        onDismiss(toastId);
      }, 300);
    }, [onDismiss]);

    // Don't render container if no toasts
    if (animatedToasts.length === 0) {
      return null;
    }

    // Build class names
    const containerClasses = [
      'mond-toast-container',
      `mond-toast-container--${position}`,
    ].filter(Boolean).join(' ');

    return (
      <div
        ref={ref}
        className={containerClasses}
        data-testid={dataTestId}
        role="region"
        aria-label="Toast notifications"
        aria-live="polite"
        {...props}
      >
        {animatedToasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            type={toast.type}
            title={toast.title}
            message={toast.message}
            duration={toast.duration}
            dismissible={toast.dismissible}
            actions={toast.actions}
            icon={toast.icon}
            animationState={toast.animationState}
            onDismiss={handleDismiss}
            data-testid={`${dataTestId || 'toast-container'}-toast-${toast.id}`}
          />
        ))}
      </div>
    );
  }
);

ToastContainer.displayName = 'ToastContainer';

export default ToastContainer;
