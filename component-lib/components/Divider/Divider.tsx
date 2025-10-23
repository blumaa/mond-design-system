import { forwardRef } from 'react';
import { Box, BoxProps } from '../Box/Box';

export interface DividerProps extends Omit<BoxProps, 'children'> {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'subtle' | 'strong';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Divider Component
 *
 * A visual separator with support for horizontal/vertical orientation,
 * multiple variants, and sizes. Uses CSS variables for theming.
 *
 * **SSR-Compatible**: Uses CSS classes and CSS variables.
 * **Theme-Aware**: Automatically responds to data-theme attribute changes.
 *
 * @example
 * <Divider />
 *
 * @example
 * <Divider orientation="vertical" variant="strong" />
 */
export const Divider = forwardRef<HTMLHRElement, DividerProps>(({
  orientation = 'horizontal',
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}, ref) => {
  const classNames = [
    'mond-divider',
    `mond-divider--${orientation}`,
    `mond-divider--${variant}`,
    `mond-divider--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Box
      ref={ref}
      as="hr"
      className={classNames}
      {...props}
    />
  );
});

Divider.displayName = 'Divider';

