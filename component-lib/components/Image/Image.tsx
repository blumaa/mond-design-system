import { forwardRef, useState } from 'react';
import { Box, BoxProps } from '../Box/Box';
import { Spinner } from '../Spinner/Spinner';
import { tokens } from '../../tokens';
import { useTheme } from '../providers/ThemeProvider';

export interface ImageProps extends Omit<BoxProps, 'as' | 'children'> {
  src: string;
  alt: string;
  width?: string | number;
  height?: string | number;
  fit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  fallbackSrc?: string;
  showLoadingSpinner?: boolean;
  aspectRatio?: '1:1' | '4:3' | '16:9' | '3:2' | 'auto';
  borderRadius?: keyof typeof tokens.radii;
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  onError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  loading?: 'eager' | 'lazy';
  crossOrigin?: 'anonymous' | 'use-credentials';
  /**
   * Dark mode
   * @default undefined - falls back to provider colorScheme
   */
  isDarkMode?: boolean;
}

const getAspectRatioStyle = (aspectRatio: string) => {
  const ratioMap = {
    '1:1': '1 / 1',
    '4:3': '4 / 3', 
    '16:9': '16 / 9',
    '3:2': '3 / 2',
    'auto': 'auto',
  };
  return ratioMap[aspectRatio as keyof typeof ratioMap] || 'auto';
};

export const Image = forwardRef<HTMLImageElement, ImageProps>(({
  src,
  alt,
  width,
  height,
  fit = 'cover',
  fallbackSrc,
  showLoadingSpinner = true,
  aspectRatio = 'auto',
  borderRadius = 'none',
  onLoad,
  onError,
  loading = 'lazy',
  crossOrigin,
  isDarkMode,
  className = '',
  style,
  ...props
}, ref) => {
  const theme = useTheme(isDarkMode);
  
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setImageState('loaded');
    onLoad?.(event);
  };

  const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setImageState('loading');
    } else {
      setImageState('error');
    }
    onError?.(event);
  };

  const imageContainerStyle = {
    position: 'relative' as const,
    display: 'inline-block',
    overflow: 'hidden',
    aspectRatio: getAspectRatioStyle(aspectRatio),
    borderRadius: tokens.radii[borderRadius],
    width: width || (aspectRatio !== 'auto' ? '100%' : undefined),
    height: height || (aspectRatio !== 'auto' ? 'auto' : undefined),
    ...style,
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: fit,
    display: imageState === 'loaded' ? 'block' : 'none',
  };

  const spinnerContainerStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: imageState === 'loading' && showLoadingSpinner ? 'flex' : 'none',
  };

  const errorContainerStyle = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: imageState === 'error' ? 'flex' : 'none',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme('surface.elevated'),
    color: theme('text.tertiary'),
    fontSize: tokens.fontSizes.sm,
    textAlign: 'center' as const,
    padding: tokens.spacing['4'],
  };

  const placeholderStyle = {
    width: '100%',
    height: '100%',
    minHeight: height || '120px',
    backgroundColor: theme('surface.elevated'),
    display: imageState === 'loading' && !showLoadingSpinner ? 'block' : 'none',
  };

  return (
    <Box
      className={`mond-image ${imageState === 'loading' ? 'mond-image--loading' : ''} ${imageState === 'error' ? 'mond-image--error' : ''} ${className}`}
      style={imageContainerStyle}
      {...props}
    >
      <img
        ref={ref}
        src={currentSrc}
        alt={alt}
        style={imageStyle}
        onLoad={handleLoad}
        onError={handleError}
        loading={loading}
        crossOrigin={crossOrigin}
      />
      
      {/* Loading state */}
      <Box style={placeholderStyle} />
      
      {/* Loading spinner */}
      <Box style={spinnerContainerStyle}>
        <Spinner size="md" isDarkMode={isDarkMode} label="Loading image..." />
      </Box>
      
      {/* Error state */}
      <Box style={errorContainerStyle}>
        <div>
          <div style={{ marginBottom: tokens.spacing['2'] }}>
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              style={{ opacity: 0.5 }}
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
              <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
              <polyline points="21,15 16,10 5,21" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div>Failed to load image</div>
        </div>
      </Box>
    </Box>
  );
});

Image.displayName = 'Image';