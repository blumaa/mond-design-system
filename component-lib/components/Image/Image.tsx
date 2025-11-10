'use client';
import { forwardRef, useState } from 'react';
import { Spinner } from '../Spinner/Spinner';
import { Icon } from '../Icon/Icon';
import { tokens } from '../../tokens';
import './image.css';

export interface ImageProps extends React.HTMLAttributes<HTMLDivElement> {
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
}

const getAspectRatioClass = (aspectRatio: string) => {
  const ratioMap = {
    '1:1': 'mond-image--ratio-1-1',
    '4:3': 'mond-image--ratio-4-3',
    '16:9': 'mond-image--ratio-16-9',
    '3:2': 'mond-image--ratio-3-2',
    'auto': 'mond-image--ratio-auto',
  };
  return ratioMap[aspectRatio as keyof typeof ratioMap] || 'mond-image--ratio-auto';
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
  className = '',
  style,
  ...props
}, ref) => {
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

  const aspectRatioClass = getAspectRatioClass(aspectRatio);
  const containerClassName = `mond-image ${aspectRatioClass} ${imageState === 'loading' ? 'mond-image--loading' : ''} ${imageState === 'error' ? 'mond-image--error' : ''} ${className}`.trim();

  const containerStyle = {
    borderRadius: tokens.radii[borderRadius],
    width: width || (aspectRatio !== 'auto' ? '100%' : undefined),
    height: height || (aspectRatio !== 'auto' ? 'auto' : undefined),
    ...style,
  };

  return (
    <div
      className={containerClassName}
      style={containerStyle}
      {...props}
    >
      <img
        ref={ref}
        src={currentSrc}
        alt={alt}
        className={`mond-image__img mond-image__img--${fit}`}
        onLoad={handleLoad}
        onError={handleError}
        loading={loading}
        crossOrigin={crossOrigin}
      />

      {/* Loading placeholder */}
      {!showLoadingSpinner && (
        <div
          className="mond-image__placeholder mond-image__placeholder--visible"
          style={{ minHeight: height || '120px' }}
        />
      )}

      {/* Loading spinner */}
      {showLoadingSpinner && (
        <div className="mond-image__spinner mond-image__spinner--visible">
          <Spinner size="md" label="Loading image..." />
        </div>
      )}

      {/* Error state */}
      <div className="mond-image__error">
        <div>
          <Icon size="lg" decorative>
            <svg viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
              <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
              <polyline points="21,15 16,10 5,21" stroke="currentColor" strokeWidth="2" />
            </svg>
          </Icon>
          <div>Failed to load image</div>
        </div>
      </div>
    </div>
  );
});

Image.displayName = 'Image';