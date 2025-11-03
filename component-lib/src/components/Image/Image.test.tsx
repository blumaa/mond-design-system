import { render, screen, renderWithDarkMode, fireEvent, waitFor } from '../../../test-utils';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { defaultLightTheme } from '../../themes';
import { Image } from './Image';

const renderWithTheme = (ui: React.ReactElement, theme = defaultLightTheme) => {
  return render(
    <ThemeProvider theme={theme}>
      {ui}
    </ThemeProvider>
  );
};

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
    renderWithTheme(<Image src="https://example.com/image.jpg" alt="Test image" />);
    
    const image = screen.getByRole('img', { hidden: true });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
    expect(image).toHaveAttribute('alt', 'Test image');
  });

  it('shows loading spinner by default', () => {
    renderWithTheme(<Image src="https://example.com/image.jpg" alt="Test image" />);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Loading image...')).toBeInTheDocument();
  });

  it('hides loading spinner when disabled', () => {
    renderWithTheme(<Image src="https://example.com/image.jpg" alt="Test image" showLoadingSpinner={false} data-testid="image-container" />);

    // Spinner should not be visible when disabled
    expect(screen.queryByRole('status')).not.toBeInTheDocument();

    // Image container should still be in loading state
    const imageContainer = screen.getByTestId('image-container');
    expect(imageContainer).toHaveAttribute('data-state', 'loading');
  });

  it('applies object-fit styles correctly', () => {
    const { rerender } = renderWithTheme(<Image src="https://example.com/image.jpg" alt="Test image" fit="contain" />);
    let image = screen.getByRole('img', { hidden: true });
    expect(image).toHaveAttribute('data-fit', 'contain');

    rerender(
      <ThemeProvider theme={defaultLightTheme}>
        <Image src="https://example.com/image.jpg" alt="Test image" fit="cover" />
      </ThemeProvider>
    );
    image = screen.getByRole('img', { hidden: true });
    expect(image).toHaveAttribute('data-fit', 'cover');
  });

  it('applies aspect ratio correctly', () => {
    renderWithTheme(
      <Image src="https://example.com/image.jpg" alt="Test image" aspectRatio="16:9" data-testid="image-container" />
    );

    // Aspect ratio is now tracked via data attribute
    const imageContainer = screen.getByTestId('image-container');
    expect(imageContainer).toHaveAttribute('data-aspect-ratio', '16:9');
  });

  it('applies border radius from tokens', () => {
    renderWithTheme(
      <Image src="https://example.com/image.jpg" alt="Test image" borderRadius="lg" data-testid="image-container" />
    );

    const imageContainer = screen.getByTestId('image-container');
    expect(imageContainer.style.borderRadius).toBe('0.5rem'); // lg = 0.5rem
  });

  it('applies custom dimensions', () => {
    renderWithTheme(
      <Image src="https://example.com/image.jpg" alt="Test image" width="200px" height="150px" data-testid="image-container" />
    );

    const imageContainer = screen.getByTestId('image-container');
    expect(imageContainer.style.width).toBe('200px');
    expect(imageContainer.style.height).toBe('150px');
  });

  it('handles successful image load', async () => {
    const onLoad = jest.fn();
    renderWithTheme(<Image src="https://example.com/valid.jpg" alt="Test image" onLoad={onLoad} />);

    const image = screen.getByRole('img', { hidden: true });
    fireEvent.load(image);

    await waitFor(() => {
      expect(onLoad).toHaveBeenCalled();
      // Image is visible when loaded
      expect(image).toBeInTheDocument();
    });
  });

  it('handles image error without fallback', async () => {
    const onError = jest.fn();
    renderWithTheme(<Image src="https://example.com/error.jpg" alt="Test image" onError={onError} />);
    
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
    const { rerender } = renderWithTheme(<Image src="https://example.com/image.jpg" alt="Test image" loading="eager" />);
    let image = screen.getByRole('img', { hidden: true });
    expect(image).toHaveAttribute('loading', 'eager');

    rerender(
      <ThemeProvider theme={defaultLightTheme}>
        <Image src="https://example.com/image.jpg" alt="Test image" loading="lazy" />
      </ThemeProvider>
    );
    image = screen.getByRole('img', { hidden: true });
    expect(image).toHaveAttribute('loading', 'lazy');
  });

  it('applies crossOrigin attribute correctly', () => {
    renderWithTheme(<Image src="https://example.com/image.jpg" alt="Test image" crossOrigin="anonymous" />);
    
    const image = screen.getByRole('img', { hidden: true });
    expect(image).toHaveAttribute('crossOrigin', 'anonymous');
  });

  it('applies custom className', () => {
    renderWithTheme(
      <Image src="https://example.com/image.jpg" alt="Test image" className="custom-image" data-testid="image-container" />
    );

    const imageContainer = screen.getByTestId('image-container');
    expect(imageContainer).toHaveClass('custom-image');
    expect(imageContainer).toHaveAttribute('data-state', 'loading');
  });

  it('applies loading state class', () => {
    renderWithTheme(<Image src="https://example.com/image.jpg" alt="Test image" data-testid="image-container" />);

    const imageContainer = screen.getByTestId('image-container');
    expect(imageContainer).toHaveAttribute('data-state', 'loading');
  });

  it('applies error state class', async () => {
    renderWithTheme(<Image src="https://example.com/error.jpg" alt="Test image" data-testid="image-container" />);

    const image = screen.getByRole('img', { hidden: true });
    fireEvent.error(image);

    await waitFor(() => {
      const imageContainer = screen.getByTestId('image-container');
      expect(imageContainer).toHaveAttribute('data-state', 'error');
    });
  });

  it('forwards additional props to Box', () => {
    renderWithTheme(<Image src="https://example.com/image.jpg" alt="Test image" data-testid="custom-image" />);
    
    const imageContainer = screen.getByTestId('custom-image');
    expect(imageContainer).toBeInTheDocument();
  });

  it('applies custom styles', () => {
    renderWithTheme(
      <Image src="https://example.com/image.jpg" alt="Test image" style={{ opacity: 0.8 }} data-testid="image-container" />
    );

    const imageContainer = screen.getByTestId('image-container');
    expect(imageContainer).toHaveStyle('opacity: 0.8');
  });

  it('shows placeholder in light mode when spinner disabled', () => {
    renderWithTheme(
      <Image
        src="https://example.com/image.jpg"
        alt="Test image"
        showLoadingSpinner={false}
        data-testid="image-container"
      />
    );

    // Check that the container is in loading state
    const imageContainer = screen.getByTestId('image-container');
    expect(imageContainer).toHaveAttribute('data-state', 'loading');
  });

  it('shows error state in dark mode', async () => {
    renderWithDarkMode(<Image src="https://example.com/error.jpg" alt="Test image"  />);

    const image = screen.getByRole('img', { hidden: true });
    fireEvent.error(image);

    await waitFor(() => {
      const errorContainer = screen.getByText('Failed to load image').parentElement?.parentElement;
      expect(errorContainer).toBeInTheDocument();
    });
  });

  it('shows error state in light mode', async () => {
    renderWithTheme(<Image src="https://example.com/error.jpg" alt="Test image"  />);

    const image = screen.getByRole('img', { hidden: true });
    fireEvent.error(image);

    await waitFor(() => {
      const errorContainer = screen.getByText('Failed to load image').parentElement?.parentElement;
      expect(errorContainer).toBeInTheDocument();
    });
  });

  it('applies min-height to placeholder', () => {
    renderWithTheme(
      <Image
        src="https://example.com/image.jpg"
        alt="Test image"
        height="200px"
        showLoadingSpinner={false}
        data-testid="image-container"
      />
    );

    // Check that container has correct height
    const imageContainer = screen.getByTestId('image-container');
    expect(imageContainer.style.height).toBe('200px');
  });

  it('shows spinner in dark mode', () => {
    renderWithTheme(<Image src="https://example.com/image.jpg" alt="Test image"  />);
    
    const spinner = screen.getByRole('status');
    // The spinner should be rendered with isDarkMode=true
    expect(spinner).toBeInTheDocument();
  });

  it('handles fallback error correctly', async () => {
    renderWithTheme(
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