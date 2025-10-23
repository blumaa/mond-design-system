import { forwardRef } from 'react';
import { Box, BoxProps } from '../Box/Box';

export interface SpinnerProps extends Omit<BoxProps, 'children' | 'width' | 'height'> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  label?: string;
}

/**
 * Spinner Component
 *
 * A loading indicator with multiple sizes. Uses CSS animations for rotation.
 * Uses CSS variables for theming.
 *
 * **SSR-Compatible**: Uses CSS classes and CSS animations (no useEffect).
 * **Theme-Aware**: Automatically responds to data-theme attribute changes.
 *
 * @example
 * <Spinner />
 *
 * @example
 * <Spinner size="lg" label="Loading data..." />
 */
export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(({
  size = 'md',
  color,
  label = 'Loading...',
  className = '',
  style,
  ...props
}, ref) => {
  const classNames = [
    'mond-spinner',
    `mond-spinner--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const spinnerStyle = {
    ...(color && { borderTopColor: color }),
    ...style,
  };

  return (
    <Box
      ref={ref}
      className={classNames}
      style={spinnerStyle}
      role="status"
      aria-live="polite"
      {...props}
    >
      <span className="mond-spinner__label">
        {label}
      </span>
    </Box>
  );
});

Spinner.displayName = 'Spinner';

export default Spinner;
