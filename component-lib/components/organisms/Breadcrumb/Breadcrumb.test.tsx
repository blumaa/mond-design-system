import React from 'react';
import { render, screen, fireEvent } from '../../../test-utils';
import '@testing-library/jest-dom';
import { Breadcrumb } from './Breadcrumb';
import type { BreadcrumbItem } from './Breadcrumb';

const mockItems: BreadcrumbItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Electronics', href: '/products/electronics' },
  { label: 'Laptops', href: '/products/electronics/laptops' },
  { label: 'MacBook Pro' },
];

describe('Breadcrumb', () => {
  it('renders breadcrumb items correctly', () => {
    render(<Breadcrumb items={mockItems} />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText('Laptops')).toBeInTheDocument();
    expect(screen.getByText('MacBook Pro')).toBeInTheDocument();
  });

  it('renders separators between items', () => {
    render(<Breadcrumb items={mockItems} />);
    
    const separators = screen.getAllByText('/');
    expect(separators).toHaveLength(4);
  });

  it('renders custom separator', () => {
    render(<Breadcrumb items={mockItems} separator=">" />);
    
    const separators = screen.getAllByText('>');
    expect(separators).toHaveLength(4);
  });

  it('handles item clicks', () => {
    const handleClick = jest.fn();
    const clickableItems: BreadcrumbItem[] = [
      { label: 'Home', onClick: handleClick },
      { label: 'Current Page' },
    ];
    
    render(<Breadcrumb items={clickableItems} />);
    
    fireEvent.click(screen.getByText('Home'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not handle clicks for disabled items', () => {
    const handleClick = jest.fn();
    const disabledItems: BreadcrumbItem[] = [
      { label: 'Home', onClick: handleClick, disabled: true },
      { label: 'Current Page' },
    ];
    
    render(<Breadcrumb items={disabledItems} />);
    
    fireEvent.click(screen.getByText('Home'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('collapses items when maxItems is set', () => {
    render(<Breadcrumb items={mockItems} maxItems={3} />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('...')).toBeInTheDocument();
    expect(screen.getByText('MacBook Pro')).toBeInTheDocument();
    
    expect(screen.queryByText('Products')).not.toBeInTheDocument();
    expect(screen.queryByText('Electronics')).not.toBeInTheDocument();
    expect(screen.queryByText('Laptops')).not.toBeInTheDocument();
  });

  it('renders with home icon when showHomeIcon is true', () => {
    render(<Breadcrumb items={mockItems} showHomeIcon />);
    
    const homeItem = screen.getByText('Home').closest('span');
    expect(homeItem).toBeInTheDocument();
  });

  it('renders different sizes correctly', () => {
    const { rerender } = render(<Breadcrumb items={mockItems} size="sm" />);
    
    let breadcrumbItem = screen.getByText('Home').parentElement;
    expect(breadcrumbItem).toHaveStyle({ fontSize: '0.75rem' });
    
    rerender(<Breadcrumb items={mockItems} size="lg" />);
    breadcrumbItem = screen.getByText('Home').parentElement;
    expect(breadcrumbItem).toHaveStyle({ fontSize: '1rem' });
  });

  it('renders with dark mode', () => {
    render(<Breadcrumb items={mockItems} />);
    
    const breadcrumb = screen.getByRole('navigation');
    expect(breadcrumb).toBeInTheDocument();
  });

  it('renders with custom data-testid', () => {
    render(<Breadcrumb items={mockItems} data-testid="custom-breadcrumb" />);
    
    expect(screen.getByTestId('custom-breadcrumb')).toBeInTheDocument();
  });

  it('renders items with icons', () => {
    const itemsWithIcons: BreadcrumbItem[] = [
      { label: 'Home', icon: <span data-testid="home-icon">🏠</span> },
      { label: 'Current Page' },
    ];
    
    render(<Breadcrumb items={itemsWithIcons} />);
    
    expect(screen.getByTestId('home-icon')).toBeInTheDocument();
  });

  it('has proper ARIA attributes', () => {
    render(<Breadcrumb items={mockItems} />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label', 'Breadcrumb');
  });

  it('handles empty items array', () => {
    render(<Breadcrumb items={[]} />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    expect(nav).toBeEmptyDOMElement();
  });
});