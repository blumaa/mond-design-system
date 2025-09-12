import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from '../components/providers/ThemeProvider';
import { Text } from '../components';
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

describe('Typography Components with Semantic Tokens', () => {
  describe('Text Component Typography Variants', () => {
    it('should render display variant with typography tokens', () => {
      const { container } = renderWithTheme(
        <Text variant="display" data-testid="display-text">
          Display Text
        </Text>,
        cypherTheme
      );
      
      const textElement = container.querySelector('[data-testid="display-text"]');
      expect(textElement).toHaveStyle('font-weight: 800');
      expect(textElement).toHaveStyle('line-height: 1.1');
      expect(textElement).toHaveStyle('letter-spacing: -0.02em');
      // fontSize uses clamp, so we just check it exists
      expect(textElement).toHaveAttribute('style');
    });

    it('should render headline variant with typography tokens', () => {
      const { container } = renderWithTheme(
        <Text variant="headline" data-testid="headline-text">
          Headline Text
        </Text>,
        fluxTheme
      );
      
      const textElement = container.querySelector('[data-testid="headline-text"]');
      expect(textElement).toHaveStyle('font-weight: 700');
      expect(textElement).toHaveStyle('line-height: 1.2');
      expect(textElement).toHaveStyle('letter-spacing: -0.01em');
    });

    it('should render title variant with typography tokens', () => {
      const { container } = renderWithTheme(
        <Text variant="title" data-testid="title-text">
          Title Text
        </Text>,
        mondTheme
      );
      
      const textElement = container.querySelector('[data-testid="title-text"]');
      expect(textElement).toHaveStyle('font-size: 1.5rem');
      expect(textElement).toHaveStyle('font-weight: 600');
      expect(textElement).toHaveStyle('line-height: 1.3');
    });

    it('should render body variant with typography tokens', () => {
      const { container } = renderWithTheme(
        <Text variant="body" data-testid="body-text">
          Body Text
        </Text>,
        cypherTheme
      );
      
      const textElement = container.querySelector('[data-testid="body-text"]');
      expect(textElement).toHaveStyle('font-size: 1rem');
      expect(textElement).toHaveStyle('font-weight: 400');
      expect(textElement).toHaveStyle('line-height: 1.5');
    });

    it('should render code variant with monospace font', () => {
      const { container } = renderWithTheme(
        <Text variant="code" data-testid="code-text">
          const code = true;
        </Text>,
        cypherTheme
      );
      
      const textElement = container.querySelector('[data-testid="code-text"]');
      expect(textElement).toHaveStyle('font-size: 0.875rem');
      expect(textElement).toHaveStyle('font-family: monospace');
      expect(textElement).toHaveStyle('line-height: 1.4');
    });

    it('should render overline variant with uppercase transform', () => {
      const { container } = renderWithTheme(
        <Text variant="overline" data-testid="overline-text">
          Overline Text
        </Text>,
        fluxTheme
      );
      
      const textElement = container.querySelector('[data-testid="overline-text"]');
      expect(textElement).toHaveStyle('font-size: 0.75rem');
      expect(textElement).toHaveStyle('text-transform: uppercase');
      expect(textElement).toHaveStyle('letter-spacing: 0.1em');
      expect(textElement).toHaveStyle('font-weight: 600');
    });
  });

  describe('Typography Brand Independence', () => {
    it('should render same typography hierarchy across different brands', () => {
      const TestTypography = () => (
        <>
          <Text variant="headline">Headline</Text>
          <Text variant="body">Body text</Text>
          <Text variant="caption">Caption</Text>
        </>
      );
      
      // Test with different brands - typography should be consistent
      const { container: cypherContainer } = renderWithTheme(<TestTypography />, cypherTheme);
      const { container: fluxContainer } = renderWithTheme(<TestTypography />, fluxTheme);
      const { container: mondContainer } = renderWithTheme(<TestTypography />, mondTheme);
      
      // All headlines should have same font size/weight (consistent typography hierarchy)
      const cypherHeadline = cypherContainer.querySelector('span');
      const fluxHeadline = fluxContainer.querySelector('span');
      const mondHeadline = mondContainer.querySelector('span');
      
      expect(cypherHeadline).toHaveStyle('font-weight: 700');
      expect(fluxHeadline).toHaveStyle('font-weight: 700');
      expect(mondHeadline).toHaveStyle('font-weight: 700');
      
      // Typography hierarchy is consistent, but colors might differ per brand
      // This demonstrates semantic consistency with brand-adaptive colors
    });
  });

  describe('Legacy Variant Support', () => {
    it('should support legacy body-lg and body-md variants', () => {
      const { container } = renderWithTheme(
        <>
          <Text variant="body-lg" data-testid="body-lg">Large body</Text>
          <Text variant="body-md" data-testid="body-md">Medium body</Text>
        </>,
        cypherTheme
      );
      
      const bodyLg = container.querySelector('[data-testid="body-lg"]');
      const bodyMd = container.querySelector('[data-testid="body-md"]');
      
      expect(bodyLg).toHaveStyle('font-size: 1.125rem');
      expect(bodyMd).toHaveStyle('font-size: 1rem');
    });
  });
});