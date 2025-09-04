import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Divider } from './Divider';

describe('Divider', () => {
  it('renders horizontal divider by default', () => {
    render(<Divider />);
    
    const divider = screen.getByRole('separator');
    expect(divider).toBeInTheDocument();
    expect(divider.tagName).toBe('HR');
    expect(divider).toHaveClass('mond-divider--horizontal');
  });

  it('renders vertical divider', () => {
    render(<Divider orientation="vertical" />);
    
    const divider = screen.getByRole('separator');
    expect(divider).toBeInTheDocument();
    expect(divider.tagName).toBe('DIV');
    expect(divider).toHaveClass('mond-divider--vertical');
    expect(divider).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('applies variant styles correctly', () => {
    const { rerender } = render(<Divider variant="default" isDarkMode={false} />);
    let divider = screen.getByRole('separator');
    expect(divider).toHaveStyle('background-color: #cbd5e1'); // gray.300

    rerender(<Divider variant="subtle" isDarkMode={false} />);
    divider = screen.getByRole('separator');
    expect(divider).toHaveStyle('background-color: #e2e8f0'); // gray.200

    rerender(<Divider variant="strong" isDarkMode={false} />);
    divider = screen.getByRole('separator');
    expect(divider).toHaveStyle('background-color: #94a3b8'); // gray.400
  });

  it('applies dark mode colors correctly', () => {
    const { rerender } = render(<Divider variant="default" isDarkMode={true} />);
    let divider = screen.getByRole('separator');
    expect(divider).toHaveStyle('background-color: #475569'); // gray.600

    rerender(<Divider variant="subtle" isDarkMode={true} />);
    divider = screen.getByRole('separator');
    expect(divider).toHaveStyle('background-color: #334155'); // gray.700

    rerender(<Divider variant="strong" isDarkMode={true} />);
    divider = screen.getByRole('separator');
    expect(divider).toHaveStyle('background-color: #64748b'); // gray.500
  });

  it('applies size variants correctly', () => {
    const { rerender } = render(<Divider size="sm" />);
    let divider = screen.getByRole('separator');
    expect(divider).toHaveStyle('height: 1px');

    rerender(<Divider size="lg" />);
    divider = screen.getByRole('separator');
    expect(divider).toHaveStyle('height: 2px');

    rerender(<Divider orientation="vertical" size="lg" />);
    divider = screen.getByRole('separator');
    expect(divider).toHaveStyle('width: 2px');
  });

  it('renders divider with text content', () => {
    render(<Divider>OR</Divider>);
    
    const divider = screen.getByRole('separator');
    expect(divider).toBeInTheDocument();
    expect(screen.getByText('OR')).toBeInTheDocument();
    
    // Should render as flex container with text
    expect(divider).toHaveStyle('display: flex');
    expect(divider).toHaveStyle('align-items: center');
  });

  it('applies default margins correctly', () => {
    render(<Divider />);
    
    const divider = screen.getByRole('separator');
    // Default horizontal margins for horizontal divider
    expect(divider).toHaveStyle('margin-top: 1rem; margin-bottom: 1rem'); // my="4"
  });

  it('applies custom margins', () => {
    render(<Divider my="2" mx="6" />);
    
    const divider = screen.getByRole('separator');
    expect(divider).toHaveStyle('margin-top: 0.5rem; margin-bottom: 0.5rem'); // my="2" 
    expect(divider).toHaveStyle('margin-left: 1.5rem; margin-right: 1.5rem'); // mx="6"
  });

  it('applies custom className', () => {
    render(<Divider className="custom-divider" />);
    
    const divider = screen.getByRole('separator');
    expect(divider).toHaveClass('mond-divider', 'mond-divider--horizontal', 'custom-divider');
  });

  it('forwards additional props to Box', () => {
    render(<Divider data-testid="custom-divider" />);
    
    const divider = screen.getByTestId('custom-divider');
    expect(divider).toBeInTheDocument();
  });

  it('applies custom styles', () => {
    render(<Divider style={{ opacity: 0.5 }} />);
    
    const divider = screen.getByRole('separator');
    expect(divider).toHaveStyle('opacity: 0.5');
  });

  it('renders vertical divider with minimum height', () => {
    render(<Divider orientation="vertical" />);
    
    const divider = screen.getByRole('separator');
    expect(divider).toHaveStyle('min-height: 24px');
    expect(divider).toHaveStyle('height: 100%');
  });

  it('renders text divider with proper styling', () => {
    render(<Divider isDarkMode={false}>Section</Divider>);
    
    const divider = screen.getByRole('separator');
    const text = screen.getByText('Section');
    
    expect(divider).toHaveStyle('font-size: 0.875rem'); // sm
    expect(divider).toHaveStyle('color: #475569'); // gray.600 in light mode
    expect(divider).toHaveStyle('font-weight: 500'); // medium
    expect(text).toBeInTheDocument();
  });

  it('renders text divider in dark mode with correct colors', () => {
    render(<Divider isDarkMode={true}>Section</Divider>);
    
    const divider = screen.getByRole('separator');
    expect(divider).toHaveStyle('color: #94a3b8'); // gray.400 in dark mode
  });
});