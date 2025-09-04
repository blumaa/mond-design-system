import { forwardRef, useEffect } from 'react';
import { Box, BoxProps } from '../Box/Box';
import { tokens } from '../../tokens/tokens';

export interface SpinnerProps extends Omit<BoxProps, 'children' | 'width' | 'height'> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  isDarkMode?: boolean;
  label?: string;
}

const sizeMap = {
  xs: tokens.spacing['4'], // 1rem
  sm: tokens.spacing['5'], // 1.25rem  
  md: tokens.spacing['6'], // 1.5rem
  lg: tokens.spacing['8'], // 2rem
  xl: tokens.spacing['10'], // 2.5rem
};

const getSpinnerColor = (color: string | undefined, isDarkMode: boolean) => {
  if (color) return color;
  return isDarkMode ? tokens.colors.blue['400'] : tokens.colors.blue['600'];
};

// Inject CSS animation keyframes into the document head
const injectSpinnerKeyframes = () => {
  const keyframeId = 'mond-spinner-keyframes';
  
  if (document.getElementById(keyframeId)) return;
  
  const style = document.createElement('style');
  style.id = keyframeId;
  style.textContent = `
    @keyframes mond-spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
};

export const Spinner = forwardRef<HTMLElement, SpinnerProps>(({
  size = 'md',
  color,
  isDarkMode = false,
  label = 'Loading...',
  className = '',
  style,
  ...props
}, ref) => {
  const spinnerSize = sizeMap[size];
  const spinnerColor = getSpinnerColor(color, isDarkMode);

  useEffect(() => {
    injectSpinnerKeyframes();
  }, []);

  const spinnerStyle = {
    width: spinnerSize,
    height: spinnerSize,
    border: '2px solid transparent',
    borderTop: `2px solid ${spinnerColor}`,
    borderRadius: '50%',
    animation: 'mond-spin 1s linear infinite',
    position: 'relative' as const,
    ...style,
  };

  return (
    <Box
      ref={ref}
      className={`mond-spinner ${className}`}
      style={spinnerStyle}
      role="status"
      aria-label={label}
      {...props}
    >
      <span style={{ 
        position: 'absolute', 
        width: '1px', 
        height: '1px', 
        padding: '0', 
        margin: '-1px', 
        overflow: 'hidden', 
        clip: 'rect(0, 0, 0, 0)', 
        whiteSpace: 'nowrap', 
        border: '0' 
      }}>
        {label}
      </span>
    </Box>
  );
});

Spinner.displayName = 'Spinner';