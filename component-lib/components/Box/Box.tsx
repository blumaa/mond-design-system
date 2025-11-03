import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { DefaultTheme } from 'styled-components';

/**
 * Box Props - System-style utility props for layout and styling
 * Inspired by styled-system and xstyled patterns but using plain styled-components
 */
export interface BoxProps extends Omit<React.HTMLAttributes<HTMLElement>, 'color'> {
  as?: React.ElementType;

  // Colors
  backgroundColor?: keyof DefaultTheme['colors'] | string | number;
  color?: keyof DefaultTheme['colors'] | 'currentcolor' | 'inherit' | string | number;

  // Border Shorthand
  border?: string;
  borderTop?: string;
  borderRight?: string;
  borderBottom?: string;
  borderLeft?: string;

  // Border Colors
  borderColor?: keyof DefaultTheme['colors'] | string;
  borderTopColor?: keyof DefaultTheme['colors'] | string;
  borderRightColor?: keyof DefaultTheme['colors'] | string;
  borderBottomColor?: keyof DefaultTheme['colors'] | string;
  borderLeftColor?: keyof DefaultTheme['colors'] | string;

  // Border Styles
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  borderTopStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  borderRightStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  borderBottomStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  borderLeftStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';

  // Border Widths
  borderWidth?: string | number;
  borderTopWidth?: string | number;
  borderRightWidth?: string | number;
  borderBottomWidth?: string | number;
  borderLeftWidth?: string | number;

  // Border Radius
  borderRadius?: keyof DefaultTheme['radii'] | string | number;

  // Shadows
  boxShadow?: keyof DefaultTheme['shadows'] | 'none' | string;

  // Typography
  fontFamily?: keyof DefaultTheme['fonts'] | 'inherit' | string;
  fontSize?: keyof DefaultTheme['fontSizes'] | 'inherit' | string | number;
  fontWeight?: keyof DefaultTheme['fontWeights'] | 'inherit' | string | number;
  fontStyle?: React.CSSProperties['fontStyle'];
  lineHeight?: keyof DefaultTheme['lineHeights'] | 'inherit' | string | number;

  // Spacing - Margin
  margin?: keyof DefaultTheme['space'] | string | number;
  marginTop?: keyof DefaultTheme['space'] | string | number;
  marginRight?: keyof DefaultTheme['space'] | 'auto' | string | number;
  marginBottom?: keyof DefaultTheme['space'] | string | number;
  marginLeft?: keyof DefaultTheme['space'] | 'auto' | string | number;

  // Spacing - Padding
  padding?: keyof DefaultTheme['space'] | string | number;
  paddingTop?: keyof DefaultTheme['space'] | string | number;
  paddingRight?: keyof DefaultTheme['space'] | string | number;
  paddingBottom?: keyof DefaultTheme['space'] | string | number;
  paddingLeft?: keyof DefaultTheme['space'] | string | number;

  // Grid/Flexbox Gaps
  gap?: keyof DefaultTheme['space'] | string | number;
  gridGap?: keyof DefaultTheme['space'] | string | number;
  gridRowGap?: keyof DefaultTheme['space'] | string | number;
  gridColumnGap?: keyof DefaultTheme['space'] | string | number;

  // Z-Index
  zIndex?: number | string;

  // Layout props (passed through as standard CSS)
  display?: React.CSSProperties['display'];
  position?: React.CSSProperties['position'];
  top?: React.CSSProperties['top'];
  right?: React.CSSProperties['right'];
  bottom?: React.CSSProperties['bottom'];
  left?: React.CSSProperties['left'];
  width?: React.CSSProperties['width'];
  height?: React.CSSProperties['height'];
  minWidth?: React.CSSProperties['minWidth'];
  minHeight?: React.CSSProperties['minHeight'];
  maxWidth?: React.CSSProperties['maxWidth'];
  maxHeight?: React.CSSProperties['maxHeight'];

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
  gridArea?: React.CSSProperties['gridArea'];
  gridColumn?: React.CSSProperties['gridColumn'];
  gridRow?: React.CSSProperties['gridRow'];
  gridAutoFlow?: React.CSSProperties['gridAutoFlow'];
  gridTemplate?: React.CSSProperties['gridTemplate'];
  gridTemplateColumns?: React.CSSProperties['gridTemplateColumns'];
  gridTemplateRows?: React.CSSProperties['gridTemplateRows'];

