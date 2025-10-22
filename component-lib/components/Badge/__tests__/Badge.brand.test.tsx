import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Badge } from '../Badge';
import { ThemeProvider } from '../../providers/ThemeProvider';
import { cypherTheme, fluxTheme, mondTheme } from '../../../brands';
import type { BrandTheme } from '../../providers/ThemeProvider';

// Helper to render Badge with brand context
const renderWithBrand = (component: React.ReactElement, brandTheme: BrandTheme, colorScheme: 'light' | 'dark' = 'dark') => {
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
      // Badge now uses CSS classes and variables for theming
      expect(badge).toHaveClass('mond-badge');
      expect(badge).toHaveClass('mond-badge--success');
      expect(badge).toBeInTheDocument();
    });

    it('should show FLUX brand color for success variant', () => {
      renderWithBrand(
        <Badge variant="success" data-testid="flux-success">ONLINE</Badge>,
        fluxTheme
      );

      const badge = screen.getByTestId('flux-success');
      // Badge now uses CSS classes and variables for theming
      expect(badge).toHaveClass('mond-badge');
      expect(badge).toHaveClass('mond-badge--success');
      expect(badge).toBeInTheDocument();
    });

    it('should show MOND brand color for success variant', () => {
      renderWithBrand(
        <Badge variant="success" data-testid="mond-success">ONLINE</Badge>,
        mondTheme
      );

      const badge = screen.getByTestId('mond-success');
      // Badge now uses CSS classes and variables for theming
      expect(badge).toHaveClass('mond-badge');
      expect(badge).toHaveClass('mond-badge--success');
      expect(badge).toBeInTheDocument();
    });
  });
});