import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Image } from './Image';

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

  it('renders with required props and loading spinner', () => {
    const { rerender } = render(<Image src="https://example.com/image.jpg" alt="Test image" />);

    const image = screen.getByRole('img', { hidden: true });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
    expect(image).toHaveAttribute('alt', 'Test image');
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Loading image...')).toBeInTheDocument();

    rerender(<Image src="https://example.com/image.jpg" alt="Test image" showLoadingSpinner={false} />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('applies object-fit and aspect ratio classes correctly', () => {
    const { container, rerender } = render(<Image src="https://example.com/image.jpg" alt="Test image" fit="contain" aspectRatio="16:9" />);

    let image = screen.getByRole('img', { hidden: true });
    expect(image).toHaveClass('mond-image__img--contain');

    const imageContainer = container.querySelector('.mond-image');
    expect(imageContainer).toHaveClass('mond-image--ratio-16-9');

    rerender(<Image src="https://example.com/image.jpg" alt="Test image" fit="cover" />);
    image = screen.getByRole('img', { hidden: true });
    expect(image).toHaveClass('mond-image__img--cover');
  });

  it('applies border radius and custom dimensions', () => {
    const { container } = render(
      <Image src="https://example.com/image.jpg" alt="Test image" borderRadius="lg" width="200px" height="150px" />
    );

    const imageContainer = container.querySelector('.mond-image');
    expect(imageContainer).toHaveStyle('border-radius: 0.5rem');
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
      expect(imageContainer).not.toHaveClass('mond-image--loading');
    });
  });

  it('handles image error with and without fallback', async () => {
    const onError = jest.fn();
    const { rerender } = render(<Image src="https://example.com/error.jpg" alt="Test image" onError={onError} />);

    let image = screen.getByRole('img', { hidden: true });
    fireEvent.error(image);

    await waitFor(() => {
      expect(onError).toHaveBeenCalled();
      expect(screen.getByText('Failed to load image')).toBeInTheDocument();
    });

    rerender(<Image src="https://example.com/error.jpg" fallbackSrc="https://example.com/fallback.jpg" alt="Test image" onError={onError} />);

    image = screen.getByRole('img', { hidden: true });
    fireEvent.error(image);

    await waitFor(() => {
      expect(image).toHaveAttribute('src', 'https://example.com/fallback.jpg');
    });
  });

  it('applies loading and error state classes', async () => {
    const { container, rerender } = render(<Image src="https://example.com/image.jpg" alt="Test image" />);

    const imageContainer = container.querySelector('.mond-image');
    expect(imageContainer).toHaveClass('mond-image--loading');

    rerender(<Image src="https://example.com/error.jpg" alt="Test image" />);

    const image = screen.getByRole('img', { hidden: true });
    fireEvent.error(image);

    await waitFor(() => {
      const errorContainer = container.querySelector('.mond-image');
      expect(errorContainer).toHaveClass('mond-image--error');
    });
  });

  it('applies loading and crossOrigin attributes', () => {
    const { rerender } = render(<Image src="https://example.com/image.jpg" alt="Test image" loading="eager" />);
    let image = screen.getByRole('img', { hidden: true });
    expect(image).toHaveAttribute('loading', 'eager');

    rerender(<Image src="https://example.com/image.jpg" alt="Test image" loading="lazy" crossOrigin="anonymous" />);
    image = screen.getByRole('img', { hidden: true });
    expect(image).toHaveAttribute('loading', 'lazy');
    expect(image).toHaveAttribute('crossOrigin', 'anonymous');
  });

  it('applies custom className and styles', () => {
    render(
      <Image src="https://example.com/image.jpg" alt="Test image" className="custom-image" style={{ opacity: 0.8 }} data-testid="custom-image" />
    );

    const imageContainer = screen.getByTestId('custom-image');
    expect(imageContainer).toHaveClass('mond-image', 'mond-image--loading', 'custom-image');
    expect(imageContainer).toHaveStyle('opacity: 0.8');
  });

  it('handles fallback error correctly', async () => {
    render(<Image src="https://example.com/error.jpg" fallbackSrc="https://example.com/error-fallback.jpg" alt="Test image" />);

    const image = screen.getByRole('img', { hidden: true });

    fireEvent.error(image);
    await waitFor(() => {
      expect(image).toHaveAttribute('src', 'https://example.com/error-fallback.jpg');
    });

    fireEvent.error(image);
    await waitFor(() => {
      expect(screen.getByText('Failed to load image')).toBeInTheDocument();
    });
  });
});