  // Effects
  opacity?: React.CSSProperties['opacity'];
  overflow?: React.CSSProperties['overflow'];
  overflowX?: React.CSSProperties['overflowX'];
  overflowY?: React.CSSProperties['overflowY'];
  cursor?: React.CSSProperties['cursor'];
  transition?: React.CSSProperties['transition'];
  transform?: React.CSSProperties['transform'];

  // Text
  textAlign?: React.CSSProperties['textAlign'];
  textTransform?: React.CSSProperties['textTransform'];
  textDecoration?: React.CSSProperties['textDecoration'];
  textOverflow?: React.CSSProperties['textOverflow'];
  whiteSpace?: React.CSSProperties['whiteSpace'];
  letterSpacing?: React.CSSProperties['letterSpacing'];
}

// List of Box style props that should not be forwarded to the DOM
const styleProps = new Set([
  'backgroundColor',
  'color',
  'border',
  'borderTop',
  'borderRight',
  'borderBottom',
  'borderLeft',
  'borderColor',
  'borderTopColor',
  'borderRightColor',
  'borderBottomColor',
  'borderLeftColor',
  'borderStyle',
  'borderTopStyle',
  'borderRightStyle',
  'borderBottomStyle',
  'borderLeftStyle',
  'borderWidth',
  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',
  'borderRadius',
  'boxShadow',
  'fontFamily',
  'fontSize',
  'fontWeight',
  'fontStyle',
  'lineHeight',
  'margin',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'padding',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'gap',
  'gridGap',
  'gridRowGap',
  'gridColumnGap',
  // Layout and positioning props
  'zIndex',
  'minWidth',
  'maxWidth',
  'minHeight',
  'maxHeight',
  // Flexbox props
  'flexDirection',
  'flexWrap',
  'alignItems',
  'justifyContent',
  'alignContent',
  'alignSelf',
  'justifySelf',
  // Grid props
  'gridArea',
  'gridColumn',
  'gridRow',
  'gridAutoFlow',
  'gridTemplate',
  'gridTemplateColumns',
  'gridTemplateRows',
  // Text props
  'textAlign',
  'textTransform',
  'textDecoration',
  'textOverflow',
  'whiteSpace',
  'letterSpacing',
]);

/**
 * Box - A fundamental utility component for layout and styling
 *
 * Provides system-style props that map to theme tokens for type-safe,
 * consistent styling across your application.
 *
 * @example
 * <Box
 *   backgroundColor="brandPrimary600"
 *   padding="4"
 *   borderRadius="md"
 * >
 *   Content
 * </Box>
 */
