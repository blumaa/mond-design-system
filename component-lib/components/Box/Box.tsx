import React, { forwardRef } from 'react';
import { tokens } from '../../tokens';

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;

  // Spacing
  p?: string | number;
  px?: string | number;
  py?: string | number;
  pt?: string | number;
  pr?: string | number;
  pb?: string | number;
  pl?: string | number;
  m?: string | number;
  mx?: string | number;
  my?: string | number;
  mt?: string | number;
  mr?: string | number;
  mb?: string | number;
  ml?: string | number;

  // Colors
  bg?: string;
  color?: string;
  borderColor?: string;

  // Layout
  display?: React.CSSProperties['display'];
  position?: React.CSSProperties['position'];
  top?: React.CSSProperties['top'];
  right?: React.CSSProperties['right'];
  bottom?: React.CSSProperties['bottom'];
  left?: React.CSSProperties['left'];
  zIndex?: React.CSSProperties['zIndex'];

  // Flexbox
  flex?: React.CSSProperties['flex'];
  flexDirection?: React.CSSProperties['flexDirection'];
  flexWrap?: React.CSSProperties['flexWrap'];
  alignItems?: React.CSSProperties['alignItems'];
  justifyContent?: React.CSSProperties['justifyContent'];
  alignContent?: React.CSSProperties['alignContent'];
  alignSelf?: React.CSSProperties['alignSelf'];
  justifySelf?: React.CSSProperties['justifySelf'];

  // Grid
  gridArea?: string;
  gridColumn?: string;
  gridRow?: string;
  gridAutoFlow?: string;
  gridTemplate?: string;
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  gap?: string | number;
  rowGap?: string | number;
  columnGap?: string | number;

  // Size
  width?: string | number;
  height?: string | number;
  minWidth?: string | number;
  minHeight?: string | number;
  maxWidth?: string | number;
  maxHeight?: string | number;

  // Border
  border?: string;
  borderWidth?: string | number;
  borderStyle?: string;
  borderRadius?: string | number;
  borderTop?: string;
  borderRight?: string;
  borderBottom?: string;
  borderLeft?: string;

  // Typography
  fontSize?: React.CSSProperties['fontSize'];
  fontWeight?: React.CSSProperties['fontWeight'];
  fontStyle?: React.CSSProperties['fontStyle'];
  lineHeight?: React.CSSProperties['lineHeight'];
  letterSpacing?: React.CSSProperties['letterSpacing'];
  textAlign?: React.CSSProperties['textAlign'];
  textTransform?: React.CSSProperties['textTransform'];
  textDecoration?: React.CSSProperties['textDecoration'];
  textOverflow?: React.CSSProperties['textOverflow'];
  whiteSpace?: React.CSSProperties['whiteSpace'];
  fontFamily?: React.CSSProperties['fontFamily'];

  // Effects
  boxShadow?: React.CSSProperties['boxShadow'];
  opacity?: React.CSSProperties['opacity'];
  cursor?: React.CSSProperties['cursor'];
  overflow?: React.CSSProperties['overflow'];
  overflowX?: React.CSSProperties['overflowX'];
  overflowY?: React.CSSProperties['overflowY'];
  transition?: React.CSSProperties['transition'];
  transform?: React.CSSProperties['transform'];
}

/**
 * Convert value to pixels if it's a number
 */
const convertToPixels = (value: string | number): string => {
  if (typeof value === 'number') {
    return `${value}px`;
  }
  return value;
};

/**
 * Convert token path or value to CSS variable or direct value
 * @param value - Can be a token path (e.g., "spacing.4"), token key (e.g., "4"), or raw value (e.g., "10px")
 * @param tokenType - Type of token (spacing, color, etc.)
 * @returns CSS variable reference or direct value
 */
