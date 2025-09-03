import React, { forwardRef } from 'react';
import { resolveSemanticToken } from '../../utils/theme';

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: keyof JSX.IntrinsicElements;
  
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
  
  // Theme
  isDarkMode?: boolean;
}

const convertToPixels = (value: string | number): string => {
  if (typeof value === 'number') {
    return `${value}px`;
  }
  return value;
};

const getSpacingValue = (value: string | number, theme: (path: string) => string): string => {
  if (typeof value === 'string') {
    // Check if it's a semantic token
    if (value.includes('.')) {
      return theme(value);
    }
    return value;
  }
  // Convert number to pixels
  return `${value}px`;
};

export const Box = forwardRef<HTMLElement, BoxProps>(({
  as = 'div',
  children,
  className = '',
  isDarkMode = false,
  
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
  boxShadow, opacity, cursor, overflow, overflowX, overflowY, transition,
  
  ...rest
}, ref) => {
  const theme = (path: string) => resolveSemanticToken(path, isDarkMode ? 'dark' : 'light');
  
  const Element = as as React.ElementType;
  
  const styles: React.CSSProperties = {
    // Spacing
    ...(p !== undefined && { padding: getSpacingValue(p, theme) }),
    ...(px !== undefined && { 
      paddingLeft: getSpacingValue(px, theme), 
      paddingRight: getSpacingValue(px, theme) 
    }),
    ...(py !== undefined && { 
      paddingTop: getSpacingValue(py, theme), 
      paddingBottom: getSpacingValue(py, theme) 
    }),
    ...(pt !== undefined && { paddingTop: getSpacingValue(pt, theme) }),
    ...(pr !== undefined && { paddingRight: getSpacingValue(pr, theme) }),
    ...(pb !== undefined && { paddingBottom: getSpacingValue(pb, theme) }),
    ...(pl !== undefined && { paddingLeft: getSpacingValue(pl, theme) }),
    
    ...(m !== undefined && { margin: getSpacingValue(m, theme) }),
    ...(mx !== undefined && { 
      marginLeft: getSpacingValue(mx, theme), 
      marginRight: getSpacingValue(mx, theme) 
    }),
    ...(my !== undefined && { 
      marginTop: getSpacingValue(my, theme), 
      marginBottom: getSpacingValue(my, theme) 
    }),
    ...(mt !== undefined && { marginTop: getSpacingValue(mt, theme) }),
    ...(mr !== undefined && { marginRight: getSpacingValue(mr, theme) }),
    ...(mb !== undefined && { marginBottom: getSpacingValue(mb, theme) }),
    ...(ml !== undefined && { marginLeft: getSpacingValue(ml, theme) }),
    
    // Colors - resolve semantic tokens if they contain dots
    ...(bg && { backgroundColor: bg.includes('.') ? theme(bg) : bg }),
    ...(color && { color: color.includes('.') ? theme(color) : color }),
    ...(borderColor && { borderColor: borderColor.includes('.') ? theme(borderColor) : borderColor }),
    
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
    ...(gap !== undefined && { gap: convertToPixels(gap) }),
    ...(rowGap !== undefined && { rowGap: convertToPixels(rowGap) }),
    ...(columnGap !== undefined && { columnGap: convertToPixels(columnGap) }),
    
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