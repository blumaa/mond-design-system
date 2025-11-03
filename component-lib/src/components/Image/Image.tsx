import { forwardRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { Box } from '../Box/Box';
import type { BoxProps } from '../Box/Box';
import { Spinner } from '../Spinner/Spinner';

// Radii mapping for inline styles
const radii = {
  none: '0',
  sm: '0.125rem',
  md: '0.25rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
};

export interface ImageProps extends Omit<BoxProps, 'as'> {
  src: string;
  alt: string;
  width?: string | number;
  height?: string | number;
  fit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  fallbackSrc?: string;
  showLoadingSpinner?: boolean;
  aspectRatio?: '1:1' | '4:3' | '16:9' | '3:2' | 'auto';
  borderRadius?: keyof typeof radii;
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  onError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  loading?: 'eager' | 'lazy';
  crossOrigin?: 'anonymous' | 'use-credentials';
  imgRef?: React.Ref<HTMLImageElement>;
}

interface StyledImageContainerProps {
  $aspectRatio: string;
  $imageState: 'loading' | 'loaded' | 'error';
}

const StyledImageContainer = styled(Box)<StyledImageContainerProps>`
  position: relative;
  display: inline-block;
  overflow: hidden;

  /* Aspect Ratios */
  ${({ $aspectRatio }) => {
    switch ($aspectRatio) {
      case '1-1':
        return css`
          aspect-ratio: 1 / 1;
        `;
      case '4-3':
        return css`
          aspect-ratio: 4 / 3;
        `;
      case '16-9':
        return css`
          aspect-ratio: 16 / 9;
        `;
      case '3-2':
        return css`
          aspect-ratio: 3 / 2;
        `;
      case 'auto':
        return css`
          aspect-ratio: auto;
        `;
      default:
        return css`
          aspect-ratio: auto;
        `;
    }
  }}
`;

interface StyledImgProps {
  $fit: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  $loaded: boolean;
}

const StyledImg = styled.img<StyledImgProps>`
  width: 100%;
  height: 100%;
  display: ${({ $loaded }) => ($loaded ? 'block' : 'none')};

  /* Object Fit Variants */
  ${({ $fit }) => {
    switch ($fit) {
      case 'cover':
        return css`
          object-fit: cover;
        `;
      case 'contain':
        return css`
          object-fit: contain;
        `;
      case 'fill':
        return css`
          object-fit: fill;
        `;
      case 'none':
        return css`
          object-fit: none;
        `;
      case 'scale-down':
        return css`
          object-fit: scale-down;
        `;
      default:
        return css`
          object-fit: cover;
        `;
    }
  }}
`;

interface PlaceholderProps {
  $minHeight: string | number;
  $show: boolean;
}

const Placeholder = styled(Box)<PlaceholderProps>`
  width: 100%;
  height: 100%;
  min-height: ${({ $minHeight }) =>
    typeof $minHeight === 'number' ? `${$minHeight}px` : $minHeight};
  background-color: ${({ theme }) => theme.colors.surfaceElevated};
  display: ${({ $show }) => ($show ? 'block' : 'none')};
`;

interface SpinnerContainerProps {
  $show: boolean;
}

const SpinnerContainer = styled(Box)<SpinnerContainerProps>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: ${({ $show }) => ($show ? 'flex' : 'none')};
`;

interface ErrorContainerProps {
  $show: boolean;
}

const ErrorContainer = styled(Box)<ErrorContainerProps>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: ${({ $show }) => ($show ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.surfaceElevated};
  color: ${({ theme }) => theme.colors.textTertiary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  text-align: center;
  padding: ${({ theme }) => theme.space[4]};
`;

const ErrorIcon = styled(Box)`
  opacity: 0.5;
  margin-bottom: ${({ theme }) => theme.space[2]};
`;

export const Image = forwardRef<HTMLElement, ImageProps>(({
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

  // Build inline styles for container
  const containerStyle: React.CSSProperties = {
    borderRadius: radii[borderRadius],
    width: width || (aspectRatio !== 'auto' ? '100%' : undefined),
    height: height || (aspectRatio !== 'auto' ? 'auto' : undefined),
    ...style,
  };

  const aspectRatioClass = aspectRatio.replace(':', '-');

  return (
    <StyledImageContainer
      ref={ref as React.Ref<HTMLElement>}
      $aspectRatio={aspectRatioClass}
      $imageState={imageState}
      className={className}
      style={containerStyle}
      data-aspect-ratio={aspectRatio}
      data-state={imageState}
      {...props}
    >
      <StyledImg
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        $fit={fit}
        $loaded={imageState === 'loaded'}
        onLoad={handleLoad}
        onError={handleError}
        loading={loading}
        crossOrigin={crossOrigin}
        data-fit={fit}
      />

      {/* Placeholder (no spinner) */}
      <Placeholder
        $minHeight={height || '120px'}
        $show={!showLoadingSpinner && imageState === 'loading'}
      />

      {/* Loading spinner */}
      <SpinnerContainer $show={showLoadingSpinner && imageState === 'loading'}>
        <Spinner size="md" label="Loading image..." />
      </SpinnerContainer>

      {/* Error state */}
      <ErrorContainer $show={imageState === 'error'}>
        <div>
          <ErrorIcon>
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
          </ErrorIcon>
          <div>Failed to load image</div>
        </div>
      </ErrorContainer>
    </StyledImageContainer>
  );
});

Image.displayName = 'Image';
