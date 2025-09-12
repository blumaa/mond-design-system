import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from '../components/providers/ThemeProvider';
import { Grid, Stack, Box, Card } from '../components';
import { cypherTheme, fluxTheme, mondTheme } from '../brands';
import type { BrandTheme } from '../components/providers/ThemeProvider';

// Test helper to render with different brand themes
const renderWithTheme = (component: React.ReactElement, brandTheme: BrandTheme) => {
  return render(
    <ThemeProvider brandTheme={brandTheme} colorScheme="dark">
      {component}
    </ThemeProvider>
  );
};

describe('Layout Components with Brand Themes', () => {
  describe('Box Component', () => {
    it('should render with brand themes', () => {
      const { getByTestId } = renderWithTheme(
        <Box data-testid="box">
          Content
        </Box>,
        cypherTheme
      );
      
      expect(getByTestId('box')).toBeInTheDocument();
    });
  });

  describe('Stack Component', () => {
    it('should render with brand themes', () => {
      const { getByTestId } = renderWithTheme(
        <Stack data-testid="stack">
          <div>Item 1</div>
          <div>Item 2</div>
        </Stack>,
        mondTheme
      );
      
      expect(getByTestId('stack')).toBeInTheDocument();
    });
  });

  describe('Grid Component', () => {
    it('should render with brand themes', () => {
      const { getByTestId } = renderWithTheme(
        <Grid data-testid="grid">
          <div>Grid Item 1</div>
          <div>Grid Item 2</div>
        </Grid>,
        fluxTheme
      );
      
      expect(getByTestId('grid')).toBeInTheDocument();
    });
  });

  describe('Card Component', () => {
    it('should render with brand themes', () => {
      const { getByTestId } = renderWithTheme(
        <Card data-testid="card">
          Card Content
        </Card>,
        cypherTheme
      );
      
      expect(getByTestId('card')).toBeInTheDocument();
    });
  });

  describe('Brand Theme Independence', () => {
    it('should render layout components with MOND theme', () => {
      const TestLayout = () => (
        <Box data-testid="mond-box">
          <Stack data-testid="mond-stack">
            <Card data-testid="mond-card">Card in Stack</Card>
            <Grid data-testid="mond-grid">
              <div>Grid Item</div>
            </Grid>
          </Stack>
        </Box>
      );

      const { getByTestId } = renderWithTheme(<TestLayout />, mondTheme);
      expect(getByTestId('mond-box')).toBeInTheDocument();
      expect(getByTestId('mond-stack')).toBeInTheDocument();
      expect(getByTestId('mond-card')).toBeInTheDocument();
      expect(getByTestId('mond-grid')).toBeInTheDocument();
    });

    it('should render layout components with CYPHER theme', () => {
      const TestLayout = () => (
        <Box data-testid="cypher-box">
          <Stack data-testid="cypher-stack">
            <Card data-testid="cypher-card">Card in Stack</Card>
            <Grid data-testid="cypher-grid">
              <div>Grid Item</div>
            </Grid>
          </Stack>
        </Box>
      );

      const { getByTestId } = renderWithTheme(<TestLayout />, cypherTheme);
      expect(getByTestId('cypher-box')).toBeInTheDocument();
      expect(getByTestId('cypher-stack')).toBeInTheDocument();
      expect(getByTestId('cypher-card')).toBeInTheDocument();
      expect(getByTestId('cypher-grid')).toBeInTheDocument();
    });

    it('should render layout components with FLUX theme', () => {
      const TestLayout = () => (
        <Box data-testid="flux-box">
          <Stack data-testid="flux-stack">
            <Card data-testid="flux-card">Card in Stack</Card>
            <Grid data-testid="flux-grid">
              <div>Grid Item</div>
            </Grid>
          </Stack>
        </Box>
      );

      const { getByTestId } = renderWithTheme(<TestLayout />, fluxTheme);
      expect(getByTestId('flux-box')).toBeInTheDocument();
      expect(getByTestId('flux-stack')).toBeInTheDocument();
      expect(getByTestId('flux-card')).toBeInTheDocument();
      expect(getByTestId('flux-grid')).toBeInTheDocument();
    });
  });
});