const resolveTokenValue = (value: string | number, tokenType: 'spacing' | 'color' = 'spacing'): string => {
  if (typeof value === 'number') {
    return `${value}px`;
  }

  // Check if it's a semantic token path (contains dots)
  if (value.includes('.')) {
    // Convert path to CSS variable name
    // e.g., "surface.background" -> "var(--mond-surface-background)"
    const cssVarName = `--mond-${value.replace(/\./g, '-')}`;
    return `var(${cssVarName})`;
  }

  // Check if it's a numeric spacing token key (0, 1, 2, 3, 4, etc.)
  if (tokenType === 'spacing' && /^\d+$/.test(value)) {
    // Access spacing tokens to verify it exists
    const spacingValue = (tokens.spacing as Record<string, string>)[value];
    if (spacingValue) {
      // Use CSS variable for spacing
      return `var(--mond-spacing-${value})`;
    }
    // Fallback to pixels
    return `${value}px`;
  }

  // Raw value (e.g., "10px", "#ff0000", "auto", etc.)
  return value;
};

/**
 * Box Component
 *
 * A fundamental primitive component for layout and styling.
 * Provides shorthand props for common CSS properties.
 *
 * **SSR-Compatible**: Uses CSS variables instead of runtime theme resolution.
 * **Theme-Aware**: Automatically responds to data-theme attribute changes.
 *
 * @example
 * // Semantic token (responds to theme changes)
 * <Box bg="surface.background" color="text.primary" p="4">
 *   Content
 * </Box>
 *
 * @example
 * // Numeric spacing token
 * <Box p={4} m={2}>Content</Box>
 * // Renders: padding: var(--mond-spacing-4); margin: var(--mond-spacing-2);
 *
 * @example
 * // Raw values
 * <Box bg="#ff0000" p="20px">
 *   Content
 * </Box>
 *
 * @example
 * // Complex layout
 * <Box
 *   display="flex"
 *   flexDirection="column"
 *   gap={4}
 *   p={6}
 *   borderRadius={8}
 *   boxShadow="md"
 * >
 *   <Box>Item 1</Box>
 *   <Box>Item 2</Box>
 * </Box>
 */
