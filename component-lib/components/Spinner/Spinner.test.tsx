import { render, screen, renderWithDarkMode } from '../../test-utils';
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
    expect(spinner).toHaveStyle('width: 1rem; height: 1rem');

    rerender(<Spinner size="lg" />);
    spinner = screen.getByRole('status');
    expect(spinner).toHaveStyle('width: 2rem; height: 2rem');
  });

  it('applies custom color in light mode', () => {
    render(<Spinner color="#ff0000"  />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveStyle('border-top: 2px solid #ff0000');
  });

  it('applies theme-based color for light mode', () => {
    render(<Spinner  />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveStyle('border-top: 2px solid #0284c7'); // blue.600
  });

  it('applies theme-based color for dark mode', () => {
    renderWithDarkMode(<Spinner  />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveStyle('border-top: 2px solid #38bdf8'); // blue.400
  });

  it('applies custom className', () => {
    render(<Spinner className="custom-spinner" />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('mond-spinner', 'custom-spinner');
  });

  it('forwards additional props to Box', () => {
    render(<Spinner data-testid="custom-spinner" p="4" />);
    
    const spinner = screen.getByTestId('custom-spinner');
    expect(spinner).toBeInTheDocument();
  });

  it('applies spinning animation', () => {
    render(<Spinner />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveStyle('animation: mond-spin 1s linear infinite');
  });

  it('has proper accessibility attributes', () => {
    render(<Spinner />);
    
    const spinner = screen.getByRole('status');
    const hiddenText = screen.getByText('Loading...');
    
    expect(spinner).toHaveAttribute('role', 'status');
    expect(spinner).toHaveAttribute('aria-label', 'Loading...');
    
    // Check that the text is visually hidden but available to screen readers
    expect(hiddenText).toHaveStyle({
      position: 'absolute',
      width: '1px',
      height: '1px',
      overflow: 'hidden'
    });
  });

  it('applies custom styles', () => {
    render(<Spinner style={{ margin: '10px' }} />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveStyle('margin: 10px');
  });
});