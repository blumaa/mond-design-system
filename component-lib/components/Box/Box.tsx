import React, { forwardRef } from 'react';
import type { SpacingToken } from '../../tokens';
import './box.css';

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;

  // Spacing with FULL names (not abbreviations) using strict token keys
  margin?: SpacingToken;
  marginTop?: SpacingToken;
  marginRight?: SpacingToken;
  marginBottom?: SpacingToken;
  marginLeft?: SpacingToken;

  padding?: SpacingToken;
  paddingTop?: SpacingToken;
  paddingRight?: SpacingToken;
  paddingBottom?: SpacingToken;
  paddingLeft?: SpacingToken;
}

/**
 * Box Component
 *
 * A minimal, primitive component for layout spacing.
 * Uses CSS utility classes mapped to design tokens via CSS variables.
 *
 * **SSR-Compatible**: Pure CSS classes, no runtime theme resolution.
 * **Theme-Aware**: Automatically responds to data-theme attribute changes via CSS.
 *
 * @example
 * // Basic padding
 * <Box padding="4">Content</Box>
 *
 * @example
 * // Margin and padding
 * <Box margin="8" padding="4">Content</Box>
 *
 * @example
 * // Individual sides
 * <Box marginTop="2" paddingLeft="6">Content</Box>
 *
 * @example
 * // Custom element
 * <Box as="section" padding="4">Section content</Box>
 */
export const Box = forwardRef<HTMLElement, BoxProps>(({
  as = 'div',
  children,

  // Spacing props
  margin,
  marginTop,
  marginRight,
  marginBottom,
  marginLeft,

  padding,
  paddingTop,
  paddingRight,
  paddingBottom,
  paddingLeft,

  className,
  ...rest
}, ref) => {
  const Element = as as React.ElementType;

  // Build CSS class names from spacing props
  const classNames = [
    // Margin classes
    margin && `m-${margin}`,
    marginTop && `mt-${marginTop}`,
    marginRight && `mr-${marginRight}`,
    marginBottom && `mb-${marginBottom}`,
    marginLeft && `ml-${marginLeft}`,

    // Padding classes
    padding && `p-${padding}`,
    paddingTop && `pt-${paddingTop}`,
    paddingRight && `pr-${paddingRight}`,
    paddingBottom && `pb-${paddingBottom}`,
    paddingLeft && `pl-${paddingLeft}`,

    // User-provided className
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Element
      ref={ref}
      className={classNames || undefined}
      {...rest}
    >
      {children}
    </Element>
  );
});

Box.displayName = 'Box';
