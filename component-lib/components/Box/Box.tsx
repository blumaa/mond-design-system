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

  // Flexbox props
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  alignContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'stretch';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  flex?: string;

  // Grid props
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  gridAutoRows?: string;
  gridAutoColumns?: string;

  // Common layout props
  gap?: SizeToken;
  width?: SizeToken;
  height?: SizeToken;

  // Responsive layout
  /**
   * Enable responsive width with viewport-width calculations
   * Applies mobile, tablet, and desktop breakpoints to width only
   * @default false
   */
  responsiveWidth?: boolean;

  /**
   * Enable responsive height with viewport-width calculations
   * Applies mobile, tablet, and desktop breakpoints to height only
   * @default false
   */
  responsiveHeight?: boolean;

  /**
   * Enable responsive sizing for both width and height
   * Shorthand for responsiveWidth + responsiveHeight
   * @default false
   */
  responsive?: boolean;

  // Visual props
  border?: 'subtle' | 'default' | 'strong';
  corners?: 'none' | 'rounded-sm' | 'rounded-md' | 'rounded-lg' | 'rounded-xl' | 'rounded-2xl' | 'rounded-full';
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
  gridTemplateColumns,
  gridTemplateRows,
  gridAutoRows,
  gridAutoColumns,
  width,
  height,
  responsiveWidth = false,
  responsiveHeight = false,
  responsive = false,

  // Visual props
  border,
  corners = 'rounded-lg',

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
    (responsive || responsiveWidth) && 'mond-box--responsive-width',
    (responsive || responsiveHeight) && 'mond-box--responsive-height',

    // Visual classes
    border && `mond-box--border-${border}`,
    corners && `mond-box--corners-${corners}`,

    // User-provided className
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Build inline styles for props with many possible values
  const inlineStyles: React.CSSProperties = {};
  if (flex) inlineStyles.flex = flex;
  if (gridTemplateColumns) inlineStyles.gridTemplateColumns = gridTemplateColumns;
  if (gridTemplateRows) inlineStyles.gridTemplateRows = gridTemplateRows;
  if (gridAutoRows) inlineStyles.gridAutoRows = gridAutoRows;
  if (gridAutoColumns) inlineStyles.gridAutoColumns = gridAutoColumns;

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
