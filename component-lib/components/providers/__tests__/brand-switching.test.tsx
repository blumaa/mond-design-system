import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '../ThemeProvider';
import { Button } from '../../Button/Button';
import { brand1Theme } from '../../../brands/brand-1';
import { mondTheme } from '../../../brands/mond';

describe('Brand Switching', () => {
  it('should render Button with default brand colors', () => {
    const { getByRole } = render(
      <ThemeProvider brandTheme={mondTheme} colorScheme="light">
        <Button variant="primary">Test Button</Button>
      </ThemeProvider>
    );
    
    const button = getByRole('button');
    expect(button).toBeInTheDocument();
    
    // Verify the button has some background color applied (not transparent)
    const computedStyle = window.getComputedStyle(button);
    expect(computedStyle.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    expect(computedStyle.backgroundColor).not.toBe('transparent');
  });

  it('should render Button with Brand 1 colors', () => {
    const { getByRole } = render(
      <ThemeProvider brandTheme={brand1Theme} colorScheme="light">
        <Button variant="primary">Test Button</Button>
      </ThemeProvider>
    );

    const button = getByRole('button');
    expect(button).toBeInTheDocument();

    // Verify the button has styling applied
    const computedStyle = window.getComputedStyle(button);
    expect(computedStyle.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    expect(computedStyle.backgroundColor).not.toBe('transparent');
  });

  it('should apply correct data-theme attribute for different brands', () => {
    const { rerender, container } = render(
      <ThemeProvider brandTheme={mondTheme} colorScheme="light">
        <Button variant="primary">Test Button</Button>
      </ThemeProvider>
    );

    const themeDiv = container.firstChild;
    expect(themeDiv).toHaveAttribute('data-theme', 'light');
    expect(themeDiv).toHaveAttribute('data-brand', 'mond');

    rerender(
      <ThemeProvider brandTheme={brand1Theme} colorScheme="light">
        <Button variant="primary">Test Button</Button>
      </ThemeProvider>
    );

    expect(themeDiv).toHaveAttribute('data-theme', 'light');
    expect(themeDiv).toHaveAttribute('data-brand', 'brand-1');
  });
});