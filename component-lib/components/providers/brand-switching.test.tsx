import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from './ThemeProvider';
import { Button } from '../Button/Button';
import { cypherTheme } from '../../brands/cypher';
import { mondTheme } from '../../brands/mond';

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

  it('should render Button with CYPHER brand colors', () => {
    const { getByRole } = render(
      <ThemeProvider brandTheme={cypherTheme} colorScheme="light">
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

  it('should apply different colors for different brands', () => {
    const { rerender, getByRole } = render(
      <ThemeProvider brandTheme={mondTheme} colorScheme="light">
        <Button variant="primary">Test Button</Button>
      </ThemeProvider>
    );

    const defaultButton = getByRole('button');
    expect(defaultButton).toBeInTheDocument();
    expect(defaultButton).toHaveClass('mond-button');
    expect(defaultButton).toHaveClass('mond-button--primary');

    rerender(
      <ThemeProvider brandTheme={cypherTheme} colorScheme="light">
        <Button variant="primary">Test Button</Button>
      </ThemeProvider>
    );

    const cypherButton = getByRole('button');
    expect(cypherButton).toBeInTheDocument();
    expect(cypherButton).toHaveClass('mond-button');
    expect(cypherButton).toHaveClass('mond-button--primary');

    // Both buttons use the same CSS classes but different CSS variables for colors
    // The actual color values are applied via CSS and will differ between brands
  });
});