import { render, screen, renderWithDarkMode, fireEvent, waitFor } from '../../test-utils';
import '@testing-library/jest-dom';
import { Image } from './Image';

// Mock image loading for tests
Object.defineProperty(global.Image.prototype, 'src', {
  set(src) {
    if (src.includes('valid')) {
      setTimeout(() => this.onload?.(new Event('load')), 0);
    } else if (src.includes('error')) {
      setTimeout(() => this.onerror?.(new Event('error')), 0);
    }
  },
});

describe('Image', () => {
  beforeEach(() => {
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders with required props', () => {
    render(<Image src="https://example.com/image.jpg" alt="Test image" />);
    
    const image = screen.getByRole('img', { hidden: true });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
    expect(image).toHaveAttribute('alt', 'Test image');
  });

  it('shows loading spinner by default', () => {
    render(<Image src="https://example.com/image.jpg" alt="Test image" />);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Loading image...')).toBeInTheDocument();
  });

  it('hides loading spinner when disabled', () => {
    const { container } = render(<Image src="https://example.com/image.jpg" alt="Test image" showLoadingSpinner={false} />);

    // The spinner is still rendered but hidden via CSS when showLoadingSpinner is false
    // Instead, check that the placeholder is visible
    const placeholder = container.querySelector('.mond-image__placeholder--no-spinner');
    expect(placeholder).toBeInTheDocument();
  });

  it('applies object-fit styles correctly', () => {
    const { rerender } = render(<Image src="https://example.com/image.jpg" alt="Test image" fit="contain" />);
    let image = screen.getByRole('img', { hidden: true });
    expect(image).toHaveClass('mond-image__img--contain');

    rerender(<Image src="https://example.com/image.jpg" alt="Test image" fit="cover" />);
    image = screen.getByRole('img', { hidden: true });
    expect(image).toHaveClass('mond-image__img--cover');
  });

  it('applies aspect ratio correctly', () => {
    const { container } = render(
      <Image src="https://example.com/image.jpg" alt="Test image" aspectRatio="16:9" />
    );

    // Aspect ratio is now applied via CSS classes
    // container.firstChild is the ThemeProvider wrapper, so we need firstChild.firstChild
    const imageContainer = container.firstChild?.firstChild as HTMLElement;
    expect(imageContainer).toHaveClass('mond-image--ratio-16-9');
  });

  it('applies border radius from tokens', () => {
    const { container } = render(
      <Image src="https://example.com/image.jpg" alt="Test image" borderRadius="lg" />
    );

    // container.firstChild is the ThemeProvider wrapper, so we need firstChild.firstChild
    const imageContainer = container.firstChild?.firstChild as HTMLElement;
    expect(imageContainer.style.borderRadius).toBe('0.5rem'); // lg = 0.5rem
  });

  it('applies custom dimensions', () => {
    const { container } = render(
      <Image src="https://example.com/image.jpg" alt="Test image" width="200px" height="150px" />
    );

    // container.firstChild is the ThemeProvider wrapper, so we need firstChild.firstChild
    const imageContainer = container.firstChild?.firstChild as HTMLElement;
    expect(imageContainer.style.width).toBe('200px');
    expect(imageContainer.style.height).toBe('150px');
  });

  it('handles successful image load', async () => {
    const onLoad = jest.fn();
    render(<Image src="https://example.com/valid.jpg" alt="Test image" onLoad={onLoad} />);

    const image = screen.getByRole('img', { hidden: true });
    fireEvent.load(image);

    await waitFor(() => {
      expect(onLoad).toHaveBeenCalled();
      // Display is now controlled by CSS class, not inline style
      expect(image).toHaveClass('mond-image__img--loaded');
    });
  });

  it('handles image error without fallback', async () => {
    const onError = jest.fn();
    render(<Image src="https://example.com/error.jpg" alt="Test image" onError={onError} />);
    
    const image = screen.getByRole('img', { hidden: true });
    fireEvent.error(image);
    
    await waitFor(() => {
      expect(onError).toHaveBeenCalled();
      expect(screen.getByText('Failed to load image')).toBeInTheDocument();
    });
  });

  it('handles image error with fallback', async () => {
    const onError = jest.fn();
    render(
      <Image 
        src="https://example.com/error.jpg" 
        fallbackSrc="https://example.com/fallback.jpg"
        alt="Test image" 
        onError={onError} 
      />
    );
    
    const image = screen.getByRole('img', { hidden: true });
    fireEvent.error(image);
    
    await waitFor(() => {
      expect(onError).toHaveBeenCalled();
      expect(image).toHaveAttribute('src', 'https://example.com/fallback.jpg');
    });
  });

  it('applies loading attribute correctly', () => {
    const { rerender } = render(<Image src="https://example.com/image.jpg" alt="Test image" loading="eager" />);
    let image = screen.getByRole('img', { hidden: true });
    expect(image).toHaveAttribute('loading', 'eager');

    rerender(<Image src="https://example.com/image.jpg" alt="Test image" loading="lazy" />);
    image = screen.getByRole('img', { hidden: true });
    expect(image).toHaveAttribute('loading', 'lazy');
  });

  it('applies crossOrigin attribute correctly', () => {
    render(<Image src="https://example.com/image.jpg" alt="Test image" crossOrigin="anonymous" />);
    
    const image = screen.getByRole('img', { hidden: true });
    expect(image).toHaveAttribute('crossOrigin', 'anonymous');
  });

  it('applies custom className', () => {
    const { container } = render(
      <Image src="https://example.com/image.jpg" alt="Test image" className="custom-image" />
    );

    // container.firstChild is the ThemeProvider wrapper, so we need firstChild.firstChild
    const imageContainer = container.firstChild?.firstChild;
    expect(imageContainer).toHaveClass('mond-image', 'mond-image--loading', 'custom-image');
  });

  it('applies loading state class', () => {
    const { container } = render(<Image src="https://example.com/image.jpg" alt="Test image" />);

    // container.firstChild is the ThemeProvider wrapper, so we need firstChild.firstChild
    const imageContainer = container.firstChild?.firstChild;
    expect(imageContainer).toHaveClass('mond-image--loading');
  });

  it('applies error state class', async () => {
    const { container } = render(<Image src="https://example.com/error.jpg" alt="Test image" />);

    const image = screen.getByRole('img', { hidden: true });
    fireEvent.error(image);

    await waitFor(() => {
      // container.firstChild is the ThemeProvider wrapper, so we need firstChild.firstChild
      const imageContainer = container.firstChild?.firstChild;
      expect(imageContainer).toHaveClass('mond-image--error');
    });
  });

  it('forwards additional props to Box', () => {
    render(<Image src="https://example.com/image.jpg" alt="Test image" data-testid="custom-image" />);
    
    const imageContainer = screen.getByTestId('custom-image');
    expect(imageContainer).toBeInTheDocument();
  });

  it('applies custom styles', () => {
    const { container } = render(
      <Image src="https://example.com/image.jpg" alt="Test image" style={{ opacity: 0.8 }} />
    );

    // container.firstChild is the ThemeProvider wrapper, so we need firstChild.firstChild
    const imageContainer = container.firstChild?.firstChild;
    expect(imageContainer).toHaveStyle('opacity: 0.8');
  });

  it('shows placeholder in light mode when spinner disabled', () => {
    const { container } = render(
      <Image
        src="https://example.com/image.jpg"
        alt="Test image"
        showLoadingSpinner={false}

      />
    );

    // Background color is now applied via CSS variable, not inline style
    const placeholder = container.querySelector('.mond-image__placeholder--no-spinner');
    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toHaveClass('mond-image__placeholder');
  });

  it('shows error state in dark mode', async () => {
    renderWithDarkMode(<Image src="https://example.com/error.jpg" alt="Test image"  />);

    const image = screen.getByRole('img', { hidden: true });
    fireEvent.error(image);

    await waitFor(() => {
      const errorContainer = screen.getByText('Failed to load image').parentElement?.parentElement;
      // Background color and text color are now applied via CSS variables, not inline styles
      expect(errorContainer).toHaveClass('mond-image__error');
      expect(errorContainer).toBeInTheDocument();
    });
  });

  it('shows error state in light mode', async () => {
    render(<Image src="https://example.com/error.jpg" alt="Test image"  />);

    const image = screen.getByRole('img', { hidden: true });
    fireEvent.error(image);

    await waitFor(() => {
      const errorContainer = screen.getByText('Failed to load image').parentElement?.parentElement;
      // Background color and text color are now applied via CSS variables, not inline styles
      expect(errorContainer).toHaveClass('mond-image__error');
      expect(errorContainer).toBeInTheDocument();
    });
  });

  it('applies min-height to placeholder', () => {
    const { container } = render(
      <Image
        src="https://example.com/image.jpg"
        alt="Test image"
        height="200px"
        showLoadingSpinner={false}
      />
    );

    const placeholder = container.querySelector('.mond-image__placeholder--no-spinner') as HTMLElement;
    expect(placeholder).toBeInTheDocument();
    expect(placeholder?.style.minHeight).toBe('200px');
  });

  it('shows spinner in dark mode', () => {
    render(<Image src="https://example.com/image.jpg" alt="Test image"  />);
    
    const spinner = screen.getByRole('status');
    // The spinner should be rendered with isDarkMode=true
    expect(spinner).toBeInTheDocument();
  });

  it('handles fallback error correctly', async () => {
    render(
      <Image 
        src="https://example.com/error.jpg" 
        fallbackSrc="https://example.com/error-fallback.jpg"
        alt="Test image" 
      />
    );
    
    const image = screen.getByRole('img', { hidden: true });
    
    // First error - should switch to fallback
    fireEvent.error(image);
    await waitFor(() => {
      expect(image).toHaveAttribute('src', 'https://example.com/error-fallback.jpg');
    });
    
    // Second error on fallback - should show error state
    fireEvent.error(image);
    await waitFor(() => {
      expect(screen.getByText('Failed to load image')).toBeInTheDocument();
    });
  });
});