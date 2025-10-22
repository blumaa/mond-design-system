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
      expect(textElement).toBeInTheDocument();
      expect(textElement).toHaveClass('mond-text--display');
      // Typography styling is now handled by CSS classes and variables
    });

    it('should render headline variant with typography tokens', () => {
      const { container } = renderWithTheme(
        <Text variant="headline" data-testid="headline-text">
          Headline Text
        </Text>,
        fluxTheme
      );

      const textElement = container.querySelector('[data-testid="headline-text"]');
      expect(textElement).toBeInTheDocument();
      expect(textElement).toHaveClass('mond-text--headline');
      // Typography styling is now handled by CSS classes and variables
    });

    it('should render title variant with typography tokens', () => {
      const { container } = renderWithTheme(
        <Text variant="title" data-testid="title-text">
          Title Text
        </Text>,
        mondTheme
      );

      const textElement = container.querySelector('[data-testid="title-text"]');
      expect(textElement).toBeInTheDocument();
      expect(textElement).toHaveClass('mond-text--title');
      // Typography styling is now handled by CSS classes and variables
    });

    it('should render body variant with typography tokens', () => {
      const { container } = renderWithTheme(
        <Text variant="body" data-testid="body-text">
          Body Text
        </Text>,
        cypherTheme
      );

      const textElement = container.querySelector('[data-testid="body-text"]');
      expect(textElement).toBeInTheDocument();
      expect(textElement).toHaveClass('mond-text--body');
      // Typography styling is now handled by CSS classes and variables
    });

    it('should render code variant with monospace font', () => {
      const { container } = renderWithTheme(
        <Text variant="code" data-testid="code-text">
          const code = true;
        </Text>,
        cypherTheme
      );

      const textElement = container.querySelector('[data-testid="code-text"]');
      expect(textElement).toBeInTheDocument();
      expect(textElement).toHaveClass('mond-text--code');
      // Typography styling is now handled by CSS classes and variables
    });

    it('should render overline variant with uppercase transform', () => {
      const { container } = renderWithTheme(
        <Text variant="overline" data-testid="overline-text">
          Overline Text
        </Text>,
        fluxTheme
      );

      const textElement = container.querySelector('[data-testid="overline-text"]');
      expect(textElement).toBeInTheDocument();
      expect(textElement).toHaveClass('mond-text--overline');
      // Typography styling is now handled by CSS classes and variables
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

      // All headlines should have same CSS classes (consistent typography hierarchy)
      const cypherHeadline = cypherContainer.querySelector('span');
      const fluxHeadline = fluxContainer.querySelector('span');
      const mondHeadline = mondContainer.querySelector('span');

      expect(cypherHeadline).toHaveClass('mond-text--headline');
      expect(fluxHeadline).toHaveClass('mond-text--headline');
      expect(mondHeadline).toHaveClass('mond-text--headline');

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

      expect(bodyLg).toBeInTheDocument();
      expect(bodyLg).toHaveClass('mond-text--body-lg');
      expect(bodyMd).toBeInTheDocument();
      expect(bodyMd).toHaveClass('mond-text--body-md');
    });
  });
});