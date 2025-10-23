'use client';
import React, { useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { Box, BoxProps } from '../Box/Box';

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
   * Callback when slide changes
   */
  onSlideChange?: (currentIndex: number) => void;

  /**
   * Initial slide index
   * @default 0
   */
  initialSlide?: number;
}

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
  const [currentIndex, setCurrentIndex] = useState(initialSlide);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const totalItems = items.length;
  const maxIndex = Math.max(0, totalItems - itemsToShow);

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

  const canGoPrev = currentIndex > 0 || infinite;
  const canGoNext = currentIndex < maxIndex || infinite;

  const containerClassNames = [
    'mond-carousel',
    totalItems === 0 && 'mond-carousel--empty',
    className,
  ].filter(Boolean).join(' ');

  const trackClassNames = [
    'mond-carousel__track',
    `mond-carousel__track--gap-${itemGap}`,
    isTransitioning && 'mond-carousel__track--transitioning',
  ].filter(Boolean).join(' ');

  const indicatorContainerClassNames = [
    'mond-carousel__indicators',
    `mond-carousel__indicators--${indicatorPosition}`,
  ].filter(Boolean).join(' ');

  // Inline styles for dynamic values that can't be done with CSS alone
  const trackStyle = {
    transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)`,
    ...(animationDuration !== 300 && {
      transitionDuration: `${animationDuration}ms`,
    }),
  };

  const slideStyle = {
    flex: `0 0 ${100 / itemsToShow}%`,
  };

  if (totalItems === 0) {
    return (
      <Box
        ref={ref}
        className={containerClassNames}
        style={style}
        {...props}
      >
        No items to display
      </Box>
    );
  }

  return (
    <Box
      ref={ref}
      className={containerClassNames}
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Carousel"
      {...props}
    >
      {/* Main carousel track */}
      <Box className={trackClassNames} style={trackStyle}>
        {items.map((item) => (
          <Box key={item.id} className="mond-carousel__slide" style={slideStyle}>
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
              className="mond-carousel__arrow mond-carousel__arrow--prev"
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
              className="mond-carousel__arrow mond-carousel__arrow--next"
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
        <Box className={indicatorContainerClassNames}>
          {Array.from({ length: maxIndex + 1 }, (_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToSlide(index)}
              className={[
                'mond-carousel__indicator',
                index === currentIndex && 'mond-carousel__indicator--active',
              ].filter(Boolean).join(' ')}
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
