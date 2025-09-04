import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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
    
    const image = screen.getByRole('img');
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

  it('applies object-fit styles correctly', () => {
    const { rerender } = render(<Image src="https://example.com/image.jpg" alt="Test image" fit="contain" />);
    let image = screen.getByRole('img');
    expect(image).toHaveStyle('object-fit: contain');

    rerender(<Image src="https://example.com/image.jpg" alt="Test image" fit="cover" />);
    image = screen.getByRole('img');
    expect(image).toHaveStyle('object-fit: cover');
  });

  it('applies aspect ratio correctly', () => {
    const { container } = render(
      <Image src="https://example.com/image.jpg" alt="Test image" aspectRatio="16:9" />
    );
    
    const imageContainer = container.firstChild;
    expect(imageContainer).toHaveStyle('aspect-ratio: 16 / 9');
  });

  it('applies border radius from tokens', () => {
    const { container } = render(
      <Image src="https://example.com/image.jpg" alt="Test image" borderRadius="lg" />
    );
    
    const imageContainer = container.firstChild;
    expect(imageContainer).toHaveStyle('border-radius: 0.5rem'); // lg = 0.5rem
  });

  it('applies custom dimensions', () => {
    const { container } = render(
      <Image src="https://example.com/image.jpg" alt="Test image" width="200px" height="150px" />
    );
    
    const imageContainer = container.firstChild;
    expect(imageContainer).toHaveStyle('width: 200px; height: 150px');
  });

  it('handles successful image load', async () => {
    const onLoad = jest.fn();
    render(<Image src="https://example.com/valid.jpg" alt="Test image" onLoad={onLoad} />);
    
    const image = screen.getByRole('img');
    fireEvent.load(image);
    
    await waitFor(() => {
      expect(onLoad).toHaveBeenCalled();
      expect(image).toHaveStyle('display: block');
    });
  });

  it('handles image error without fallback', async () => {
    const onError = jest.fn();
    render(<Image src="https://example.com/error.jpg" alt="Test image" onError={onError} />);
    
    const image = screen.getByRole('img');
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
    
    const image = screen.getByRole('img');
    fireEvent.error(image);
    
    await waitFor(() => {
      expect(onError).toHaveBeenCalled();
      expect(image).toHaveAttribute('src', 'https://example.com/fallback.jpg');
    });
  });

  it('applies loading attribute correctly', () => {
    const { rerender } = render(<Image src="https://example.com/image.jpg" alt="Test image" loading="eager" />);
    let image = screen.getByRole('img');
    expect(image).toHaveAttribute('loading', 'eager');

    rerender(<Image src="https://example.com/image.jpg" alt="Test image" loading="lazy" />);
    image = screen.getByRole('img');
    expect(image).toHaveAttribute('loading', 'lazy');
  });

  it('applies crossOrigin attribute correctly', () => {
    render(<Image src="https://example.com/image.jpg" alt="Test image" crossOrigin="anonymous" />);
    
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('crossOrigin', 'anonymous');
  });

  it('applies custom className', () => {
    const { container } = render(
      <Image src="https://example.com/image.jpg" alt="Test image" className="custom-image" />
    );
    
    expect(container.firstChild).toHaveClass('mond-image', 'mond-image--loading', 'custom-image');
  });

  it('applies loading state class', () => {
    const { container } = render(<Image src="https://example.com/image.jpg" alt="Test image" />);
    
    expect(container.firstChild).toHaveClass('mond-image--loading');
  });

  it('applies error state class', async () => {
    const { container } = render(<Image src="https://example.com/error.jpg" alt="Test image" />);
    
    const image = screen.getByRole('img');
    fireEvent.error(image);
    
    await waitFor(() => {
      expect(container.firstChild).toHaveClass('mond-image--error');
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
    
    expect(container.firstChild).toHaveStyle('opacity: 0.8');
  });

  it('shows placeholder in light mode when spinner disabled', () => {
    const { container } = render(
      <Image 
        src="https://example.com/image.jpg" 
        alt="Test image" 
        showLoadingSpinner={false}
        isDarkMode={false}
      />
    );
    
    // Look for placeholder div with light mode background
    const placeholder = container.querySelector('[style*="background-color: #f1f5f9"]');
    expect(placeholder).toBeInTheDocument();
  });

  it('shows error state in dark mode', async () => {
    render(<Image src="https://example.com/error.jpg" alt="Test image" isDarkMode={true} />);
    
    const image = screen.getByRole('img');
    fireEvent.error(image);
    
    await waitFor(() => {
      const errorContainer = screen.getByText('Failed to load image').parentElement?.parentElement;
      expect(errorContainer).toHaveStyle('background-color: #1e293b'); // gray.800
      expect(errorContainer).toHaveStyle('color: #94a3b8'); // gray.400
    });
  });

  it('shows error state in light mode', async () => {
    render(<Image src="https://example.com/error.jpg" alt="Test image" isDarkMode={false} />);
    
    const image = screen.getByRole('img');
    fireEvent.error(image);
    
    await waitFor(() => {
      const errorContainer = screen.getByText('Failed to load image').parentElement?.parentElement;
      expect(errorContainer).toHaveStyle('background-color: #f1f5f9'); // gray.100
      expect(errorContainer).toHaveStyle('color: #64748b'); // gray.500
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
    
    const placeholder = container.querySelector('[style*="min-height"]');
    expect(placeholder).toHaveStyle('min-height: 200px');
  });

  it('shows spinner in dark mode', () => {
    render(<Image src="https://example.com/image.jpg" alt="Test image" isDarkMode={true} />);
    
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
    
    const image = screen.getByRole('img');
    
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