'use client';
import { forwardRef, useState } from 'react';
import { Spinner } from '../Spinner/Spinner';
import { tokens } from '../../tokens';

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
  imgRef?: React.Ref<HTMLImageElement>;
}

export const Image = forwardRef<HTMLDivElement, ImageProps>(({
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
  imgRef,
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

  // Build class names
  const containerClassNames = [
    'mond-image',
    `mond-image--ratio-${aspectRatio.replace(':', '-')}`,
    imageState === 'loading' && 'mond-image--loading',
    imageState === 'error' && 'mond-image--error',
    className,
  ].filter(Boolean).join(' ');

  const imgClassNames = [
    'mond-image__img',
    `mond-image__img--${fit}`,
    imageState === 'loaded' && 'mond-image__img--loaded',
  ].filter(Boolean).join(' ');

  // Build inline styles for container
  const containerStyle: React.CSSProperties = {
    borderRadius: tokens.radii[borderRadius],
    width: width || (aspectRatio !== 'auto' ? '100%' : undefined),
    height: height || (aspectRatio !== 'auto' ? 'auto' : undefined),
    ...style,
  };

  // Build inline styles for placeholder (only for height override)
  const placeholderStyle: React.CSSProperties = {
    minHeight: height || '120px',
  };

  return (
    <div
      ref={ref}
      className={containerClassNames}
      style={containerStyle}
      {...props}
    >
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        className={imgClassNames}
        onLoad={handleLoad}
        onError={handleError}
        loading={loading}
        crossOrigin={crossOrigin}
      />

      {/* Placeholder (no spinner) */}
      {!showLoadingSpinner && (
        <div
          className="mond-image__placeholder mond-image__placeholder--no-spinner"
          style={placeholderStyle}
        />
      )}

      {/* Loading spinner */}
      <div className="mond-image__spinner">
        <Spinner size="md" label="Loading image..." />
      </div>

      {/* Error state */}
      <div className="mond-image__error">
        <div>
          <div className="mond-image__error-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
              <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
              <polyline points="21,15 16,10 5,21" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <div>Failed to load image</div>
        </div>
      </div>
    </div>
  );
});

Image.displayName = 'Image';
