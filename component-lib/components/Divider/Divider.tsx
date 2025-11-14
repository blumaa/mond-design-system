import { forwardRef } from 'react';
import { Box, BoxProps } from '../Box/Box';
import './divider.css';

export interface DividerProps extends Omit<BoxProps, 'children'> {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'subtle' | 'strong';
  size?: 'sm' | 'md' | 'lg';
}

export const Divider = forwardRef<HTMLElement, DividerProps>(({
  orientation = 'horizontal',
  variant = 'default',
  size = 'md',
  margin,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  className,
  ...props
}, ref) => {
  const isHorizontal = orientation === 'horizontal';

  // Default margins - horizontal dividers get vertical margins, vertical dividers get horizontal margins
  const margins = {
    margin,
    marginTop: marginTop !== undefined ? marginTop : (margin !== undefined ? margin : (isHorizontal ? '4' : undefined)),
    marginBottom: marginBottom !== undefined ? marginBottom : (margin !== undefined ? margin : (isHorizontal ? '4' : undefined)),
    marginLeft: marginLeft !== undefined ? marginLeft : (margin !== undefined ? margin : (isHorizontal ? undefined : '4')),
    marginRight: marginRight !== undefined ? marginRight : (margin !== undefined ? margin : (isHorizontal ? undefined : '4')),
  };

  const element = isHorizontal ? 'hr' : 'div';

  // Build CSS class names
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
      as={element}
      className={classNames}
      role="separator"
      {...(isHorizontal ? {} : { 'aria-orientation': 'vertical' })}
      {...margins}
      {...props}
    />
  );
});

Divider.displayName = 'Divider';