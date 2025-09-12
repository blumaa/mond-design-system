'use client';
import React, { useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { Box, BoxProps } from '../../layout/Box/Box';
import { tokens } from '../../../tokens/tokens';
import { useThemeContext } from '../../providers/ThemeProvider';

export interface CarouselItem {
  id: string;
  content: ReactNode;
}

export interface CarouselProps extends Omit<BoxProps, 'children'> {
  /**
   * Array of carousel items to display
   */
  items: CarouselItem[];
  
  /**
   * Whether to show navigation arrows
   * @default true
   */
  showArrows?: boolean;
  
  /**
   * Whether to show dot indicators
   * @default true
   */
  showIndicators?: boolean;
  
  /**
   * Whether to auto-play the carousel
   * @default false
   */
  autoPlay?: boolean;
  
  /**
   * Auto-play interval in milliseconds
   * @default 5000
   */
  autoPlayInterval?: number;
  
  /**
   * Whether to pause auto-play on hover
   * @default true
   */
  pauseOnHover?: boolean;
  
  /**
   * Whether the carousel should loop infinitely
   * @default true
   */
  infinite?: boolean;
  
  /**
   * Number of items to show at once (for multi-item carousel)
   * @default 1
   */
  itemsToShow?: number;
  
  /**
   * Gap between items when showing multiple
   * @default 'md'
   */
  itemGap?: 'none' | 'xs' | 'sm' | 'md' | 'lg';
  
  /**
   * Animation duration in milliseconds
   * @default 300
   */
  animationDuration?: number;
  
  /**
   * Custom arrow icons
   */
  prevArrowIcon?: ReactNode;
  nextArrowIcon?: ReactNode;
  
  /**
   * Arrow position
   * @default 'sides'
   */
  arrowPosition?: 'sides' | 'bottom';
  
  /**
   * Indicator position
   * @default 'bottom-center'
   */
  indicatorPosition?: 'bottom-center' | 'bottom-left' | 'bottom-right';
  
  /**
   * Dark mode styling
   * @default false
   */
  
  /**
   * Callback when slide changes
   */
  onSlideChange?: (currentIndex: number) => void;
  
  /**
   * Initial slide index
   * @default 0
   */
  initialSlide?: number;
}

const getGapSize = (gap: string) => {
  const gapMap = {
    none: '0',
    xs: tokens.spacing['1'],
    sm: tokens.spacing['2'],
    md: tokens.spacing['4'],
    lg: tokens.spacing['6'],
  };
  return gapMap[gap as keyof typeof gapMap];
};

export const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(({
  items,
  showArrows = true,
  showIndicators = true,
  autoPlay = false,
  autoPlayInterval = 5000,
  pauseOnHover = true,
  infinite = true,
  itemsToShow = 1,
  itemGap = 'md',
  animationDuration = 300,
  prevArrowIcon,
  nextArrowIcon,
  indicatorPosition = 'bottom-center',
  
  onSlideChange,
  initialSlide = 0,
  className = '',
  style,
  ...props
}, ref) => {
  const { colorScheme } = useThemeContext();
  const isDark = colorScheme === 'dark';
  
  const [currentIndex, setCurrentIndex] = useState(initialSlide);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const totalItems = items.length;
  const maxIndex = Math.max(0, totalItems - itemsToShow);
  const gap = getGapSize(itemGap);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index === currentIndex) return;
    
    setIsTransitioning(true);
    setCurrentIndex(index);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, animationDuration);
  }, [isTransitioning, currentIndex, animationDuration]);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || isPaused || totalItems <= itemsToShow) return;

    const goToNext = () => {
      if (isTransitioning) return;
      
      if (currentIndex < maxIndex) {
        goToSlide(currentIndex + 1);
      } else if (infinite) {
        goToSlide(0);
      }
    };

    autoPlayRef.current = setInterval(() => {
      goToNext();
    }, autoPlayInterval);

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [autoPlay, isPaused, currentIndex, totalItems, itemsToShow, autoPlayInterval, isTransitioning, maxIndex, infinite, goToSlide]);

  // Notify parent of slide changes
  useEffect(() => {
    onSlideChange?.(currentIndex);
  }, [currentIndex, onSlideChange]);

  const goToPrevious = () => {
    if (isTransitioning) return;
    
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1);
    } else if (infinite) {
      goToSlide(maxIndex);
    }
  };

  const goToNext = () => {
    if (isTransitioning) return;
    
    if (currentIndex < maxIndex) {
      goToSlide(currentIndex + 1);
    } else if (infinite) {
      goToSlide(0);
    }
  };

  const handleMouseEnter = () => {
    if (pauseOnHover) {
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      setIsPaused(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goToPrevious();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goToNext();
    }
  };

  const containerStyle = {
    position: 'relative' as const,
    width: '100%',
    overflow: 'hidden',
    borderRadius: tokens.radii.lg,
    ...style,
  };

  const trackStyle = {
    display: 'flex',
    transition: isTransitioning ? `transform ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)` : 'none',
    transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)`,
    gap,
  };

  const slideStyle = {
    flex: `0 0 ${100 / itemsToShow}%`,
    minWidth: 0,
  };

  const arrowButtonStyle = {
    position: 'absolute' as const,
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 10,
    backgroundColor: isDark
      ? 'rgba(255, 255, 255, 0.9)' 
      : 'rgba(0, 0, 0, 0.7)',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: isDark ? tokens.colors.gray['900'] : tokens.colors.white['50'],
    transition: 'all 0.2s ease',
    opacity: 0.8,
  };

  const prevButtonStyle = {
    ...arrowButtonStyle,
    left: tokens.spacing['4'],
  };

  const nextButtonStyle = {
    ...arrowButtonStyle,
    right: tokens.spacing['4'],
  };

  const indicatorContainerStyle = {
    position: 'absolute' as const,
    bottom: tokens.spacing['4'],
    display: 'flex',
    gap: tokens.spacing['2'],
    zIndex: 10,
    ...(indicatorPosition === 'bottom-center' && {
      left: '50%',
      transform: 'translateX(-50%)',
    }),
    ...(indicatorPosition === 'bottom-left' && {
      left: tokens.spacing['4'],
    }),
    ...(indicatorPosition === 'bottom-right' && {
      right: tokens.spacing['4'],
    }),
  };

  const getIndicatorStyle = (index: number) => ({
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: index === currentIndex 
      ? (isDark ? tokens.colors.white['50'] : tokens.colors.gray['900'])
      : (isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.3)'),
  });

  const canGoPrev = currentIndex > 0 || infinite;
  const canGoNext = currentIndex < maxIndex || infinite;

  const DefaultPrevIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="15,18 9,12 15,6"/>
    </svg>
  );

  const DefaultNextIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9,18 15,12 9,6"/>
    </svg>
  );

  if (totalItems === 0) {
    return (
      <Box
        ref={ref}
        className={`mond-carousel mond-carousel--empty ${className}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '200px',
          backgroundColor: isDark ? tokens.colors.gray['800'] : tokens.colors.gray['100'],
          color: isDark ? tokens.colors.gray['400'] : tokens.colors.gray['500'],
          borderRadius: tokens.radii.lg,
          ...style,
        }}
        {...props}
      >
        No items to display
      </Box>
    );
  }

  return (
    <Box
      ref={ref}
      className={`mond-carousel ${className}`}
      style={containerStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Carousel"
      {...props}
    >
      {/* Main carousel track */}
      <Box style={trackStyle}>
        {items.map((item) => (
          <Box key={item.id} style={slideStyle}>
            {item.content}
          </Box>
        ))}
      </Box>

      {/* Navigation arrows */}
      {showArrows && totalItems > itemsToShow && (
        <>
          {canGoPrev && (
            <button
              type="button"
              onClick={goToPrevious}
              style={prevButtonStyle}
              aria-label="Previous slide"
              disabled={isTransitioning}
            >
              {prevArrowIcon || <DefaultPrevIcon />}
            </button>
          )}
          
          {canGoNext && (
            <button
              type="button"
              onClick={goToNext}
              style={nextButtonStyle}
              aria-label="Next slide"
              disabled={isTransitioning}
            >
              {nextArrowIcon || <DefaultNextIcon />}
            </button>
          )}
        </>
      )}

      {/* Dot indicators */}
      {showIndicators && totalItems > itemsToShow && (
        <Box style={indicatorContainerStyle}>
          {Array.from({ length: maxIndex + 1 }, (_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToSlide(index)}
              style={getIndicatorStyle(index)}
              aria-label={`Go to slide ${index + 1}`}
              disabled={isTransitioning}
            />
          ))}
        </Box>
      )}
    </Box>
  );
});

Carousel.displayName = 'Carousel';