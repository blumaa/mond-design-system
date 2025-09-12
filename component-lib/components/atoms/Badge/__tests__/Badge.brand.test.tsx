import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Badge } from '../Badge';
import { ThemeProvider } from '../../../providers/ThemeProvider';
import { cypherTheme } from '../../../../brands';

// Helper to render Badge with brand context
const renderWithBrand = (component: React.ReactElement, brandTheme: any, colorScheme: 'light' | 'dark' = 'dark') => {
  return render(
    <ThemeProvider brandTheme={brandTheme} colorScheme={colorScheme}>
      {component}
    </ThemeProvider>
  );
};

describe('Badge Brand-Agnostic Behavior', () => {
  describe('CYPHER Brand', () => {
    it('should automatically get CYPHER styling for success variant', () => {
      renderWithBrand(
        <Badge variant="success" data-testid="cypher-success">ONLINE</Badge>,
        cypherTheme
      );
      
      const badge = screen.getByTestId('cypher-success');
      // In CYPHER brand, success should use brand primary (matrix green)
      expect(badge).toHaveStyle('background-color: #00ff94'); // CYPHER primary.500
      expect(badge).toHaveStyle('color: #000000'); // brand.interactive.text
    });
  });
});