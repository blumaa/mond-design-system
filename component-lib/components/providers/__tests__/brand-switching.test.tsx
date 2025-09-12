import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '../ThemeProvider';
import { Button } from '../../atoms/Button/Button';
import { cypherTheme } from '../../../brands/cypher';
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
    const defaultStyle = window.getComputedStyle(defaultButton);
    const defaultColor = defaultStyle.backgroundColor;
    
    rerender(
      <ThemeProvider brandTheme={cypherTheme} colorScheme="light">
        <Button variant="primary">Test Button</Button>
      </ThemeProvider>
    );
    
    const cypherButton = getByRole('button');
    const cypherStyle = window.getComputedStyle(cypherButton);
    const cypherColor = cypherStyle.backgroundColor;
    
    // The colors should be different between brands
    expect(defaultColor).not.toBe(cypherColor);
  });
});