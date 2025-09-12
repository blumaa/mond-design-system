import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from '../components/providers/ThemeProvider';
import { Container, Grid, Stack, Surface, Fullscreen } from '../components';
import { cypherTheme, fluxTheme, mondTheme } from '../brands';

// Test helper to render with different brand themes
const renderWithTheme = (component: React.ReactElement, brandTheme: any) => {
  return render(
    <ThemeProvider brandTheme={brandTheme} colorScheme="dark">
      {component}
    </ThemeProvider>
  );
};

describe('Layout Components with Brand Themes', () => {
  describe('Container Component', () => {
    it('should render with semantic layout tokens', () => {
      const { container } = renderWithTheme(
        <Container variant="lg" data-testid="container">
          Content
        </Container>,
        cypherTheme
      );
      
      const containerElement = container.querySelector('[data-testid="container"]');
      expect(containerElement).toHaveStyle('max-width: 1024px');
      expect(containerElement).toHaveStyle('margin: 0 auto');
      expect(containerElement).toHaveStyle('padding: 0 2rem');
    });
    
    it('should work with different variants', () => {
      const { container } = renderWithTheme(
        <Container variant="sm" data-testid="container-sm">
          Content
        </Container>,
        mondTheme
      );
      
      const containerElement = container.querySelector('[data-testid="container-sm"]');
      expect(containerElement).toHaveStyle('max-width: 640px');
      expect(containerElement).toHaveStyle('padding: 0 1rem');
    });
  });
  
  describe('Grid Component', () => {
    it('should render with semantic grid tokens', () => {
      const { container } = renderWithTheme(
        <Grid variant="dashboard" data-testid="grid">
          <div>Item 1</div>
          <div>Item 2</div>
        </Grid>,
        cypherTheme
      );
      
      const gridElement = container.querySelector('[data-testid="grid"]');
      expect(gridElement).toHaveStyle('display: grid');
      expect(gridElement).toHaveStyle('grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))');
      expect(gridElement).toHaveStyle('gap: 1.5rem');
    });
  });
  
  describe('Stack Component', () => {
    it('should render with semantic stack tokens', () => {
      const { container } = renderWithTheme(
        <Stack variant="lg" data-testid="stack">
          <div>Item 1</div>
          <div>Item 2</div>
        </Stack>,
        fluxTheme
      );
      
      const stackElement = container.querySelector('[data-testid="stack"]');
      expect(stackElement).toHaveStyle('display: flex');
      expect(stackElement).toHaveStyle('flex-direction: column');
      expect(stackElement).toHaveStyle('gap: 24px'); // 1.5rem = 24px
    });
  });
  
  describe('Surface Component', () => {
    it('should render with semantic surface tokens', () => {
      const { container } = renderWithTheme(
        <Surface variant="elevated" data-testid="surface">
          Content
        </Surface>,
        cypherTheme
      );
      
      const surfaceElement = container.querySelector('[data-testid="surface"]');
      expect(surfaceElement).toBeInTheDocument();
      // Surface background color should be resolved from theme
    });
    
    it('should render gradients with brand adaptation', () => {
      const { container } = renderWithTheme(
        <Surface variant="gradient-primary" data-testid="gradient-surface">
          Content
        </Surface>,
        cypherTheme
      );
      
      const surfaceElement = container.querySelector('[data-testid="gradient-surface"]');
      expect(surfaceElement).toBeInTheDocument();
      // Gradient should be brand-adapted (contains brand colors)
    });
  });
  
  describe('Fullscreen Component', () => {
    it('should render with fullscreen layout tokens', () => {
      const { container } = renderWithTheme(
        <Fullscreen variant="default" data-testid="fullscreen">
          Content
        </Fullscreen>,
        mondTheme
      );
      
      const fullscreenElement = container.querySelector('[data-testid="fullscreen"]');
      expect(fullscreenElement).toHaveStyle('min-height: 100vh');
      expect(fullscreenElement).toHaveStyle('width: 100%');
    });
  });
});

describe('Brand Theme Independence', () => {
  it('should render same semantic layout across different brands', () => {
    const TestLayout = () => (
      <Container variant="lg">
        <Stack variant="md">
          <Grid variant="cards">
            <Surface variant="elevated">Card 1</Surface>
            <Surface variant="elevated">Card 2</Surface>
          </Grid>
        </Stack>
      </Container>
    );
    
    // Test with CYPHER theme
    const { container: cypherContainer } = renderWithTheme(<TestLayout />, cypherTheme);
    const cypherGrid = cypherContainer.querySelector('div[style*="grid"]');
    
    // Test with FLUX theme  
    const { container: fluxContainer } = renderWithTheme(<TestLayout />, fluxTheme);
    const fluxGrid = fluxContainer.querySelector('div[style*="grid"]');
    
    // Test with MOND theme
    const { container: mondContainer } = renderWithTheme(<TestLayout />, mondTheme);
    const mondGrid = mondContainer.querySelector('div[style*="grid"]');
    
    // All should have the same grid layout (semantic consistency)
    expect(cypherGrid).toHaveStyle('grid-template-columns: repeat(auto-fill, minmax(250px, 1fr))');
    expect(fluxGrid).toHaveStyle('grid-template-columns: repeat(auto-fill, minmax(250px, 1fr))');
    expect(mondGrid).toHaveStyle('grid-template-columns: repeat(auto-fill, minmax(250px, 1fr))');
    
    // But surfaces might have different background colors (brand adaptation)
    // This is the key - layout is consistent, styling adapts to brand
  });
});