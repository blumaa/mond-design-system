import React, { forwardRef } from 'react';
import { useTheme } from '../providers/ThemeProvider';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  /**
   * Icon size
   * @default 'md'
   */
  size?: IconSize;
  
  /**
   * Force dark mode styling (overrides provider colorScheme)
   */
  isDarkMode?: boolean;
  
  /**
   * SVG path data or React SVG element
   */
  children: React.ReactNode;
  
  /**
   * Accessible label for the icon
   */
  label?: string;
  
  /**
   * Whether the icon is decorative (hidden from screen readers)
   * @default false
   */
  decorative?: boolean;
  
  /**
   * Dark mode
   * @default false
   */
}

const getIconSize = (size: IconSize): string => {
  const sizes = {
    xs: '12px',
    sm: '16px', 
    md: '20px',
    lg: '24px',
    xl: '32px',
    '2xl': '40px'
  };
  return sizes[size];
};

export const Icon = forwardRef<SVGSVGElement, IconProps>(({
  size = 'md',
  children,
  label,
  decorative = false,
  color = 'currentColor',
  isDarkMode,
  
  className = '',
  style,
  ...props
}, ref) => {
  const iconSize = getIconSize(size);
  const theme = useTheme(isDarkMode);
  
  // Resolve color if it contains semantic tokens
  const resolvedColor = typeof color === 'string' && color.includes('.') 
    ? theme(color) 
    : color;
  
  const iconStyles: React.CSSProperties = {
    display: 'inline-block',
    flexShrink: 0,
    color: resolvedColor,
    ...style,
  };
  
  return (
    <svg
      ref={ref}
      width={iconSize}
      height={iconSize}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={iconStyles}
      role={decorative ? 'presentation' : 'img'}
      aria-label={decorative ? undefined : label}
      {...(decorative && { 'aria-hidden': true })}
      {...props}
    >
      {children}
    </svg>
  );
});

Icon.displayName = 'Icon';