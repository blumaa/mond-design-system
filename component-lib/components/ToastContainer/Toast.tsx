import React, { useEffect, useRef, useState } from "react";
import { Button } from "../Button/Button";
import "./toast.css";
import { Icon } from "../Icon";

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface ToastAction {
  label: string;
  onClick: () => void;
  variant?: "primary" | "outline" | "ghost";
}

export interface ToastProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {
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
  animationState?: "entering" | "visible" | "exiting";

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
   * Custom data testid for testing
   */
  "data-testid"?: string;
}

const getDefaultIcon = (variant: ToastVariant): string => {
  switch (variant) {
    case "success":
      return "✓";
    case "warning":
      return "⚠";
    case "error":
      return "✕";
    case "info":
    default:
      return "ℹ";
  }
};

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      id,
      type = "info",
      title,
      message,
      duration = 5000,
      dismissible = true,
      actions,
      icon,
      animationState = "entering",
      onDismiss,
      onPause,
      onResume,
      "data-testid": dataTestId,
      ...props
    },
    ref,
  ) => {
    const [isPaused, setIsPaused] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const startTimeRef = useRef<number>(Date.now());
    const pausedTimeRef = useRef<number>(0);

    // Auto-dismissal logic
    useEffect(() => {
      if (duration === 0 || animationState === "exiting") return;

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
    const progress =
      duration > 0 ? ((Date.now() - startTimeRef.current) / duration) * 100 : 0;

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
      if (event.key === "Escape" && dismissible) {
        handleDismiss();
      }
    };

    // Build class names
    const toastClasses = [
      "mond-toast",
      `mond-toast--${type}`,
      `mond-toast--${animationState}`,
      message && "mond-toast--has-message",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        ref={ref}
        className={toastClasses}
        data-testid={dataTestId}
        role="alert"
        aria-live="polite"
        aria-atomic="true"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {/* Progress indicator for timed toasts */}
        {duration > 0 && !isPaused && (
          <div
            className="mond-toast__progress"
            style={{
              transform: `scaleX(${progress / 100})`,
            }}
          />
        )}

        {/* Icon */}
        <Icon size="lg">{icon || getDefaultIcon(type)}</Icon>

        {/* Content */}
        <div className="mond-toast__content">
          <h4
            className={`mond-toast__title${message ? " mond-toast__title--has-message" : ""}`}
          >
            {title}
          </h4>

          {message && <p className="mond-toast__message">{message}</p>}

          {/* Actions */}
          {actions && actions.length > 0 && (
            <div className="mond-toast__actions">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant={action.variant || "outline"}
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
          <Button
            variant="ghost"
            size="sm"
            iconOnly
            onClick={handleDismiss}
            onKeyDown={handleKeyDown}
            aria-label="Close toast"
          >
            ×
          </Button>
        )}
      </div>
    );
  },
);

Toast.displayName = "Toast";

export default Toast;
