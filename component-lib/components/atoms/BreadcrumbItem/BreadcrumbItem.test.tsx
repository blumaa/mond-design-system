import { render, screen, fireEvent } from '@testing-library/react';
import { BreadcrumbItem } from './BreadcrumbItem';

describe('BreadcrumbItem', () => {
  it('renders children correctly', () => {
    render(<BreadcrumbItem>Home</BreadcrumbItem>);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('renders as a link when href is provided', () => {
    render(<BreadcrumbItem href="/home">Home</BreadcrumbItem>);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/home');
    expect(link).toContainElement(screen.getByText('Home'));
  });

  it('renders as a button when onClick is provided', () => {
    const handleClick = jest.fn();
    render(<BreadcrumbItem onClick={handleClick}>Clickable</BreadcrumbItem>);
    
    const button = screen.getByRole('button');
    expect(button).toContainElement(screen.getByText('Clickable'));
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<BreadcrumbItem onClick={handleClick}>Clickable</BreadcrumbItem>);
    
    fireEvent.click(screen.getByText('Clickable'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not render as link or button for current item', () => {
    render(<BreadcrumbItem href="/current" current>Current</BreadcrumbItem>);
    
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByText('Current')).toBeInTheDocument();
  });

  it('does not render as link or button when disabled', () => {
    render(<BreadcrumbItem href="/disabled" disabled>Disabled</BreadcrumbItem>);
    
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByText('Disabled')).toBeInTheDocument();
  });

  it('does not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(<BreadcrumbItem onClick={handleClick} disabled>Disabled</BreadcrumbItem>);
    
    fireEvent.click(screen.getByText('Disabled'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies current styling', () => {
    render(<BreadcrumbItem current>Current Page</BreadcrumbItem>);
    
    const item = screen.getByText('Current Page').closest('.mond-breadcrumb-item');
    expect(item).toHaveClass('mond-breadcrumb-item--current');
  });

  it('applies disabled styling', () => {
    render(<BreadcrumbItem disabled>Disabled Page</BreadcrumbItem>);
    
    const item = screen.getByText('Disabled Page').closest('.mond-breadcrumb-item');
    expect(item).toHaveClass('mond-breadcrumb-item--disabled');
  });

  it('renders icon when provided', () => {
    render(
      <BreadcrumbItem icon={<span data-testid="home-icon">🏠</span>}>
        Home
      </BreadcrumbItem>
    );
    
    expect(screen.getByTestId('home-icon')).toBeInTheDocument();
  });

  it('shows separator when showSeparator is true', () => {
    render(<BreadcrumbItem showSeparator>Item</BreadcrumbItem>);
    
    expect(screen.getByText('/')).toBeInTheDocument();
  });

  it('uses custom separator', () => {
    render(
      <BreadcrumbItem showSeparator separator=" > ">
        Item
      </BreadcrumbItem>
    );
    
    // The separator is rendered as HTML entities, so we need to look for the actual content
    expect(screen.getByText((content, node) => {
      return node?.textContent === ' > ';
    })).toBeInTheDocument();
  });

  it('does not show separator when showSeparator is false', () => {
    render(<BreadcrumbItem>Item</BreadcrumbItem>);
    
    expect(screen.queryByText('/')).not.toBeInTheDocument();
  });

  it('supports different sizes', () => {
    const { rerender } = render(<BreadcrumbItem size="sm">Small</BreadcrumbItem>);
    expect(screen.getByText('Small')).toBeInTheDocument();

    rerender(<BreadcrumbItem size="md">Medium</BreadcrumbItem>);
    expect(screen.getByText('Medium')).toBeInTheDocument();

    rerender(<BreadcrumbItem size="lg">Large</BreadcrumbItem>);
    expect(screen.getByText('Large')).toBeInTheDocument();
  });

  it('renders with dark mode', () => {
    render(<BreadcrumbItem isDarkMode>Dark Mode</BreadcrumbItem>);
    
    expect(screen.getByText('Dark Mode')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <BreadcrumbItem className="custom-class" data-testid="breadcrumb-item">
        Test
      </BreadcrumbItem>
    );
    
    expect(screen.getByTestId('breadcrumb-item')).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };
    render(<BreadcrumbItem ref={ref}>Test</BreadcrumbItem>);
    
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('passes through additional props', () => {
    render(
      <BreadcrumbItem data-testid="breadcrumb-item" aria-label="Breadcrumb item">
        Test
      </BreadcrumbItem>
    );
    
    const item = screen.getByTestId('breadcrumb-item');
    expect(item).toHaveAttribute('aria-label', 'Breadcrumb item');
  });

  // Accessibility tests
  it('has proper accessibility attributes', () => {
    render(<BreadcrumbItem href="/test">Test Link</BreadcrumbItem>);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/test');
  });

  it('handles keyboard navigation for buttons', () => {
    const handleClick = jest.fn();
    render(<BreadcrumbItem onClick={handleClick}>Button Item</BreadcrumbItem>);
    
    const buttonText = screen.getByText('Button Item');
    // Test that the button can receive focus and be clicked
    fireEvent.click(buttonText);
    expect(handleClick).toHaveBeenCalled();
  });

  it('renders separator with proper aria-hidden', () => {
    render(<BreadcrumbItem showSeparator>Item</BreadcrumbItem>);
    
    const separator = screen.getByText('/').closest('div');
    expect(separator).toHaveAttribute('aria-hidden', 'true');
  });

  // Interaction tests
  it('handles mouse events for interactive items', () => {
    render(<BreadcrumbItem href="/test">Interactive</BreadcrumbItem>);
    
    const item = screen.getByText('Interactive');
    fireEvent.mouseEnter(item);
    fireEvent.mouseLeave(item);
    // Should not throw errors
  });

  it('does not handle mouse events for non-interactive items', () => {
    render(<BreadcrumbItem current>Non-interactive</BreadcrumbItem>);
    
    const item = screen.getByText('Non-interactive');
    fireEvent.mouseEnter(item);
    fireEvent.mouseLeave(item);
    // Should not throw errors
  });

  // Edge cases
  it('handles empty children', () => {
    render(<BreadcrumbItem></BreadcrumbItem>);
    // Should not throw errors
  });

  it('handles complex children', () => {
    render(
      <BreadcrumbItem>
        <span>Complex</span> <strong>Content</strong>
      </BreadcrumbItem>
    );
    
    expect(screen.getByText('Complex')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});