export const Box = forwardRef<HTMLElement, BoxProps>(({
  as = 'div',
  children,
  className = '',

  // Spacing props
  p, px, py, pt, pr, pb, pl,
  m, mx, my, mt, mr, mb, ml,

  // Color props
  bg, color, borderColor,

  // Layout props
  display, position, top, right, bottom, left, zIndex,

  // Flexbox props
  flex, flexDirection, flexWrap, alignItems, justifyContent,
  alignContent, alignSelf, justifySelf,

  // Grid props
  gridArea, gridColumn, gridRow, gridAutoFlow, gridTemplate,
  gridTemplateColumns, gridTemplateRows, gap, rowGap, columnGap,

  // Size props
  width, height, minWidth, minHeight, maxWidth, maxHeight,

  // Border props
  border, borderWidth, borderStyle, borderRadius,
  borderTop, borderRight, borderBottom, borderLeft,

  // Typography props
  fontSize, fontWeight, fontStyle, lineHeight, letterSpacing, textAlign, textTransform, textDecoration,
  textOverflow, whiteSpace, fontFamily,

  // Effect props
  boxShadow, opacity, cursor, overflow, overflowX, overflowY, transition, transform,

  ...rest
}, ref) => {
  const Element = as as React.ElementType;

  const styles: React.CSSProperties = {
    // Spacing
    ...(p !== undefined && { padding: resolveTokenValue(p, 'spacing') }),
    ...(px !== undefined && {
      paddingLeft: resolveTokenValue(px, 'spacing'),
      paddingRight: resolveTokenValue(px, 'spacing')
    }),
    ...(py !== undefined && {
      paddingTop: resolveTokenValue(py, 'spacing'),
      paddingBottom: resolveTokenValue(py, 'spacing')
    }),
    ...(pt !== undefined && { paddingTop: resolveTokenValue(pt, 'spacing') }),
    ...(pr !== undefined && { paddingRight: resolveTokenValue(pr, 'spacing') }),
    ...(pb !== undefined && { paddingBottom: resolveTokenValue(pb, 'spacing') }),
    ...(pl !== undefined && { paddingLeft: resolveTokenValue(pl, 'spacing') }),

    ...(m !== undefined && { margin: resolveTokenValue(m, 'spacing') }),
    ...(mx !== undefined && {
      marginLeft: resolveTokenValue(mx, 'spacing'),
      marginRight: resolveTokenValue(mx, 'spacing')
    }),
    ...(my !== undefined && {
      marginTop: resolveTokenValue(my, 'spacing'),
      marginBottom: resolveTokenValue(my, 'spacing')
    }),
    ...(mt !== undefined && { marginTop: resolveTokenValue(mt, 'spacing') }),
    ...(mr !== undefined && { marginRight: resolveTokenValue(mr, 'spacing') }),
    ...(mb !== undefined && { marginBottom: resolveTokenValue(mb, 'spacing') }),
    ...(ml !== undefined && { marginLeft: resolveTokenValue(ml, 'spacing') }),

    // Colors - convert semantic tokens to CSS variables
    ...(bg && { backgroundColor: resolveTokenValue(bg, 'color') }),
    ...(color && { color: resolveTokenValue(color, 'color') }),
    ...(borderColor && { borderColor: resolveTokenValue(borderColor, 'color') }),

    // Layout
    ...(display && { display }),
    ...(position && { position }),
    ...(top !== undefined && { top: convertToPixels(top) }),
    ...(right !== undefined && { right: convertToPixels(right) }),
    ...(bottom !== undefined && { bottom: convertToPixels(bottom) }),
    ...(left !== undefined && { left: convertToPixels(left) }),
    ...(zIndex !== undefined && { zIndex }),

    // Flexbox
    ...(flex !== undefined && { flex }),
    ...(flexDirection && { flexDirection }),
    ...(flexWrap && { flexWrap }),
    ...(alignItems && { alignItems }),
    ...(justifyContent && { justifyContent }),
    ...(alignContent && { alignContent }),
    ...(alignSelf && { alignSelf }),
    ...(justifySelf && { justifySelf }),

    // Grid
    ...(gridArea && { gridArea }),
    ...(gridColumn && { gridColumn }),
    ...(gridRow && { gridRow }),
    ...(gridAutoFlow && { gridAutoFlow }),
    ...(gridTemplate && { gridTemplate }),
    ...(gridTemplateColumns && { gridTemplateColumns }),
    ...(gridTemplateRows && { gridTemplateRows }),
    ...(gap !== undefined && { gap: resolveTokenValue(gap, 'spacing') }),
    ...(rowGap !== undefined && { rowGap: resolveTokenValue(rowGap, 'spacing') }),
    ...(columnGap !== undefined && { columnGap: resolveTokenValue(columnGap, 'spacing') }),

    // Size
    ...(width !== undefined && { width: convertToPixels(width) }),
    ...(height !== undefined && { height: convertToPixels(height) }),
    ...(minWidth !== undefined && { minWidth: convertToPixels(minWidth) }),
    ...(minHeight !== undefined && { minHeight: convertToPixels(minHeight) }),
    ...(maxWidth !== undefined && { maxWidth: convertToPixels(maxWidth) }),
    ...(maxHeight !== undefined && { maxHeight: convertToPixels(maxHeight) }),

    // Border
    ...(border && { border }),
    ...(borderWidth !== undefined && { borderWidth: convertToPixels(borderWidth) }),
    ...(borderStyle && { borderStyle }),
    ...(borderRadius !== undefined && { borderRadius: convertToPixels(borderRadius) }),
    ...(borderTop && { borderTop }),
    ...(borderRight && { borderRight }),
    ...(borderBottom && { borderBottom }),
    ...(borderLeft && { borderLeft }),

    // Typography
    ...(fontSize !== undefined && { fontSize: convertToPixels(fontSize) }),
    ...(fontWeight !== undefined && { fontWeight }),
    ...(fontStyle && { fontStyle }),
    ...(lineHeight !== undefined && { lineHeight }),
    ...(letterSpacing && { letterSpacing }),
    ...(textAlign && { textAlign }),
    ...(textTransform && { textTransform }),
    ...(textDecoration && { textDecoration }),
    ...(textOverflow && { textOverflow }),
    ...(whiteSpace && { whiteSpace }),
    ...(fontFamily && { fontFamily }),

    // Effects
    ...(boxShadow && { boxShadow }),
    ...(opacity !== undefined && { opacity }),
    ...(cursor && { cursor }),
    ...(overflow && { overflow }),
    ...(overflowX && { overflowX }),
    ...(overflowY && { overflowY }),
    ...(transition && { transition }),
    ...(transform && { transform }),
  };

  return (
    <Element
      ref={ref}
      className={className}
      style={styles}
      {...rest}
    >
      {children}
    </Element>
  );
});

Box.displayName = 'Box';
