import React, { useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import styled, { css } from 'styled-components';

export interface CarouselItem {
  id: string;
  content: ReactNode;
}

export interface CarouselProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
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

interface StyledCarouselContainerProps {
  $isEmpty: boolean;
}

const StyledCarouselContainer = styled.div<StyledCarouselContainerProps>`
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radii.lg};

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.borderFocused};
    outline-offset: 2px;
  }

  /* Empty state */
  ${({ $isEmpty, theme }) =>
    $isEmpty &&
    css`
      display: flex;
      align-items: center;
      justify-content: center;
      height: 200px;
      background-color: ${theme.colors.surfaceBackground};
      color: ${theme.colors.textTertiary};
      border-radius: ${theme.radii.lg};
    `}
`;

interface StyledTrackProps {
  $gap: 'none' | 'xs' | 'sm' | 'md' | 'lg';
  $isTransitioning: boolean;
}

const StyledTrack = styled.div<StyledTrackProps>`
  display: flex;

  ${({ $isTransitioning }) =>
    $isTransitioning &&
    css`
      transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
    `}

  /* Gap sizes */
  ${({ $gap }) =>
    $gap === 'none' &&
    css`
      gap: 0;
    `}

  ${({ $gap, theme }) =>
    $gap === 'xs' &&
    css`
      gap: ${theme.space[1]};
    `}

  ${({ $gap, theme }) =>
    $gap === 'sm' &&
    css`
      gap: ${theme.space[2]};
    `}

  ${({ $gap, theme }) =>
    $gap === 'md' &&
    css`
      gap: ${theme.space[4]};
    `}

  ${({ $gap, theme }) =>
    $gap === 'lg' &&
    css`
      gap: ${theme.space[6]};
    `}
`;

const StyledSlide = styled.div`
  min-width: 0;
`;

interface StyledArrowProps {
  $position: 'prev' | 'next';
}

const StyledArrow = styled.button<StyledArrowProps>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.7);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.white50};
  transition: all 200ms ease;
  opacity: 0.8;

  &:hover {
    opacity: 1;
    transform: translateY(-50%) scale(1.1);
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.borderFocused};
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  ${({ $position, theme }) =>
    $position === 'prev' &&
    css`
      left: ${theme.space[4]};
    `}

  ${({ $position, theme }) =>
    $position === 'next' &&
    css`
      right: ${theme.space[4]};
    `}
`;

interface StyledIndicatorsProps {
  $position: 'bottom-center' | 'bottom-left' | 'bottom-right';
}

const StyledIndicators = styled.div<StyledIndicatorsProps>`
  position: absolute;
  bottom: ${({ theme }) => theme.space[4]};
  display: flex;
  gap: ${({ theme }) => theme.space[2]};
  z-index: 10;

  ${({ $position }) =>
    $position === 'bottom-center' &&
    css`
      left: 50%;
      transform: translateX(-50%);
    `}

  ${({ $position, theme }) =>
    $position === 'bottom-left' &&
    css`
      left: ${theme.space[4]};
    `}

  ${({ $position, theme }) =>
    $position === 'bottom-right' &&
    css`
      right: ${theme.space[4]};
    `}
`;

interface StyledIndicatorProps {
  $active: boolean;
}

const StyledIndicator = styled.button<StyledIndicatorProps>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: all 200ms ease;
  padding: 0;
  background-color: ${({ $active, theme }) =>
    $active ? theme.colors.gray900 : 'rgba(0, 0, 0, 0.3)'};

  &:hover {
    opacity: 0.8;
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.borderFocused};
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

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
      <StyledCarouselContainer
        ref={ref}
        $isEmpty={true}
        className={className}
        style={style}
        {...props}
      >
        No items to display
      </StyledCarouselContainer>
    );
  }

  return (
    <StyledCarouselContainer
      ref={ref}
      $isEmpty={false}
      className={className}
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
      <StyledTrack $gap={itemGap} $isTransitioning={isTransitioning} style={trackStyle}>
        {items.map((item) => (
          <StyledSlide key={item.id} style={slideStyle}>
            {item.content}
          </StyledSlide>
        ))}
      </StyledTrack>

      {/* Navigation arrows */}
      {showArrows && totalItems > itemsToShow && (
        <>
          {canGoPrev && (
            <StyledArrow
              type="button"
              onClick={goToPrevious}
              $position="prev"
              aria-label="Previous slide"
              disabled={isTransitioning}
            >
              {prevArrowIcon || <DefaultPrevIcon />}
            </StyledArrow>
          )}

          {canGoNext && (
            <StyledArrow
              type="button"
              onClick={goToNext}
              $position="next"
              aria-label="Next slide"
              disabled={isTransitioning}
            >
              {nextArrowIcon || <DefaultNextIcon />}
            </StyledArrow>
          )}
        </>
      )}

      {/* Dot indicators */}
      {showIndicators && totalItems > itemsToShow && (
        <StyledIndicators $position={indicatorPosition}>
          {Array.from({ length: maxIndex + 1 }, (_, index) => (
            <StyledIndicator
              key={index}
              type="button"
              onClick={() => goToSlide(index)}
              $active={index === currentIndex}
              aria-label={`Go to slide ${index + 1}`}
              disabled={isTransitioning}
            />
          ))}
        </StyledIndicators>
      )}
    </StyledCarouselContainer>
  );
});

Carousel.displayName = 'Carousel';
