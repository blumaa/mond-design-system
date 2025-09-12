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
  describe('Success variant shows green across all brands', () => {
    it('should show green success color in CYPHER brand', () => {
      renderWithBrand(
        <Badge variant="success" data-testid="cypher-success">ONLINE</Badge>,
        cypherTheme
      );
      
      const badge = screen.getByTestId('cypher-success');
      // CYPHER brand success.500 is bright neon green
      expect(badge).toHaveStyle('background-color: #00e085'); // CYPHER success.500
      expect(badge).toHaveStyle('color: #000000'); // feedback.success.text in dark mode
    });

    it('should show green success color in FLUX brand', () => {
      renderWithBrand(
        <Badge variant="success" data-testid="flux-success">ONLINE</Badge>,
        fluxTheme
      );
      
      const badge = screen.getByTestId('flux-success');
      // FLUX brand success.500 is standard green
      expect(badge).toHaveStyle('background-color: #22c55e'); // FLUX success.500
      expect(badge).toHaveStyle('color: #000000'); // feedback.success.text in dark mode
    });

    it('should show green success color in MOND brand', () => {
      renderWithBrand(
        <Badge variant="success" data-testid="mond-success">ONLINE</Badge>,
        mondTheme
      );
      
      const badge = screen.getByTestId('mond-success');
      // MOND brand success.500 is standard green
      expect(badge).toHaveStyle('background-color: #22c55e'); // MOND success.500
      expect(badge).toHaveStyle('color: #000000'); // feedback.success.text in dark mode
    });
  });
});