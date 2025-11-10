import { render, screen, fireEvent, waitFor } from '../../test-utils';
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
    render(<Image src="https://example.com/image.jpg" alt="Test image" showLoadingSpinner={false} />);
    
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('applies object-fit classes correctly', () => {
    const { rerender } = render(<Image src="https://example.com/image.jpg" alt="Test image" fit="contain" />);
    let image = screen.getByRole('img', { hidden: true });
    expect(image).toHaveClass('mond-image__img--contain');

    rerender(<Image src="https://example.com/image.jpg" alt="Test image" fit="cover" />);
    image = screen.getByRole('img', { hidden: true });
    expect(image).toHaveClass('mond-image__img--cover');
  });

  it('applies aspect ratio classes correctly', () => {
    const { container } = render(
      <Image src="https://example.com/image.jpg" alt="Test image" aspectRatio="16:9" />
    );

    const imageContainer = container.querySelector('.mond-image');
    expect(imageContainer).toHaveClass('mond-image--ratio-16-9');
  });

  it('applies border radius from tokens', () => {
    const { container } = render(
      <Image src="https://example.com/image.jpg" alt="Test image" borderRadius="lg" />
    );

    const imageContainer = container.querySelector('.mond-image');
    expect(imageContainer).toHaveStyle('border-radius: 0.5rem'); // lg = 0.5rem
  });

  it('applies custom dimensions', () => {
    const { container } = render(
      <Image src="https://example.com/image.jpg" alt="Test image" width="200px" height="150px" />
    );

    const imageContainer = container.querySelector('.mond-image');
    expect(imageContainer).toHaveStyle('width: 200px; height: 150px');
  });

  it('handles successful image load', async () => {
    const onLoad = jest.fn();
    const { container } = render(<Image src="https://example.com/valid.jpg" alt="Test image" onLoad={onLoad} />);

    const image = screen.getByRole('img', { hidden: true });
    fireEvent.load(image);

    await waitFor(() => {
      expect(onLoad).toHaveBeenCalled();
      const imageContainer = container.firstChild as HTMLElement;
      // After load, the container should not have loading class
      expect(imageContainer).not.toHaveClass('mond-image--loading');
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

    const imageContainer = container.querySelector('.mond-image');
    expect(imageContainer).toHaveClass('mond-image', 'mond-image--loading', 'custom-image');
  });

  it('applies loading state class', () => {
    const { container } = render(<Image src="https://example.com/image.jpg" alt="Test image" />);

    const imageContainer = container.querySelector('.mond-image');
    expect(imageContainer).toHaveClass('mond-image--loading');
  });

  it('applies error state class', async () => {
    const { container } = render(<Image src="https://example.com/error.jpg" alt="Test image" />);

    const image = screen.getByRole('img', { hidden: true });
    fireEvent.error(image);

    await waitFor(() => {
      const imageContainer = container.querySelector('.mond-image');
      expect(imageContainer).toHaveClass('mond-image--error');
    });
  });

  it('forwards additional props to container div', () => {
    render(<Image src="https://example.com/image.jpg" alt="Test image" data-testid="custom-image" />);

    const imageContainer = screen.getByTestId('custom-image');
    expect(imageContainer).toBeInTheDocument();
    expect(imageContainer).toHaveClass('mond-image');
  });

  it('applies custom styles', () => {
    const { container } = render(
      <Image src="https://example.com/image.jpg" alt="Test image" style={{ opacity: 0.8 }} />
    );

    const imageContainer = container.querySelector('.mond-image');
    expect(imageContainer).toHaveStyle('opacity: 0.8');
  });

  it('shows placeholder when spinner disabled', () => {
    const { container } = render(
      <Image
        src="https://example.com/image.jpg"
        alt="Test image"
        showLoadingSpinner={false}
      />
    );

    const placeholder = container.querySelector('.mond-image__placeholder');
    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toHaveClass('mond-image__placeholder--visible');
  });

  it('shows error state with CSS classes', async () => {
    render(<Image src="https://example.com/error.jpg" alt="Test image" />);

    const image = screen.getByRole('img', { hidden: true });
    fireEvent.error(image);

    await waitFor(() => {
      const errorContainer = screen.getByText('Failed to load image').parentElement?.parentElement;
      expect(errorContainer).toHaveClass('mond-image__error');
    });
  });

  it('shows error message when image fails to load', async () => {
    render(<Image src="https://example.com/error.jpg" alt="Test image" />);

    const image = screen.getByRole('img', { hidden: true });
    fireEvent.error(image);

    await waitFor(() => {
      expect(screen.getByText('Failed to load image')).toBeInTheDocument();
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

    const placeholder = container.querySelector('.mond-image__placeholder');
    expect(placeholder).toHaveStyle('min-height: 200px');
  });

  it('shows spinner when enabled', () => {
    render(<Image src="https://example.com/image.jpg" alt="Test image" />);

    const spinner = screen.getByRole('status');
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