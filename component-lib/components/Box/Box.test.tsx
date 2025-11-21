import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Box } from './Box';

describe('Box Component', () => {
  describe('Basic Rendering', () => {
    it('renders as div by default', () => {
      render(<Box data-testid="box">Content</Box>);
      const boxElement = screen.getByTestId('box');
      expect(boxElement).toBeInTheDocument();
      expect(boxElement.tagName).toBe('DIV');
      expect(boxElement).toHaveTextContent('Content');
    });

    it('renders as different element when as prop is provided', () => {
      render(<Box as="section" data-testid="section-box">Section content</Box>);
      const boxElement = screen.getByTestId('section-box');
      expect(boxElement.tagName).toBe('SECTION');
    });

    it('renders with empty content', () => {
      render(<Box data-testid="empty-box" />);
      const boxElement = screen.getByTestId('empty-box');
      expect(boxElement).toBeInTheDocument();
    });
  });

  describe('Spacing Props', () => {
    it('applies padding class correctly', () => {
      render(<Box padding="4" data-testid="padding-box">Content</Box>);
      const boxElement = screen.getByTestId('padding-box');
      expect(boxElement).toHaveClass('p-4');
    });

    it('applies margin class correctly', () => {
      render(<Box margin="4" data-testid="margin-box">Content</Box>);
      const boxElement = screen.getByTestId('margin-box');
      expect(boxElement).toHaveClass('m-4');
    });

    it('applies directional spacing classes', () => {
      render(
        <Box
          paddingTop="2"
          paddingRight="4"
          marginBottom="6"
          marginLeft="8"
          data-testid="directional-box"
        >
          Content
        </Box>
      );
      const boxElement = screen.getByTestId('directional-box');
      expect(boxElement).toHaveClass('pt-2', 'pr-4', 'mb-6', 'ml-8');
    });

    it('applies individual and shorthand spacing together', () => {
      render(
        <Box
          padding="4"
          paddingTop="8"
          data-testid="override-padding-box"
        >
          Content
        </Box>
      );
      const boxElement = screen.getByTestId('override-padding-box');
      // Both classes are applied - CSS handles the override
      expect(boxElement).toHaveClass('p-4', 'pt-8');
    });
  });

  describe('Border Props', () => {
    it('applies border classes correctly', () => {
      render(
        <Box
          border="default"
          corners="rounded-md"
          data-testid="border-box"
        >
          Content
        </Box>
      );
      const boxElement = screen.getByTestId('border-box');
      expect(boxElement).toHaveClass('mond-box--border-default', 'mond-box--corners-rounded-md');
    });
  });

  describe('Layout Props', () => {
    it('applies display class correctly', () => {
      render(<Box display="flex" data-testid="display-box">Content</Box>);
      const boxElement = screen.getByTestId('display-box');
      expect(boxElement).toHaveClass('display-flex');
    });

    it('applies flex properties', () => {
      render(
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          gap="md"
          data-testid="flex-box"
        >
          Content
        </Box>
      );
      const boxElement = screen.getByTestId('flex-box');
      expect(boxElement).toHaveClass(
        'display-flex',
        'flex-direction-row',
        'justify-content-center',
        'align-items-center',
        'gap-md'
      );
    });

    it('applies flex inline style', () => {
      render(
        <Box flex="1" data-testid="flex-style-box">
          Content
        </Box>
      );
      const boxElement = screen.getByTestId('flex-style-box');
      expect(boxElement).toHaveStyle({ flex: '1' });
    });
  });

  describe('className Prop', () => {
    it('applies custom className', () => {
      render(
        <Box className="custom-class" data-testid="custom-box">
          Content
        </Box>
      );
      const boxElement = screen.getByTestId('custom-box');
      expect(boxElement).toHaveClass('custom-class');
    });

    it('combines spacing classes with custom className', () => {
      render(
        <Box
          padding="4"
          margin="2"
          className="custom-class another-class"
          data-testid="combined-box"
        >
          Content
        </Box>
      );
      const boxElement = screen.getByTestId('combined-box');
      expect(boxElement).toHaveClass('p-4', 'm-2', 'custom-class', 'another-class');
    });
  });

  describe('Accessibility', () => {
    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Box ref={ref}>Content</Box>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current?.textContent).toBe('Content');
    });

    it('forwards ref with custom element type', () => {
      const ref = React.createRef<HTMLElement>();
      render(<Box as="section" ref={ref}>Content</Box>);
      expect(ref.current).toBeInstanceOf(HTMLElement);
      expect(ref.current?.tagName).toBe('SECTION');
    });

    it('supports custom props and event handlers', () => {
      const handleClick = jest.fn();
      render(
        <Box
          data-testid="interactive-box"
          onClick={handleClick}
          role="button"
          aria-label="Custom box"
        >
          Content
        </Box>
      );
      const boxElement = screen.getByTestId('interactive-box');
      boxElement.click();
      expect(handleClick).toHaveBeenCalledTimes(1);
      expect(boxElement).toHaveAttribute('role', 'button');
      expect(boxElement).toHaveAttribute('aria-label', 'Custom box');
    });
  });
});
