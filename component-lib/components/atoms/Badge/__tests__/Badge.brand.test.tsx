import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Badge } from '../Badge';
import { ThemeProvider } from '../../../providers/ThemeProvider';
import { cypherTheme, fluxTheme, mondTheme } from '../../../../brands';

// Helper to render Badge with brand context
const renderWithBrand = (component: React.ReactElement, brandTheme: any, colorScheme: 'light' | 'dark' = 'dark') => {
  return render(
    <ThemeProvider brandTheme={brandTheme} colorScheme={colorScheme}>
      {component}
    </ThemeProvider>
  );
};

describe('Badge Brand-Agnostic Behavior', () => {
  describe('Success variant adapts to brand identity', () => {
    it('should show CYPHER brand color for success variant', () => {
      renderWithBrand(
        <Badge variant="success" data-testid="cypher-success">ONLINE</Badge>,
        cypherTheme
      );
      
      const badge = screen.getByTestId('cypher-success');
      // CYPHER brand uses neon green for success variant
      expect(badge).toHaveStyle('background-color: rgb(0, 255, 148)'); // #00ff94 - CYPHER brand primary
      expect(badge).toHaveStyle('color: rgb(0, 0, 0)'); // brand.interactive.text in dark mode
    });

    it('should show FLUX brand color for success variant', () => {
      renderWithBrand(
        <Badge variant="success" data-testid="flux-success">ONLINE</Badge>,
        fluxTheme
      );
      
      const badge = screen.getByTestId('flux-success');
      // FLUX brand uses electric purple for success variant
      expect(badge).toHaveStyle('background-color: rgb(229, 66, 255)'); // #e542ff - FLUX brand primary
      expect(badge).toHaveStyle('color: rgb(0, 0, 0)'); // brand.interactive.text in dark mode
    });

    it('should show MOND brand color for success variant', () => {
      renderWithBrand(
        <Badge variant="success" data-testid="mond-success">ONLINE</Badge>,
        mondTheme
      );
      
      const badge = screen.getByTestId('mond-success');
      // MOND brand uses blue for success variant
      expect(badge).toHaveStyle('background-color: rgb(14, 165, 233)'); // #0ea5e9 - MOND brand primary
      expect(badge).toHaveStyle('color: rgb(0, 0, 0)'); // brand.interactive.text in dark mode
    });
  });
});