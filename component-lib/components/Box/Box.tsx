import React, { forwardRef } from 'react';
import type { SpacingToken, SizeToken } from '../../tokens';
import './box.css';

export interface BoxProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
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

  // Layout props
  display?: 'flex' | 'block' | 'inline-block' | 'inline-flex' | 'grid' | 'inline-grid' | 'none';
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  alignContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'stretch';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  gap?: SizeToken;
  flex?: string;
  flexBasis?: string;
  width?: SizeToken;
  height?: SizeToken;

  // Visual props
  border?: 'subtle' | 'default' | 'strong';
  corners?: 'default' | 'rounded';
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

  // Layout props
  display,
  flexDirection,
  flexWrap,
  alignItems,
  alignContent,
  justifyContent,
  gap,
  flex,
  flexBasis,
  width,
  height,

  // Visual props
  border,
  corners,

  className,
  ...rest
}, ref) => {
  const Element = as as React.ElementType;

  // Build CSS class names from spacing and layout props
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

    // Layout classes
    display && `display-${display}`,
    flexDirection && `flex-direction-${flexDirection}`,
    flexWrap && `flex-wrap-${flexWrap}`,
    alignItems && `align-items-${alignItems}`,
    alignContent && `align-content-${alignContent}`,
    justifyContent && `justify-content-${justifyContent}`,
    gap && `gap-${gap}`,
    width && `width-${width}`,
    height && `height-${height}`,

    // Visual classes
    border && `mond-box--border-${border}`,
    corners && `mond-box--corners-${corners}`,

    // User-provided className
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Build inline styles for flex and flexBasis props (since they can have many values)
  const inlineStyles: React.CSSProperties = {};
  if (flex) inlineStyles.flex = flex;
  if (flexBasis) inlineStyles.flexBasis = flexBasis;

  return (
    <Element
      ref={ref}
      className={classNames || undefined}
      style={Object.keys(inlineStyles).length > 0 ? inlineStyles : undefined}
      {...rest}
    >
      {children}
    </Element>
  );
});

Box.displayName = 'Box';