const StyledBox = styled.div.withConfig({
  shouldForwardProp: (prop) => !styleProps.has(prop),
})<BoxProps>`
  box-sizing: border-box;

  /* Colors */
  ${({ backgroundColor, theme }) =>
    backgroundColor && `background-color: ${theme.colors[backgroundColor as string] || backgroundColor};`}
  ${({ color, theme }) => {
    if (!color || color === 'currentcolor' || color === 'inherit') {
      return color ? `color: ${color};` : '';
    }
    return `color: ${theme?.colors?.[color as string] || color};`;
  }}

  /* Border Shorthand */
  ${({ border }) => border && `border: ${border};`}
  ${({ borderTop }) => borderTop && `border-top: ${borderTop};`}
  ${({ borderRight }) => borderRight && `border-right: ${borderRight};`}
  ${({ borderBottom }) => borderBottom && `border-bottom: ${borderBottom};`}
  ${({ borderLeft }) => borderLeft && `border-left: ${borderLeft};`}

  /* Border Colors */
  ${({ borderColor, theme }) =>
    borderColor && `border-color: ${theme.colors[borderColor as string] || borderColor};`}
  ${({ borderTopColor, theme }) =>
    borderTopColor && `border-top-color: ${theme.colors[borderTopColor as string] || borderTopColor};`}
  ${({ borderRightColor, theme }) =>
    borderRightColor && `border-right-color: ${theme.colors[borderRightColor as string] || borderRightColor};`}
  ${({ borderBottomColor, theme }) =>
    borderBottomColor && `border-bottom-color: ${theme.colors[borderBottomColor as string] || borderBottomColor};`}
  ${({ borderLeftColor, theme }) =>
    borderLeftColor && `border-left-color: ${theme.colors[borderLeftColor as string] || borderLeftColor};`}

  /* Border Styles */
  ${({ borderStyle }) => borderStyle && `border-style: ${borderStyle};`}
  ${({ borderTopStyle }) => borderTopStyle && `border-top-style: ${borderTopStyle};`}
  ${({ borderRightStyle }) => borderRightStyle && `border-right-style: ${borderRightStyle};`}
  ${({ borderBottomStyle }) => borderBottomStyle && `border-bottom-style: ${borderBottomStyle};`}
  ${({ borderLeftStyle }) => borderLeftStyle && `border-left-style: ${borderLeftStyle};`}

  /* Border Widths */
  ${({ borderWidth }) =>
    borderWidth && `border-width: ${typeof borderWidth === 'number' ? `${borderWidth}px` : borderWidth};`}
  ${({ borderTopWidth }) =>
    borderTopWidth && `border-top-width: ${typeof borderTopWidth === 'number' ? `${borderTopWidth}px` : borderTopWidth};`}
  ${({ borderRightWidth }) =>
    borderRightWidth && `border-right-width: ${typeof borderRightWidth === 'number' ? `${borderRightWidth}px` : borderRightWidth};`}
  ${({ borderBottomWidth }) =>
    borderBottomWidth && `border-bottom-width: ${typeof borderBottomWidth === 'number' ? `${borderBottomWidth}px` : borderBottomWidth};`}
  ${({ borderLeftWidth }) =>
    borderLeftWidth && `border-left-width: ${typeof borderLeftWidth === 'number' ? `${borderLeftWidth}px` : borderLeftWidth};`}

  /* Border Radius */
  ${({ borderRadius, theme }) =>
    borderRadius && `border-radius: ${
      typeof borderRadius === 'number'
        ? `${borderRadius}px`
        : theme.radii[borderRadius as string] || borderRadius
    };`}

  /* Box Shadow */
  ${({ boxShadow, theme }) =>
    boxShadow && boxShadow !== 'none' && `box-shadow: ${theme.shadows[boxShadow as string] || boxShadow};`}
  ${({ boxShadow }) => boxShadow === 'none' && `box-shadow: none;`}

  /* Typography */
  ${({ fontFamily, theme }) =>
    fontFamily && fontFamily !== 'inherit' && `font-family: ${(theme.fonts as Record<string, string>)[fontFamily as string] || fontFamily};`}
  ${({ fontFamily }) => fontFamily === 'inherit' && `font-family: inherit;`}
  ${({ fontSize, theme }) =>
    fontSize && fontSize !== 'inherit' && `font-size: ${
      typeof fontSize === 'number'
        ? `${fontSize}px`
        : theme.fontSizes[fontSize as keyof typeof theme.fontSizes] || fontSize
    };`}
  ${({ fontSize }) => fontSize === 'inherit' && `font-size: inherit;`}
  ${({ fontWeight, theme }) =>
    fontWeight && fontWeight !== 'inherit' && `font-weight: ${theme.fontWeights[fontWeight as keyof typeof theme.fontWeights] || fontWeight};`}
  ${({ fontWeight }) => fontWeight === 'inherit' && `font-weight: inherit;`}
  ${({ fontStyle }) => fontStyle && `font-style: ${fontStyle};`}
  ${({ lineHeight, theme }) =>
    lineHeight && lineHeight !== 'inherit' && `line-height: ${theme.lineHeights[lineHeight as keyof typeof theme.lineHeights] || lineHeight};`}
  ${({ lineHeight }) => lineHeight === 'inherit' && `line-height: inherit;`}

  /* Margin */
  ${({ margin, theme }) =>
    margin !== undefined && `margin: ${typeof margin === 'number' ? `${margin}px` : theme.space[margin as string] || margin};`}
  ${({ marginTop, theme }) =>
    marginTop !== undefined && `margin-top: ${typeof marginTop === 'number' ? `${marginTop}px` : theme.space[marginTop as string] || marginTop};`}
  ${({ marginRight, theme }) =>
    marginRight !== undefined && marginRight !== 'auto' && `margin-right: ${typeof marginRight === 'number' ? `${marginRight}px` : theme.space[marginRight as string] || marginRight};`}
  ${({ marginRight }) => marginRight === 'auto' && `margin-right: auto;`}
  ${({ marginBottom, theme }) =>
    marginBottom !== undefined && `margin-bottom: ${typeof marginBottom === 'number' ? `${marginBottom}px` : theme.space[marginBottom as string] || marginBottom};`}
  ${({ marginLeft, theme }) =>
    marginLeft !== undefined && marginLeft !== 'auto' && `margin-left: ${typeof marginLeft === 'number' ? `${marginLeft}px` : theme.space[marginLeft as string] || marginLeft};`}
  ${({ marginLeft }) => marginLeft === 'auto' && `margin-left: auto;`}

  /* Padding */
  ${({ padding, theme }) =>
    padding !== undefined && `padding: ${typeof padding === 'number' ? `${padding}px` : theme.space[padding as string] || padding};`}
  ${({ paddingTop, theme }) =>
    paddingTop !== undefined && `padding-top: ${typeof paddingTop === 'number' ? `${paddingTop}px` : theme.space[paddingTop as string] || paddingTop};`}
  ${({ paddingRight, theme }) =>
    paddingRight !== undefined && `padding-right: ${typeof paddingRight === 'number' ? `${paddingRight}px` : theme.space[paddingRight as string] || paddingRight};`}
  ${({ paddingBottom, theme }) =>
    paddingBottom !== undefined && `padding-bottom: ${typeof paddingBottom === 'number' ? `${paddingBottom}px` : theme.space[paddingBottom as string] || paddingBottom};`}
  ${({ paddingLeft, theme }) =>
    paddingLeft !== undefined && `padding-left: ${typeof paddingLeft === 'number' ? `${paddingLeft}px` : theme.space[paddingLeft as string] || paddingLeft};`}

  /* Gaps */
  ${({ gap, theme }) =>
    gap !== undefined && `gap: ${typeof gap === 'number' ? `${gap}px` : theme.space[gap as string] || gap};`}
  ${({ gridGap, theme }) =>
    gridGap !== undefined && `grid-gap: ${typeof gridGap === 'number' ? `${gridGap}px` : theme.space[gridGap as string] || gridGap};`}
  ${({ gridRowGap, theme }) =>
    gridRowGap !== undefined && `grid-row-gap: ${typeof gridRowGap === 'number' ? `${gridRowGap}px` : theme.space[gridRowGap as string] || gridRowGap};`}
  ${({ gridColumnGap, theme }) =>
    gridColumnGap !== undefined && `grid-column-gap: ${typeof gridColumnGap === 'number' ? `${gridColumnGap}px` : theme.space[gridColumnGap as string] || gridColumnGap};`}

  /* Z-Index */
  ${({ zIndex }) => zIndex !== undefined && `z-index: ${zIndex};`}

  /* Layout */
  ${({ display }) => display && `display: ${display};`}
  ${({ position }) => position && `position: ${position};`}
  ${({ top }) => top !== undefined && `top: ${typeof top === 'number' ? `${top}px` : top};`}
  ${({ right }) => right !== undefined && `right: ${typeof right === 'number' ? `${right}px` : right};`}
  ${({ bottom }) => bottom !== undefined && `bottom: ${typeof bottom === 'number' ? `${bottom}px` : bottom};`}
  ${({ left }) => left !== undefined && `left: ${typeof left === 'number' ? `${left}px` : left};`}
  ${({ width }) => width !== undefined && `width: ${typeof width === 'number' ? `${width}px` : width};`}
  ${({ height }) => height !== undefined && `height: ${typeof height === 'number' ? `${height}px` : height};`}
  ${({ minWidth }) => minWidth !== undefined && `min-width: ${typeof minWidth === 'number' ? `${minWidth}px` : minWidth};`}
  ${({ minHeight }) => minHeight !== undefined && `min-height: ${typeof minHeight === 'number' ? `${minHeight}px` : minHeight};`}
  ${({ maxWidth }) => maxWidth !== undefined && `max-width: ${typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth};`}
  ${({ maxHeight }) => maxHeight !== undefined && `max-height: ${typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight};`}

  /* Flexbox */
  ${({ flex }) => flex !== undefined && `flex: ${flex};`}
  ${({ flexDirection }) => flexDirection && `flex-direction: ${flexDirection};`}
  ${({ flexWrap }) => flexWrap && `flex-wrap: ${flexWrap};`}
  ${({ alignItems }) => alignItems && `align-items: ${alignItems};`}
  ${({ justifyContent }) => justifyContent && `justify-content: ${justifyContent};`}
  ${({ alignContent }) => alignContent && `align-content: ${alignContent};`}
  ${({ alignSelf }) => alignSelf && `align-self: ${alignSelf};`}
  ${({ justifySelf }) => justifySelf && `justify-self: ${justifySelf};`}

  /* Grid */
  ${({ gridArea }) => gridArea && `grid-area: ${gridArea};`}
  ${({ gridColumn }) => gridColumn && `grid-column: ${gridColumn};`}
  ${({ gridRow }) => gridRow && `grid-row: ${gridRow};`}
  ${({ gridAutoFlow }) => gridAutoFlow && `grid-auto-flow: ${gridAutoFlow};`}
  ${({ gridTemplate }) => gridTemplate && `grid-template: ${gridTemplate};`}
  ${({ gridTemplateColumns }) => gridTemplateColumns && `grid-template-columns: ${gridTemplateColumns};`}
  ${({ gridTemplateRows }) => gridTemplateRows && `grid-template-rows: ${gridTemplateRows};`}

  /* Effects */
  ${({ opacity }) => opacity !== undefined && `opacity: ${opacity};`}
  ${({ overflow }) => overflow && `overflow: ${overflow};`}
  ${({ overflowX }) => overflowX && `overflow-x: ${overflowX};`}
  ${({ overflowY }) => overflowY && `overflow-y: ${overflowY};`}
  ${({ cursor }) => cursor && `cursor: ${cursor};`}
  ${({ transition }) => transition && `transition: ${transition};`}
  ${({ transform }) => transform && `transform: ${transform};`}

  /* Text */
  ${({ textAlign }) => textAlign && `text-align: ${textAlign};`}
  ${({ textTransform }) => textTransform && `text-transform: ${textTransform};`}
  ${({ textDecoration }) => textDecoration && `text-decoration: ${textDecoration};`}
  ${({ textOverflow }) => textOverflow && `text-overflow: ${textOverflow};`}
  ${({ whiteSpace }) => whiteSpace && `white-space: ${whiteSpace};`}
  ${({ letterSpacing }) => letterSpacing && `letter-spacing: ${letterSpacing};`}
`;

export const Box = forwardRef<HTMLElement, BoxProps>(
  ({ as = 'div', children, ...props }, ref) => {
    return (
      <StyledBox as={as} ref={ref} {...props}>
        {children}
      </StyledBox>
    );
  }
);

Box.displayName = 'Box';
