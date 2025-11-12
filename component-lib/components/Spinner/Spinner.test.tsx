import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('renders with default label and accessibility attributes', () => {
    render(<Spinner />);

    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute('aria-label', 'Loading...');
    expect(spinner).toHaveAttribute('role', 'status');

    const hiddenText = screen.getByText('Loading...');
    expect(hiddenText).toHaveClass('mond-spinner__label');
  });

  it('renders with custom label', () => {
    render(<Spinner label="Processing..." />);

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveAttribute('aria-label', 'Processing...');
    expect(screen.getByText('Processing...')).toBeInTheDocument();
  });

  it('applies size variants using rerender', () => {
    const { rerender } = render(<Spinner size="xs" />);
    let spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('mond-spinner--xs');

    rerender(<Spinner size="lg" />);
    spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('mond-spinner--lg');
  });

  it('applies custom color class when color prop is provided', () => {
    render(<Spinner color="#ff0000" />);

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('mond-spinner--custom');
    expect(spinner).toHaveStyle({ '--spinner-custom-color': '#ff0000' });
  });

  it('applies default color class when no color prop', () => {
    render(<Spinner />);

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('mond-spinner--default');
    expect(spinner).toHaveClass('mond-spinner');
  });

  it('forwards additional props and custom styles', () => {
    render(<Spinner data-testid="custom-spinner" style={{ margin: '10px' }} />);

    const spinner = screen.getByTestId('custom-spinner');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveStyle('margin: 10px');
  });
});
