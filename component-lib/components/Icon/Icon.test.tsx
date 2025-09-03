import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Icon } from './Icon';

const TestPath = () => (
  <path 
    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
    fill="currentColor"
  />
);

describe('Icon', () => {
  it('renders correctly with default props', () => {
    render(
      <Icon>
        <TestPath />
      </Icon>
    );
    
    const icon = screen.getByRole('img');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('width', '20px');
    expect(icon).toHaveAttribute('height', '20px');
    expect(icon).toHaveAttribute('viewBox', '0 0 24 24');
  });

  it('renders with custom size', () => {
    render(
      <Icon size="lg">
        <TestPath />
      </Icon>
    );
    
    const icon = screen.getByRole('img');
    expect(icon).toHaveAttribute('width', '24px');
    expect(icon).toHaveAttribute('height', '24px');
  });

  it('applies correct sizes for all size variants', () => {
    const sizes = {
      xs: '12px',
      sm: '16px',
      md: '20px',
      lg: '24px',
      xl: '32px',
      '2xl': '40px'
    };

    Object.entries(sizes).forEach(([size, expectedSize]) => {
      const { unmount } = render(
        <Icon size={size as any}>
          <TestPath />
        </Icon>
      );
      
      const icon = screen.getByRole('img');
      expect(icon).toHaveAttribute('width', expectedSize);
      expect(icon).toHaveAttribute('height', expectedSize);
      
      unmount();
    });
  });

  it('renders with accessibility label', () => {
    render(
      <Icon label="Test icon">
        <TestPath />
      </Icon>
    );
    
    const icon = screen.getByRole('img');
    expect(icon).toHaveAttribute('aria-label', 'Test icon');
    expect(icon).not.toHaveAttribute('aria-hidden');
  });

  it('renders as decorative when specified', () => {
    render(
      <Icon decorative data-testid="decorative-icon">
        <TestPath />
      </Icon>
    );
    
    const icon = screen.getByTestId('decorative-icon');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon).toHaveAttribute('role', 'presentation');
    expect(icon).not.toHaveAttribute('aria-label');
  });

  it('renders with custom color', () => {
    render(
      <Icon color="red">
        <TestPath />
      </Icon>
    );
    
    const icon = screen.getByRole('img');
    expect(icon).toHaveStyle({ color: 'red' });
  });

  it('passes through additional props', () => {
    render(
      <Icon className="custom-class" data-testid="custom-icon">
        <TestPath />
      </Icon>
    );
    
    const icon = screen.getByTestId('custom-icon');
    expect(icon).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<SVGSVGElement>();
    
    render(
      <Icon ref={ref}>
        <TestPath />
      </Icon>
    );
    
    expect(ref.current).toBeInstanceOf(SVGSVGElement);
  });

  it('has flexShrink set to 0 to prevent shrinking', () => {
    render(
      <Icon data-testid="icon">
        <TestPath />
      </Icon>
    );
    
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveStyle({ flexShrink: '0' });
  });

  it('is inline-block by default', () => {
    render(
      <Icon data-testid="icon">
        <TestPath />
      </Icon>
    );
    
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveStyle({ display: 'inline-block' });
  });

  it('supports dark mode', () => {
    render(
      <Icon isDarkMode data-testid="icon">
        <TestPath />
      </Icon>
    );
    
    const icon = screen.getByTestId('icon');
    expect(icon).toBeInTheDocument();
  });
});