import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from '../components/providers/ThemeProvider';
import { Text } from '../components';
import { brand1Theme, brand2Theme, mondTheme } from '../brands';
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
    it('should render display variant with correct CSS classes', () => {
      const { container } = renderWithTheme(
        <Text variant="display" data-testid="display-text">
          Display Text
        </Text>,
        brand1Theme
      );

      const textElement = container.querySelector('[data-testid="display-text"]');
      expect(textElement).toHaveClass('mond-text--display');
      expect(textElement).toHaveClass('mond-text--primary');
      expect(textElement).toHaveClass('mond-text--weight-normal');
    });

    it('should render headline variant with correct CSS classes', () => {
      const { container } = renderWithTheme(
        <Text variant="headline" data-testid="headline-text">
          Headline Text
        </Text>,
        brand2Theme
      );

      const textElement = container.querySelector('[data-testid="headline-text"]');
      expect(textElement).toHaveClass('mond-text--headline');
      expect(textElement).toHaveClass('mond-text--primary');
      expect(textElement).toHaveClass('mond-text--weight-normal');
    });

    it('should render title variant with correct CSS classes', () => {
      const { container } = renderWithTheme(
        <Text variant="title" data-testid="title-text">
          Title Text
        </Text>,
        mondTheme
      );

      const textElement = container.querySelector('[data-testid="title-text"]');
      expect(textElement).toHaveClass('mond-text--title');
      expect(textElement).toHaveClass('mond-text--primary');
      expect(textElement).toHaveClass('mond-text--weight-normal');
    });

    it('should render body variant with correct CSS classes', () => {
      const { container } = renderWithTheme(
        <Text variant="body" data-testid="body-text">
          Body Text
        </Text>,
        brand1Theme
      );

      const textElement = container.querySelector('[data-testid="body-text"]');
      expect(textElement).toHaveClass('mond-text--body');
      expect(textElement).toHaveClass('mond-text--primary');
      expect(textElement).toHaveClass('mond-text--weight-normal');
    });

    it('should render code variant with correct CSS classes', () => {
      const { container } = renderWithTheme(
        <Text variant="code" data-testid="code-text">
          const code = true;
        </Text>,
        brand1Theme
      );

      const textElement = container.querySelector('[data-testid="code-text"]');
      expect(textElement).toHaveClass('mond-text--code');
      expect(textElement).toHaveClass('mond-text--primary');
      expect(textElement).toHaveClass('mond-text--weight-normal');
    });

    it('should render overline variant with correct CSS classes', () => {
      const { container } = renderWithTheme(
        <Text variant="overline" data-testid="overline-text">
          Overline Text
        </Text>,
        brand2Theme
      );

      const textElement = container.querySelector('[data-testid="overline-text"]');
      expect(textElement).toHaveClass('mond-text--overline');
      expect(textElement).toHaveClass('mond-text--primary');
      expect(textElement).toHaveClass('mond-text--weight-normal');
    });
  });

  describe('Typography Brand Independence', () => {
    it('should render same typography hierarchy across different brands', () => {
      const TestTypography = () => (
        <>
          <Text variant="headline" data-testid="headline">Headline</Text>
          <Text variant="body" data-testid="body">Body text</Text>
          <Text variant="caption" data-testid="caption">Caption</Text>
        </>
      );

      // Test with different brands - typography CSS classes should be consistent
      const { container: brand1Container } = renderWithTheme(<TestTypography />, brand1Theme);
      const { container: brand2Container } = renderWithTheme(<TestTypography />, brand2Theme);
      const { container: mondContainer } = renderWithTheme(<TestTypography />, mondTheme);

      // All headlines should have same CSS classes (consistent typography hierarchy)
      const brand1Headline = brand1Container.querySelector('[data-testid="headline"]');
      const brand2Headline = brand2Container.querySelector('[data-testid="headline"]');
      const mondHeadline = mondContainer.querySelector('[data-testid="headline"]');

      expect(brand1Headline).toHaveClass('mond-text--headline');
      expect(brand2Headline).toHaveClass('mond-text--headline');
      expect(mondHeadline).toHaveClass('mond-text--headline');

      // Body text should be consistent across brands
      const brand1Body = brand1Container.querySelector('[data-testid="body"]');
      const brand2Body = brand2Container.querySelector('[data-testid="body"]');
      const mondBody = mondContainer.querySelector('[data-testid="body"]');

      expect(brand1Body).toHaveClass('mond-text--body');
      expect(brand2Body).toHaveClass('mond-text--body');
      expect(mondBody).toHaveClass('mond-text--body');

      // Typography hierarchy is consistent via CSS classes
      // Colors are theme-dependent via CSS variables
    });
  });

  describe('Additional Typography Variants', () => {
    it('should render body-sm variant with correct CSS classes', () => {
      const { container } = renderWithTheme(
        <Text variant="body-sm" data-testid="body-sm">
          Small body text
        </Text>,
        brand1Theme
      );

      const bodySm = container.querySelector('[data-testid="body-sm"]');

      expect(bodySm).toHaveClass('mond-text--body-sm');
      expect(bodySm).toHaveClass('mond-text--primary');
      expect(bodySm).toHaveClass('mond-text--weight-normal');
    });

    it('should render subtitle variant with correct CSS classes', () => {
      const { container } = renderWithTheme(
        <Text variant="subtitle" data-testid="subtitle-text">
          Subtitle text
        </Text>,
        brand2Theme
      );

      const subtitleElement = container.querySelector('[data-testid="subtitle-text"]');

      expect(subtitleElement).toHaveClass('mond-text--subtitle');
      expect(subtitleElement).toHaveClass('mond-text--primary');
      expect(subtitleElement).toHaveClass('mond-text--weight-normal');
    });

    it('should render caption variant with correct CSS classes', () => {
      const { container } = renderWithTheme(
        <Text variant="caption" data-testid="caption-text">
          Caption text
        </Text>,
        mondTheme
      );

      const captionElement = container.querySelector('[data-testid="caption-text"]');

      expect(captionElement).toHaveClass('mond-text--caption');
      expect(captionElement).toHaveClass('mond-text--primary');
      expect(captionElement).toHaveClass('mond-text--weight-normal');
    });
  });
});