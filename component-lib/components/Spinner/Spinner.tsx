import { forwardRef } from 'react';
import './spinner.css';

export interface SpinnerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'className'> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  label?: string;
}

export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(({
  size = 'md',
  color,
  label = 'Loading...',
  style,
  ...props
}, ref) => {
  // Build class names
  const spinnerClasses = [
    'mond-spinner',
    `mond-spinner--${size}`,
    color ? 'mond-spinner--custom' : 'mond-spinner--default',
  ].filter(Boolean).join(' ');

  // Merge custom color into style if provided
  const spinnerStyle = color
    ? { '--spinner-custom-color': color, ...style } as React.CSSProperties
    : style;

  return (
    <div
      ref={ref}
      className={spinnerClasses}
      style={spinnerStyle}
      role="status"
      aria-label={label}
      {...props}
    >
      <span className="mond-spinner__label">
        {label}
      </span>
    </div>
  );
});

Spinner.displayName = 'Spinner';
