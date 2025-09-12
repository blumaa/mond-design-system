'use client';
import React, { useState, useCallback, useEffect } from 'react';
import { spacing } from '../../../tokens';
import { Box } from '../../layout/Box/Box';
import { Toast, ToastAction, ToastVariant } from './Toast';

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

export interface ToastContainerProps extends React.HTMLAttributes<HTMLDivElement> {
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
   * Dark mode
   * @default false
   */
  
  /**
   * Custom data testid for testing
   */
  'data-testid'?: string;
}

interface ToastWithAnimation extends ToastData {
  animationState: 'entering' | 'visible' | 'exiting';
}

const getPositionStyles = (position: ToastPosition) => {
  const baseStyles = {
    position: 'fixed' as const,
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: spacing[2],
    maxWidth: '420px',
    width: 'auto',
  };

  switch (position) {
    case 'top-right':
      return {
        ...baseStyles,
        top: spacing[4],
        right: spacing[4],
      };
    case 'top-left':
      return {
        ...baseStyles,
        top: spacing[4],
        left: spacing[4],
      };
    case 'bottom-right':
      return {
        ...baseStyles,
        bottom: spacing[4],
        right: spacing[4],
        flexDirection: 'column-reverse' as const,
      };
    case 'bottom-left':
      return {
        ...baseStyles,
        bottom: spacing[4],
        left: spacing[4],
        flexDirection: 'column-reverse' as const,
      };
    case 'top-center':
      return {
        ...baseStyles,
        top: spacing[4],
        left: '50%',
        transform: 'translateX(-50%)',
        alignItems: 'center',
      };
    case 'bottom-center':
      return {
        ...baseStyles,
        bottom: spacing[4],
        left: '50%',
        transform: 'translateX(-50%)',
        alignItems: 'center',
        flexDirection: 'column-reverse' as const,
      };
    default:
      return baseStyles;
  }
};

export const ToastContainer = React.forwardRef<HTMLDivElement, ToastContainerProps>(
  ({
    position = 'top-right',
    maxToasts = 5,
    toasts,
    onDismiss,
    
    'data-testid': dataTestId,
    className,
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

    const positionStyles = getPositionStyles(position);

    // Don't render container if no toasts
    if (animatedToasts.length === 0) {
      return null;
    }

    return (
      <Box
        ref={ref}
        className={className}
        data-testid={dataTestId}
        role="region"
        aria-label="Toast notifications"
        aria-live="polite"
        style={positionStyles}
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
      </Box>
    );
  }
);

ToastContainer.displayName = 'ToastContainer';

export default ToastContainer;