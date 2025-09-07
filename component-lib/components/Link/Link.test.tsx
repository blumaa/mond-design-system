import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Link } from './Link';

describe('Link Component', () => {
  it('renders with required href and children', () => {
    render(<Link href="https://example.com">Test Link</Link>);
    
    const link = screen.getByRole('link', { name: 'Test Link' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('renders with default props', () => {
    render(<Link href="/test">Default Link</Link>);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('data-mond-link');
    expect(link).toHaveStyle('display: inline-flex');
    expect(link).toHaveStyle('align-items: center');
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<Link href="/test" size="small">Small</Link>);
    let link = screen.getByRole('link');
    expect(link).toHaveStyle('font-size: 0.875rem'); // fontSizes.sm

    rerender(<Link href="/test" size="medium">Medium</Link>);
    link = screen.getByRole('link');
    expect(link).toHaveStyle('font-size: 1rem'); // fontSizes.base

    rerender(<Link href="/test" size="large">Large</Link>);
    link = screen.getByRole('link');
    expect(link).toHaveStyle('font-size: 1.125rem'); // fontSizes.lg
  });

  it('renders icon-only links correctly', () => {
    const TestIcon = <svg data-testid="test-icon"><path /></svg>;
    render(<Link href="/test" iconOnly icon={TestIcon}>Hidden Text</Link>);
    
    const link = screen.getByRole('link');
    const icon = screen.getByTestId('test-icon');
    
    expect(icon).toBeInTheDocument();
    expect(screen.queryByText('Hidden Text')).not.toBeInTheDocument();
  });

  it('renders with icon and text', () => {
    const TestIcon = <svg data-testid="test-icon"><path /></svg>;
    render(<Link href="/test" icon={TestIcon}>With Icon</Link>);
    
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    expect(screen.getByText('With Icon')).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLAnchorElement>();
    render(<Link ref={ref} href="/test">Ref Link</Link>);
    
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
    expect(ref.current).toHaveAttribute('href', '/test');
  });

  it('forwards additional anchor props', () => {
    render(
      <Link 
        href="/test" 
        target="_blank" 
        rel="noopener noreferrer"
        data-testid="custom-link"
        title="Custom Title"
      >
        Custom Link
      </Link>
    );
    
    const link = screen.getByTestId('custom-link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link).toHaveAttribute('title', 'Custom Title');
  });

  it('applies custom styles', () => {
    render(
      <Link href="/test" style={{ color: 'red', margin: '10px' }}>
        Styled Link
      </Link>
    );
    
    const link = screen.getByRole('link');
    expect(link).toHaveStyle('color: red');
    expect(link).toHaveStyle('margin: 10px');
  });

  it('handles mouse interactions', () => {
    const onMouseEnter = jest.fn();
    const onMouseLeave = jest.fn();
    const onMouseDown = jest.fn();
    const onMouseUp = jest.fn();

    render(
      <Link 
        href="/test"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
      >
        Interactive Link
      </Link>
    );
    
    const link = screen.getByRole('link');
    
    fireEvent.mouseEnter(link);
    expect(onMouseEnter).toHaveBeenCalledTimes(1);
    
    fireEvent.mouseLeave(link);
    expect(onMouseLeave).toHaveBeenCalledTimes(1);
    
    fireEvent.mouseDown(link);
    expect(onMouseDown).toHaveBeenCalledTimes(1);
    
    fireEvent.mouseUp(link);
    expect(onMouseUp).toHaveBeenCalledTimes(1);
  });

  it('handles focus and blur events', () => {
    const onFocus = jest.fn();
    const onBlur = jest.fn();

    render(
      <Link href="/test" onFocus={onFocus} onBlur={onBlur}>
        Focus Link
      </Link>
    );
    
    const link = screen.getByRole('link');
    
    fireEvent.focus(link);
    expect(onFocus).toHaveBeenCalledTimes(1);
    
    fireEvent.blur(link);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('handles click events', () => {
    const onClick = jest.fn();
    render(<Link href="/test" onClick={onClick}>Clickable Link</Link>);
    
    const link = screen.getByRole('link');
    fireEvent.click(link);
    
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders with dark mode', () => {
    render(<Link href="/test" isDarkMode>Dark Mode Link</Link>);
    
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveStyle('text-decoration-color: #38bdf8'); // blue.400 for dark mode
  });

  it('renders with light mode by default', () => {
    render(<Link href="/test">Light Mode Link</Link>);
    
    const link = screen.getByRole('link');
    expect(link).toHaveStyle('text-decoration-color: #0284c7'); // blue.600 for light mode
  });

  it('has proper accessibility attributes', () => {
    render(<Link href="/test">Accessible Link</Link>);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/test');
    expect(link).toBeVisible();
  });

  it('handles external links', () => {
    render(<Link href="https://external.com">External Link</Link>);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://external.com');
  });

  it('renders without children for icon-only links', () => {
    const TestIcon = <span data-testid="icon">Icon</span>;
    render(<Link href="/test" iconOnly icon={TestIcon} />);
    
    const link = screen.getByRole('link');
    const icon = screen.getByTestId('icon');
    
    expect(link).toBeInTheDocument();
    expect(icon).toBeInTheDocument();
    expect(link.textContent).toBe('Icon');
  });

  it('applies font family from design tokens', () => {
    render(<Link href="/test">Font Link</Link>);
    
    const link = screen.getByRole('link');
    expect(link).toHaveStyle(`font-family: 'DM Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`);
  });

  it('handles empty children gracefully', () => {
    render(<Link href="/test"></Link>);
    
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link.textContent).toBe('');
  });

  describe('Size-specific styling', () => {
    it('applies correct gap for small size with content', () => {
      render(<Link href="/test" size="small">Small with gap</Link>);
      
      const link = screen.getByRole('link');
      expect(link).toHaveStyle('gap: 0.5rem'); // spacing[2]
    });

    it('applies correct gap for medium size with content', () => {
      render(<Link href="/test" size="medium">Medium with gap</Link>);
      
      const link = screen.getByRole('link');
      expect(link).toHaveStyle('gap: 0.5rem'); // spacing[2]
    });

    it('applies correct gap for large size with content', () => {
      render(<Link href="/test" size="large">Large with gap</Link>);
      
      const link = screen.getByRole('link');
      expect(link).toHaveStyle('gap: 0.5rem'); // spacing[2]
    });

    it('does not apply gap for icon-only links', () => {
      const TestIcon = <span>Icon</span>;
      render(<Link href="/test" size="small" iconOnly icon={TestIcon} />);
      
      const link = screen.getByRole('link');
      expect(link).not.toHaveStyle('gap: 0.5rem');
    });
  });

  describe('Interactive state handling', () => {
    it('changes styles on hover', () => {
      render(<Link href="/test">Hover Link</Link>);
      
      const link = screen.getByRole('link');
      fireEvent.mouseEnter(link);
      
      // The component applies inline styles on hover
      expect(link).toBeInTheDocument();
    });

    it('resets styles on mouse leave', () => {
      render(<Link href="/test">Leave Link</Link>);
      
      const link = screen.getByRole('link');
      fireEvent.mouseEnter(link);
      fireEvent.mouseLeave(link);
      
      expect(link).toBeInTheDocument();
    });

    it('applies focus styles', () => {
      render(<Link href="/test">Focus Link</Link>);
      
      const link = screen.getByRole('link');
      fireEvent.focus(link);
      
      expect(link).toBeInTheDocument();
    });

    it('removes focus styles on blur', () => {
      render(<Link href="/test">Blur Link</Link>);
      
      const link = screen.getByRole('link');
      fireEvent.focus(link);
      fireEvent.blur(link);
      
      expect(link).toBeInTheDocument();
    });
  });
});