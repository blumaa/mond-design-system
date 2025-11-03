import { render, screen, renderWithDarkMode, fireEvent, waitFor } from '../../../test-utils';
import { act } from 'react';
import { Carousel, CarouselItem } from './Carousel';

// Mock timers for auto-play tests
jest.useFakeTimers();

const mockItems: CarouselItem[] = [
  { id: '1', content: <div>Slide 1</div> },
  { id: '2', content: <div>Slide 2</div> },
  { id: '3', content: <div>Slide 3</div> },
  { id: '4', content: <div>Slide 4</div> },
];

// const mockItemsWithImages: CarouselItem[] = [
//   { id: '1', content: <img src="/image1.jpg" alt="First slide" /> },
//   { id: '2', content: <img src="/image2.jpg" alt="Second slide" /> },
//   { id: '3', content: <img src="/image3.jpg" alt="Third slide" /> },
// ];

describe('Carousel', () => {
  beforeEach(() => {
    jest.clearAllTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
    jest.useFakeTimers();
  });

  it('renders all carousel items', () => {
    render(<Carousel items={mockItems} />);
    
    // Advance timers to handle any setTimeout calls
    act(() => {
      jest.runAllTimers();
    });
    
    expect(screen.getByText('Slide 1')).toBeInTheDocument();
    expect(screen.getByText('Slide 2')).toBeInTheDocument();
    expect(screen.getByText('Slide 3')).toBeInTheDocument();
    expect(screen.getByText('Slide 4')).toBeInTheDocument();
  });

  it('renders empty state when no items provided', () => {
    render(<Carousel items={[]} />);
    
    expect(screen.getByText('No items to display')).toBeInTheDocument();
  });

  it('shows navigation arrows by default', () => {
    render(<Carousel items={mockItems} />);
    
    expect(screen.getByLabelText('Previous slide')).toBeInTheDocument();
    expect(screen.getByLabelText('Next slide')).toBeInTheDocument();
  });

  it('hides navigation arrows when showArrows is false', () => {
    render(<Carousel items={mockItems} showArrows={false} />);
    
    expect(screen.queryByLabelText('Previous slide')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Next slide')).not.toBeInTheDocument();
  });

  it('shows dot indicators by default', () => {
    render(<Carousel items={mockItems} />);
    
    expect(screen.getByLabelText('Go to slide 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to slide 2')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to slide 3')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to slide 4')).toBeInTheDocument();
  });

  it('hides dot indicators when showIndicators is false', () => {
    render(<Carousel items={mockItems} showIndicators={false} />);
    
    expect(screen.queryByLabelText('Go to slide 1')).not.toBeInTheDocument();
  });

  it('navigates to next slide when next button is clicked', async () => {
    const onSlideChange = jest.fn();
    render(<Carousel items={mockItems} onSlideChange={onSlideChange} />);
    
    const nextButton = screen.getByLabelText('Next slide');
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(onSlideChange).toHaveBeenCalledWith(1);
    });
  });

  it('navigates to previous slide when previous button is clicked', async () => {
    const onSlideChange = jest.fn();
    render(<Carousel items={mockItems} initialSlide={2} onSlideChange={onSlideChange} />);
    
    const prevButton = screen.getByLabelText('Previous slide');
    fireEvent.click(prevButton);
    
    await waitFor(() => {
      expect(onSlideChange).toHaveBeenCalledWith(1);
    });
  });

  it('navigates to specific slide when dot indicator is clicked', async () => {
    const onSlideChange = jest.fn();
    render(<Carousel items={mockItems} onSlideChange={onSlideChange} />);
    
    const slideButton = screen.getByLabelText('Go to slide 3');
    fireEvent.click(slideButton);
    
    await waitFor(() => {
      expect(onSlideChange).toHaveBeenCalledWith(2);
    });
  });

  it('loops to first slide when at end and infinite is true', async () => {
    const onSlideChange = jest.fn();
    render(<Carousel items={mockItems} initialSlide={3} onSlideChange={onSlideChange} infinite={true} />);
    
    const nextButton = screen.getByLabelText('Next slide');
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(onSlideChange).toHaveBeenCalledWith(0);
    });
  });

  it('does not loop when infinite is false', () => {
    render(<Carousel items={mockItems} initialSlide={3} infinite={false} />);
    
    // Next button should not be present at the last slide
    expect(screen.queryByLabelText('Next slide')).not.toBeInTheDocument();
  });

  it('loops to last slide when at beginning and going previous with infinite', async () => {
    const onSlideChange = jest.fn();
    render(<Carousel items={mockItems} initialSlide={0} onSlideChange={onSlideChange} infinite={true} />);
    
    const prevButton = screen.getByLabelText('Previous slide');
    fireEvent.click(prevButton);
    
    await waitFor(() => {
      expect(onSlideChange).toHaveBeenCalledWith(3);
    });
  });

  it('supports keyboard navigation', async () => {
    const onSlideChange = jest.fn();
    render(<Carousel items={mockItems} onSlideChange={onSlideChange} />);
    
    const carousel = screen.getByRole('region', { name: 'Carousel' });
    
    // Right arrow should go to next slide
    fireEvent.keyDown(carousel, { key: 'ArrowRight' });
    
    await waitFor(() => {
      expect(onSlideChange).toHaveBeenCalledWith(1);
    });
  });

  it('supports left arrow key navigation', async () => {
    const onSlideChange = jest.fn();
    render(<Carousel items={mockItems} initialSlide={2} onSlideChange={onSlideChange} />);
    
    const carousel = screen.getByRole('region', { name: 'Carousel' });
    
    // Left arrow should go to previous slide
    fireEvent.keyDown(carousel, { key: 'ArrowLeft' });
    
    await waitFor(() => {
      expect(onSlideChange).toHaveBeenCalledWith(1);
    });
  });

  it('auto-plays when autoPlay is enabled', async () => {
    const onSlideChange = jest.fn();
    render(
      <Carousel 
        items={mockItems} 
        autoPlay={true} 
        autoPlayInterval={1000}
        onSlideChange={onSlideChange}
      />
    );
    
    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    await waitFor(() => {
      expect(onSlideChange).toHaveBeenCalledWith(1);
    });
  });

  it('pauses auto-play on hover when pauseOnHover is true', async () => {
    const onSlideChange = jest.fn();
    render(
      <Carousel 
        items={mockItems} 
        autoPlay={true} 
        autoPlayInterval={1000}
        pauseOnHover={true}
        onSlideChange={onSlideChange}
      />
    );
    
    const carousel = screen.getByRole('region', { name: 'Carousel' });
    
    // Clear any initial timer calls
    onSlideChange.mockClear();
    
    // Hover over carousel
    fireEvent.mouseEnter(carousel);
    
    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    
    // Should not have advanced slides
    expect(onSlideChange).not.toHaveBeenCalled();
    
    // Mouse leave should resume auto-play
    fireEvent.mouseLeave(carousel);
    
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    await waitFor(() => {
      expect(onSlideChange).toHaveBeenCalledWith(1);
    });
  });

  it('displays multiple items when itemsToShow > 1', () => {
    render(<Carousel items={mockItems} itemsToShow={2} />);
    
    // All items should be visible but positioned differently
    expect(screen.getByText('Slide 1')).toBeInTheDocument();
    expect(screen.getByText('Slide 2')).toBeInTheDocument();
    expect(screen.getByText('Slide 3')).toBeInTheDocument();
    expect(screen.getByText('Slide 4')).toBeInTheDocument();
  });

  it('adjusts indicators for multi-item carousel', () => {
    render(<Carousel items={mockItems} itemsToShow={2} />);
    
    // With 4 items showing 2 at a time, should have 3 indicator positions (0, 1, 2)
    expect(screen.getByLabelText('Go to slide 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to slide 2')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to slide 3')).toBeInTheDocument();
    expect(screen.queryByLabelText('Go to slide 4')).not.toBeInTheDocument();
  });

  it('renders custom arrow icons', () => {
    const customPrevIcon = <span data-testid="custom-prev">←</span>;
    const customNextIcon = <span data-testid="custom-next">→</span>;
    
    render(
      <Carousel 
        items={mockItems} 
        prevArrowIcon={customPrevIcon}
        nextArrowIcon={customNextIcon}
      />
    );
    
    expect(screen.getByTestId('custom-prev')).toBeInTheDocument();
    expect(screen.getByTestId('custom-next')).toBeInTheDocument();
  });

  it('starts at initial slide index', () => {
    const onSlideChange = jest.fn();
    render(<Carousel items={mockItems} initialSlide={2} onSlideChange={onSlideChange} />);
    
    // Should be called with initial slide
    expect(onSlideChange).toHaveBeenCalledWith(2);
  });

  it('applies dark mode styling', () => {
    renderWithDarkMode(<Carousel items={mockItems}  data-testid="carousel" />);

    const carousel = screen.getByTestId('carousel');
    expect(carousel).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Carousel items={mockItems} className="custom-carousel" data-testid="carousel" />);
    
    const carousel = screen.getByTestId('carousel');
    expect(carousel).toHaveClass('custom-carousel');
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };
    render(<Carousel ref={ref} items={mockItems} />);
    
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('passes through additional props', () => {
    render(
      <Carousel 
        items={mockItems} 
        data-testid="carousel"
        aria-describedby="carousel-description"
      />
    );
    
    const carousel = screen.getByTestId('carousel');
    expect(carousel).toHaveAttribute('aria-describedby', 'carousel-description');
  });

  // Accessibility tests
  it('has proper ARIA attributes', () => {
    render(<Carousel items={mockItems} />);
    
    const carousel = screen.getByRole('region', { name: 'Carousel' });
    expect(carousel).toHaveAttribute('tabIndex', '0');
  });

  it('disables buttons during transition', async () => {
    render(<Carousel items={mockItems} animationDuration={500} />);
    
    const nextButton = screen.getByLabelText('Next slide');
    fireEvent.click(nextButton);
    
    // Button should be disabled during transition
    expect(nextButton).toBeDisabled();
    
    // After animation duration, should be re-enabled
    act(() => {
      jest.advanceTimersByTime(500);
    });
    
    await waitFor(() => {
      expect(nextButton).not.toBeDisabled();
    });
  });

  it('handles single item without showing navigation', () => {
    const singleItem: CarouselItem[] = [
      { id: '1', content: <div>Only Slide</div> }
    ];
    
    render(<Carousel items={singleItem} />);
    
    expect(screen.getByText('Only Slide')).toBeInTheDocument();
    expect(screen.queryByLabelText('Previous slide')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Next slide')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Go to slide 1')).not.toBeInTheDocument();
  });

  it('cleans up auto-play timer on unmount', () => {
    const { unmount } = render(<Carousel items={mockItems} autoPlay={true} />);
    
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
    
    unmount();
    
    expect(clearIntervalSpy).toHaveBeenCalled();
    
    clearIntervalSpy.mockRestore();
  });
});
