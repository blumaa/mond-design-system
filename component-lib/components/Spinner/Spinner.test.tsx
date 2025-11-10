import { render, screen } from '../../test-utils';
import '@testing-library/jest-dom';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('renders with default props', () => {
    render(<Spinner />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute('aria-label', 'Loading...');
  });

  it('renders with custom label', () => {
    render(<Spinner label="Processing..." />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveAttribute('aria-label', 'Processing...');
    expect(screen.getByText('Processing...')).toBeInTheDocument();
  });

  it('applies size variants correctly', () => {
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
  });

  it('forwards additional props', () => {
    render(<Spinner data-testid="custom-spinner" />);

    const spinner = screen.getByTestId('custom-spinner');
    expect(spinner).toBeInTheDocument();
  });

  it('applies spinning animation class', () => {
    render(<Spinner />);

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('mond-spinner');
  });

  it('has proper accessibility attributes', () => {
    render(<Spinner />);

    const spinner = screen.getByRole('status');
    const hiddenText = screen.getByText('Loading...');

    expect(spinner).toHaveAttribute('role', 'status');
    expect(spinner).toHaveAttribute('aria-label', 'Loading...');

    // Check that the text is visually hidden but available to screen readers
    expect(hiddenText).toHaveClass('mond-spinner__label');
  });

  it('applies custom styles', () => {
    render(<Spinner style={{ margin: '10px' }} />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveStyle('margin: 10px');
  });
});