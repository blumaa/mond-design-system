import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, BrandTheme } from './ThemeProvider';

describe('ThemeProvider Component', () => {
  it('renders children and applies theme attribute', () => {
    render(
      <ThemeProvider>
        <div data-testid="child">Child Content</div>
      </ThemeProvider>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByTestId('child')).toHaveTextContent('Child Content');
  });

  it('sets data-theme attribute based on colorScheme prop', () => {
    const { container, rerender } = render(
      <ThemeProvider>
        <div>Child</div>
      </ThemeProvider>
    );

    let wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveAttribute('data-theme', 'light');

    rerender(
      <ThemeProvider colorScheme="dark">
        <div>Child</div>
      </ThemeProvider>
    );

    wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveAttribute('data-theme', 'dark');
  });

  it('applies custom className to wrapper', () => {
    const { container } = render(
      <ThemeProvider className="custom-theme-class">
        <div>Child</div>
      </ThemeProvider>
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('custom-theme-class');
  });

  it('sets data-brand attribute and injects CSS variables when brand theme provided', () => {
    const customBrandTheme: BrandTheme = {
      id: 'test-brand',
      name: 'Test Brand',
      description: 'Test brand theme',
      colors: {
        brand: {
          primary: {
            500: '#ff0000',
            600: '#cc0000',
          },
          secondary: {
            500: '#00ff00',
          },
        },
      },
    };

    const { container } = render(
      <ThemeProvider brandTheme={customBrandTheme}>
        <div>Child</div>
      </ThemeProvider>
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveAttribute('data-brand', 'test-brand');
    expect(wrapper.style.getPropertyValue('--mond-color-brand-primary-500')).toBe('#ff0000');
    expect(wrapper.style.getPropertyValue('--mond-color-brand-primary-600')).toBe('#cc0000');
    expect(wrapper.style.getPropertyValue('--mond-color-brand-secondary-500')).toBe('#00ff00');
  });

  it('does not set data-brand when no brand theme provided', () => {
    const { container } = render(
      <ThemeProvider>
        <div>Child</div>
      </ThemeProvider>
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).not.toHaveAttribute('data-brand');
  });
});
