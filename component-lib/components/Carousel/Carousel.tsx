import React, { useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { Box } from '../Box/Box';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import './carousel.css';

export interface CarouselItem {
  id: string;
  content: ReactNode;
}

export interface CarouselProps {
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

  /**
   * Carousel size with 16:9 aspect ratio
   * - sm: max-width 600px with 16:9 aspect ratio
   * - md: max-width 900px with 16:9 aspect ratio
   * - lg: max-width 1200px with 16:9 aspect ratio
   * - full-width: 100% width with 16:9 aspect ratio
   * - auto: No aspect ratio constraint (content defines height)
   * @default 'auto'
   */
  size?: 'sm' | 'md' | 'lg' | 'full-width' | 'auto';
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
  arrowPosition = 'sides',
  indicatorPosition = 'bottom-center',
  onSlideChange,
  initialSlide = 0,
  size = 'auto',
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
    <Icon size="sm" decorative>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="15,18 9,12 15,6"/>
      </svg>
    </Icon>
  );

  const DefaultNextIcon = () => (
    <Icon size="sm" decorative>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="9,18 15,12 9,6"/>
      </svg>
    </Icon>
  );

  const canGoPrev = currentIndex > 0 || infinite;
  const canGoNext = currentIndex < maxIndex || infinite;

  const carouselClasses = [
    'mond-carousel',
    size !== 'auto' && `mond-carousel--${size}`,
    totalItems === 0 && 'mond-carousel--empty',
    itemsToShow > 1 && 'mond-carousel--multi-item',
  ].filter(Boolean).join(' ');

  const trackClasses = [
    'mond-carousel__track',
    itemsToShow > 1 && `mond-carousel__track--gap-${itemGap}`,
  ].filter(Boolean).join(' ');

  if (totalItems === 0) {
    return (
      <Box
        ref={ref}
        className={carouselClasses}
      >
        No items to display
      </Box>
    );
  }

  // Calculate gap values for multi-item carousels
  const gapValues: Record<typeof itemGap, string> = {
    none: '0px',
    xs: 'var(--mond-spacing-1)',
    sm: 'var(--mond-spacing-2)',
    md: 'var(--mond-spacing-4)',
    lg: 'var(--mond-spacing-6)',
  };

  const slideStyle = itemsToShow > 1
    ? {
        flex: `0 0 calc((100% - (${gapValues[itemGap]} * ${itemsToShow - 1})) / ${itemsToShow})`,
        maxWidth: `calc((100% - (${gapValues[itemGap]} * ${itemsToShow - 1})) / ${itemsToShow})`
      }
    : {
        flex: '0 0 100%',
        maxWidth: '100%'
      };

  // Calculate transform based on current index
  // For single item: move by 100% per slide
  // For multiple items: move by (100% / itemsToShow) per slide, accounting for gaps
  const transformPercent = itemsToShow === 1
    ? currentIndex * 100
    : currentIndex * (100 / itemsToShow);

  const trackStyle = { transform: `translateX(-${transformPercent}%)` };

  return (
    <Box
      ref={ref}
      className={carouselClasses}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Carousel"
    >
      {/* Main carousel track */}
      <div className={trackClasses} style={trackStyle}>
        {items.map((item) => (
          <div key={item.id} className="mond-carousel__slide" style={slideStyle}>
            {item.content}
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      {showArrows && totalItems > itemsToShow && (
        <>
          {arrowPosition === 'sides' ? (
            <>
              {canGoPrev && (
                <div className="mond-carousel__arrow mond-carousel__arrow--prev">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={goToPrevious}
                    disabled={isTransitioning}
                    aria-label="Previous slide"
                  >
                    {prevArrowIcon || <DefaultPrevIcon />}
                  </Button>
                </div>
              )}

              {canGoNext && (
                <div className="mond-carousel__arrow mond-carousel__arrow--next">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={goToNext}
                    disabled={isTransitioning}
                    aria-label="Next slide"
                  >
                    {nextArrowIcon || <DefaultNextIcon />}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="mond-carousel__arrows--bottom">
              <Button
                variant="ghost"
                size="sm"
                onClick={goToPrevious}
                disabled={isTransitioning || !canGoPrev}
                aria-label="Previous slide"
              >
                {prevArrowIcon || <DefaultPrevIcon />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={goToNext}
                disabled={isTransitioning || !canGoNext}
                aria-label="Next slide"
              >
                {nextArrowIcon || <DefaultNextIcon />}
              </Button>
            </div>
          )}
        </>
      )}

      {/* Dot indicators */}
      {showIndicators && totalItems > itemsToShow && (
        <div className={`mond-carousel__indicators mond-carousel__indicators--${indicatorPosition}`}>
          {Array.from({ length: maxIndex + 1 }, (_, index) => (
            <div
              key={index}
              className={`mond-carousel__indicator ${index === currentIndex ? 'mond-carousel__indicator--active' : ''}`}
            >
              <Button
                variant="ghost"
                size="sm"
                iconOnly
                onClick={() => goToSlide(index)}
                disabled={isTransitioning}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === currentIndex ? 'true' : undefined}
              >
                <Icon size="xs" decorative>
                  <svg viewBox="0 0 8 8" fill="currentColor">
                    <circle cx="4" cy="4" r="3" />
                  </svg>
                </Icon>
              </Button>
            </div>
          ))}
        </div>
      )}
    </Box>
  );
});

Carousel.displayName = 'Carousel';
