import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Carousel, CarouselItem } from './Carousel';

jest.useFakeTimers();

const mockItems: CarouselItem[] = [
  { id: '1', content: <div>Slide 1</div> },
  { id: '2', content: <div>Slide 2</div> },
  { id: '3', content: <div>Slide 3</div> },
  { id: '4', content: <div>Slide 4</div> },
];

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

  it('renders all carousel items with navigation', () => {
    render(<Carousel items={mockItems} />);

    act(() => {
      jest.runAllTimers();
    });

    expect(screen.getByText('Slide 1')).toBeInTheDocument();
    expect(screen.getByText('Slide 2')).toBeInTheDocument();
    expect(screen.getByLabelText('Previous slide')).toBeInTheDocument();
    expect(screen.getByLabelText('Next slide')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to slide 1')).toBeInTheDocument();
  });

  it('renders empty state and hides navigation controls', () => {
    render(<Carousel items={[]} />);
    expect(screen.getByText('No items to display')).toBeInTheDocument();

    render(<Carousel items={mockItems} showArrows={false} showIndicators={false} />);
    expect(screen.queryByLabelText('Previous slide')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Go to slide 1')).not.toBeInTheDocument();
  });

  it('navigates between slides', async () => {
    const onSlideChange = jest.fn();
    render(<Carousel items={mockItems} initialSlide={2} onSlideChange={onSlideChange} />);

    const nextButton = screen.getByLabelText('Next slide');
    fireEvent.click(nextButton);
    await waitFor(() => {
      expect(onSlideChange).toHaveBeenCalledWith(3);
    });

    const prevButton = screen.getByLabelText('Previous slide');
    expect(prevButton).toBeInTheDocument();

    const slideButton = screen.getByLabelText('Go to slide 2');
    expect(slideButton).toBeInTheDocument();
  });

  it('handles infinite loop correctly', async () => {
    const onSlideChange = jest.fn();
    render(<Carousel items={mockItems} initialSlide={3} onSlideChange={onSlideChange} infinite={true} />);

    const nextButton = screen.getByLabelText('Next slide');
    fireEvent.click(nextButton);
    await waitFor(() => {
      expect(onSlideChange).toHaveBeenCalledWith(0);
    });
  });

  it('supports keyboard navigation', async () => {
    const onSlideChange = jest.fn();
    render(<Carousel items={mockItems} onSlideChange={onSlideChange} />);

    const carousel = screen.getByRole('region', { name: 'Carousel' });

    fireEvent.keyDown(carousel, { key: 'ArrowRight' });
    await waitFor(() => {
      expect(onSlideChange).toHaveBeenCalledWith(1);
    });

    fireEvent.keyDown(carousel, { key: 'ArrowLeft' });
    await waitFor(() => {
      expect(onSlideChange).toHaveBeenCalled();
    });
  });

  it('handles auto-play and pause on hover', async () => {
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

    // Clear initial calls and test pause on hover
    onSlideChange.mockClear();
    fireEvent.mouseEnter(carousel);

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(onSlideChange).not.toHaveBeenCalled();

    // Resume on mouse leave
    fireEvent.mouseLeave(carousel);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(onSlideChange).toHaveBeenCalledWith(1);
    });
  });

  it('displays multiple items and adjusts indicators', () => {
    render(<Carousel items={mockItems} itemsToShow={2} />);

    expect(screen.getByText('Slide 1')).toBeInTheDocument();
    expect(screen.getByText('Slide 2')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to slide 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to slide 2')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to slide 3')).toBeInTheDocument();
    expect(screen.queryByLabelText('Go to slide 4')).not.toBeInTheDocument();
  });

  it('renders custom icons and handles single item', () => {
    const customPrevIcon = <span data-testid="custom-prev">←</span>;
    const customNextIcon = <span data-testid="custom-next">→</span>;

    const { unmount } = render(
      <Carousel
        items={mockItems}
        prevArrowIcon={customPrevIcon}
        nextArrowIcon={customNextIcon}
      />
    );

    expect(screen.getByTestId('custom-prev')).toBeInTheDocument();
    expect(screen.getByTestId('custom-next')).toBeInTheDocument();

    unmount();

    const singleItem: CarouselItem[] = [{ id: '1', content: <div>Only Slide</div> }];
    render(<Carousel items={singleItem} />);

    expect(screen.getByText('Only Slide')).toBeInTheDocument();
    expect(screen.queryByLabelText('Go to slide 1')).not.toBeInTheDocument();
  });

  it('has proper accessibility attributes and ref forwarding', () => {
    const ref = { current: null };
    render(<Carousel ref={ref} items={mockItems} />);

    const carousel = screen.getByRole('region', { name: 'Carousel' });
    expect(carousel).toHaveAttribute('tabIndex', '0');
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('disables buttons during transition and cleans up timer', async () => {
    const { unmount } = render(<Carousel items={mockItems} animationDuration={500} autoPlay={true} />);

    const nextButton = screen.getByLabelText('Next slide');
    fireEvent.click(nextButton);

    expect(nextButton).toBeDisabled();

    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(nextButton).not.toBeDisabled();
    });

    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
    unmount();
    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });
});
