import React from 'react';
import { render, screen } from '../../test-utils';
import '@testing-library/jest-dom';
import { Box } from './Box';

describe('Box Component', () => {
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

  describe('spacing props', () => {
    it('applies padding props correctly with numeric values', () => {
      render(
        <Box
          pt={8}
          pr={12}
          pb={20}
          pl={14}
          data-testid="padding-box"
        >
          Content
        </Box>
      );
      const boxElement = screen.getByTestId('padding-box');

      // Individual sides should be applied as pixel values
      expect(boxElement).toHaveStyle('padding-top: 8px');
      expect(boxElement).toHaveStyle('padding-right: 12px');
      expect(boxElement).toHaveStyle('padding-bottom: 20px');
      expect(boxElement).toHaveStyle('padding-left: 14px');
    });

    it('applies margin props correctly with numeric values', () => {
      render(
        <Box
          m={16}
          mx={24}
          my={32}
          mt={8}
          mr={12}
          mb={20}
          ml={14}
          data-testid="margin-box"
        >
          Content
        </Box>
      );
      const boxElement = screen.getByTestId('margin-box');

      // Individual sides should override mx/my
      expect(boxElement).toHaveStyle('margin-top: 8px');
      expect(boxElement).toHaveStyle('margin-right: 12px');
      expect(boxElement).toHaveStyle('margin-bottom: 20px');
      expect(boxElement).toHaveStyle('margin-left: 14px');
    });

    it('handles string spacing values', () => {
      render(<Box p="1rem" m="2em" data-testid="string-spacing">Content</Box>);
      const boxElement = screen.getByTestId('string-spacing');
      expect(boxElement).toHaveStyle('padding: 1rem');
      expect(boxElement).toHaveStyle('margin: 2em');
    });

    describe('CSS Variable Integration - Spacing Tokens', () => {
      it('converts numeric spacing token keys to CSS variables', () => {
        render(<Box p="4" m="2" data-testid="token-spacing">Content</Box>);
        const boxElement = screen.getByTestId('token-spacing');

        // Should use CSS variables for spacing tokens
        expect(boxElement).toHaveStyle('padding: var(--mond-spacing-4)');
        expect(boxElement).toHaveStyle('margin: var(--mond-spacing-2)');
      });

      it('handles compound spacing props with tokens', () => {
        render(
          <Box
            px="4"
            py="2"
            data-testid="compound-spacing"
          >
            Content
          </Box>
        );
        const boxElement = screen.getByTestId('compound-spacing');

        expect(boxElement).toHaveStyle('padding-left: var(--mond-spacing-4)');
        expect(boxElement).toHaveStyle('padding-right: var(--mond-spacing-4)');
        expect(boxElement).toHaveStyle('padding-top: var(--mond-spacing-2)');
        expect(boxElement).toHaveStyle('padding-bottom: var(--mond-spacing-2)');
      });
    });
  });

  describe('color props', () => {
    it('applies background color with raw values', () => {
      render(<Box bg="#ff0000" data-testid="bg-box">Content</Box>);
      const boxElement = screen.getByTestId('bg-box');
      expect(boxElement).toHaveStyle('background-color: #ff0000');
    });

    it('applies text color with raw values', () => {
      render(<Box color="#00ff00" data-testid="color-box">Content</Box>);
      const boxElement = screen.getByTestId('color-box');
      expect(boxElement).toHaveStyle('color: #00ff00');
    });

    it('applies border color with raw values', () => {
      render(<Box borderColor="#0000ff" data-testid="border-color-box">Content</Box>);
      const boxElement = screen.getByTestId('border-color-box');
      expect(boxElement).toHaveStyle('border-color: #0000ff');
    });

    describe('CSS Variable Integration - Semantic Tokens', () => {
      it('converts semantic token paths to CSS variables for background', () => {
        render(
          <Box
            bg="surface.background"
            data-testid="semantic-bg-box"
          >
            Content
          </Box>
        );
        const boxElement = screen.getByTestId('semantic-bg-box');
        // Should use CSS variable instead of resolved value
        expect(boxElement).toHaveStyle('background-color: var(--mond-surface-background)');
      });

      it('converts semantic token paths to CSS variables for color', () => {
        render(
          <Box
            color="text.primary"
            data-testid="semantic-color-box"
          >
            Content
          </Box>
        );
        const boxElement = screen.getByTestId('semantic-color-box');
        expect(boxElement).toHaveStyle('color: var(--mond-text-primary)');
      });

      it('converts semantic token paths to CSS variables for border color', () => {
        render(
          <Box
            borderColor="border.default"
            data-testid="semantic-border-box"
          >
            Content
          </Box>
        );
        const boxElement = screen.getByTestId('semantic-border-box');
        expect(boxElement).toHaveStyle('border-color: var(--mond-border-default)');
      });

      it('handles multiple semantic tokens correctly', () => {
        render(
          <Box
            bg="surface.background"
            color="text.primary"
            borderColor="border.default"
            data-testid="multi-semantic-box"
          >
            Content
          </Box>
        );
        const boxElement = screen.getByTestId('multi-semantic-box');
        expect(boxElement).toHaveStyle('background-color: var(--mond-surface-background)');
        expect(boxElement).toHaveStyle('color: var(--mond-text-primary)');
        expect(boxElement).toHaveStyle('border-color: var(--mond-border-default)');
      });

      it('passes through non-semantic color values unchanged', () => {
        render(
          <Box
            bg="red"
            color="#00ff00"
            borderColor="rgb(0, 0, 255)"
            data-testid="direct-color-box"
          >
            Content
          </Box>
        );
        const boxElement = screen.getByTestId('direct-color-box');
        expect(boxElement).toHaveStyle('background-color: red');
        expect(boxElement).toHaveStyle('color: #00ff00');
        expect(boxElement).toHaveStyle('border-color: rgb(0, 0, 255)');
      });
    });
  });

  describe('layout props', () => {
    it('applies display property', () => {
      render(<Box display="flex" data-testid="flex-box">Content</Box>);
      const boxElement = screen.getByTestId('flex-box');
      expect(boxElement).toHaveStyle('display: flex');
    });

    it('applies position properties', () => {
      render(
        <Box
          position="absolute"
          top={10}
          right="20px"
          bottom={30}
          left="40px"
          zIndex={5}
          data-testid="position-box"
        >
          Content
        </Box>
      );
      const boxElement = screen.getByTestId('position-box');
      expect(boxElement).toHaveStyle('position: absolute');
      expect(boxElement).toHaveStyle('top: 10px');
      expect(boxElement).toHaveStyle('right: 20px');
      expect(boxElement).toHaveStyle('bottom: 30px');
      expect(boxElement).toHaveStyle('left: 40px');
      expect(boxElement).toHaveStyle('z-index: 5');
    });
  });

  describe('flexbox props', () => {
    it('applies flexbox properties', () => {
      render(
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="space-between"
          flex={1}
          data-testid="flexbox-box"
        >
          Content
        </Box>
      );
      const boxElement = screen.getByTestId('flexbox-box');
      expect(boxElement).toHaveStyle('display: flex');
      expect(boxElement).toHaveStyle('flex-direction: column');
      expect(boxElement).toHaveStyle('align-items: center');
      expect(boxElement).toHaveStyle('justify-content: space-between');
      expect(boxElement).toHaveStyle('flex: 1');
    });
  });

  describe('grid props', () => {
    it('applies grid properties', () => {
      render(
        <Box
          display="grid"
          gridTemplateColumns="1fr 1fr"
          gap={16}
          gridArea="header"
          data-testid="grid-box"
        >
          Content
        </Box>
      );
      const boxElement = screen.getByTestId('grid-box');
      expect(boxElement).toHaveStyle('display: grid');
      expect(boxElement).toHaveStyle('grid-template-columns: 1fr 1fr');
      expect(boxElement).toHaveStyle('gap: 16px');
      expect(boxElement).toHaveStyle('grid-area: header');
    });

    it('converts token gap values to CSS variables', () => {
      render(
        <Box
          display="grid"
          gap="4"
          rowGap="2"
          columnGap="6"
          data-testid="token-gap-box"
        >
          Content
        </Box>
      );
      const boxElement = screen.getByTestId('token-gap-box');
      expect(boxElement).toHaveStyle('gap: var(--mond-spacing-4)');
      expect(boxElement).toHaveStyle('row-gap: var(--mond-spacing-2)');
      expect(boxElement).toHaveStyle('column-gap: var(--mond-spacing-6)');
    });
  });

  describe('size props', () => {
    it('applies size properties', () => {
      render(
        <Box
          width={200}
          height="150px"
          minWidth={100}
          maxHeight="300px"
          data-testid="size-box"
        >
          Content
        </Box>
      );
      const boxElement = screen.getByTestId('size-box');
      expect(boxElement).toHaveStyle('width: 200px');
      expect(boxElement).toHaveStyle('height: 150px');
      expect(boxElement).toHaveStyle('min-width: 100px');
      expect(boxElement).toHaveStyle('max-height: 300px');
    });
  });

  describe('border props', () => {
    it('applies border properties', () => {
      render(
        <Box
          border="1px solid #000"
          borderRadius={8}
          borderWidth={2}
          borderStyle="dashed"
          data-testid="border-box"
        >
          Content
        </Box>
      );
      const boxElement = screen.getByTestId('border-box');
      expect(boxElement).toHaveStyle('border: 1px solid #000');
      expect(boxElement).toHaveStyle('border-radius: 8px');
      expect(boxElement).toHaveStyle('border-width: 2px');
      expect(boxElement).toHaveStyle('border-style: dashed');
    });

    it('applies individual border sides', () => {
      render(
        <Box
          borderTop="1px solid red"
          borderRight="2px dashed blue"
          borderBottom="3px dotted green"
          borderLeft="4px solid purple"
          data-testid="border-sides-box"
        >
          Content
        </Box>
      );
      const boxElement = screen.getByTestId('border-sides-box');
      expect(boxElement).toHaveStyle('border-top: 1px solid red');
      expect(boxElement).toHaveStyle('border-right: 2px dashed blue');
      expect(boxElement).toHaveStyle('border-bottom: 3px dotted green');
      expect(boxElement).toHaveStyle('border-left: 4px solid purple');
    });
  });

  describe('typography props', () => {
    it('applies typography properties', () => {
      render(
        <Box
          fontSize={16}
          fontWeight="bold"
          fontStyle="italic"
          lineHeight="1.5"
          letterSpacing="0.1em"
          textAlign="center"
          textTransform="uppercase"
          data-testid="typography-box"
        >
          Content
        </Box>
      );
      const boxElement = screen.getByTestId('typography-box');
      expect(boxElement).toHaveStyle('font-size: 16px');
      expect(boxElement).toHaveStyle('font-weight: bold');
      expect(boxElement).toHaveStyle('font-style: italic');
      expect(boxElement).toHaveStyle('line-height: 1.5');
      expect(boxElement).toHaveStyle('letter-spacing: 0.1em');
      expect(boxElement).toHaveStyle('text-align: center');
      expect(boxElement).toHaveStyle('text-transform: uppercase');
    });
  });

  describe('effect props', () => {
    it('applies effect properties', () => {
      render(
        <Box
          boxShadow="0 2px 4px rgba(0,0,0,0.1)"
          opacity={0.8}
          cursor="pointer"
          overflow="hidden"
          transition="all 0.3s ease"
          data-testid="effects-box"
        >
          Content
        </Box>
      );
      const boxElement = screen.getByTestId('effects-box');
      expect(boxElement).toHaveStyle('box-shadow: 0 2px 4px rgba(0,0,0,0.1)');
      expect(boxElement).toHaveStyle('opacity: 0.8');
      expect(boxElement).toHaveStyle('cursor: pointer');
      expect(boxElement).toHaveStyle('overflow: hidden');
      expect(boxElement).toHaveStyle('transition: all 0.3s ease');
    });
  });

  describe('SSR compatibility', () => {
    it('renders correctly without client-side hooks', () => {
      // Box should not depend on useTheme or any client-side hooks
      render(
        <Box
          bg="surface.background"
          color="text.primary"
          p="4"
          data-testid="ssr-box"
        >
          SSR Content
        </Box>
      );
      const boxElement = screen.getByTestId('ssr-box');
      expect(boxElement).toBeInTheDocument();
      expect(boxElement).toHaveTextContent('SSR Content');

      // Should use CSS variables (SSR-compatible)
      expect(boxElement).toHaveStyle('background-color: var(--mond-surface-background)');
      expect(boxElement).toHaveStyle('color: var(--mond-text-primary)');
      expect(boxElement).toHaveStyle('padding: var(--mond-spacing-4)');
    });

    it('does not require ThemeProvider context', () => {
      // Render without ThemeProvider wrapper
      const { getByTestId } = render(
        <Box
          bg="surface.background"
          p={4}
          data-testid="no-provider-box"
        >
          No Provider
        </Box>,
        { themeProviderProps: undefined } // Explicitly no provider
      );

      const boxElement = getByTestId('no-provider-box');
      expect(boxElement).toBeInTheDocument();
      // CSS variables should still be applied (they'll be defined in CSS)
      expect(boxElement).toHaveStyle('background-color: var(--mond-surface-background)');
    });
  });

  describe('accessibility', () => {
    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Box ref={ref}>Content</Box>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('supports custom props and event handlers', () => {
      const handleClick = jest.fn();
      render(
        <Box
          onClick={handleClick}
          role="button"
          aria-label="Custom box"
          data-testid="custom-box"
        >
          Content
        </Box>
      );

      const boxElement = screen.getByTestId('custom-box');
      expect(boxElement).toHaveAttribute('role', 'button');
      expect(boxElement).toHaveAttribute('aria-label', 'Custom box');

      boxElement.click();
      expect(handleClick).toHaveBeenCalled();
    });

    it('applies custom className', () => {
      render(<Box className="custom-class" data-testid="class-box">Content</Box>);
      const boxElement = screen.getByTestId('class-box');
      expect(boxElement).toHaveClass('custom-class');
    });
  });

  describe('edge cases', () => {
    it('handles zero values correctly', () => {
      render(
        <Box
          p={0}
          m={0}
          width={0}
          height={0}
          opacity={0}
          data-testid="zero-box"
        >
          Content
        </Box>
      );
      const boxElement = screen.getByTestId('zero-box');
      expect(boxElement).toHaveStyle('padding: 0px');
      expect(boxElement).toHaveStyle('margin: 0px');
      expect(boxElement).toHaveStyle('width: 0px');
      expect(boxElement).toHaveStyle('height: 0px');
      expect(boxElement).toHaveStyle('opacity: 0');
    });

    it('renders without any props', () => {
      render(<Box data-testid="minimal-box">Minimal</Box>);
      const boxElement = screen.getByTestId('minimal-box');
      expect(boxElement).toBeInTheDocument();
      expect(boxElement).toHaveTextContent('Minimal');
    });

    it('renders with empty content', () => {
      render(<Box data-testid="empty-box" />);
      const boxElement = screen.getByTestId('empty-box');
      expect(boxElement).toBeInTheDocument();
    });
  });

  describe('responsive and complex values', () => {
    it('handles percentage values', () => {
      render(<Box width="50%" height="100%" data-testid="percentage-box">Content</Box>);
      const boxElement = screen.getByTestId('percentage-box');
      expect(boxElement).toHaveStyle('width: 50%');
      expect(boxElement).toHaveStyle('height: 100%');
    });

    it('handles CSS custom properties', () => {
      render(<Box color="var(--custom-color)" data-testid="custom-prop-box">Content</Box>);
      const boxElement = screen.getByTestId('custom-prop-box');
      expect(boxElement).toHaveStyle('color: var(--custom-color)');
    });
  });

  describe('Token value resolution logic', () => {
    it('correctly identifies and converts token paths with dots', () => {
      render(
        <Box
          bg="interactive.primary.background"
          color="text.secondary"
          data-testid="dotted-paths"
        >
          Content
        </Box>
      );
      const boxElement = screen.getByTestId('dotted-paths');
      expect(boxElement).toHaveStyle('background-color: var(--mond-interactive-primary-background)');
      expect(boxElement).toHaveStyle('color: var(--mond-text-secondary)');
    });

    it('correctly differentiates between token keys and raw values', () => {
      render(
        <Box
          p="4"        // Token key -> CSS variable
          m="10px"     // Raw value -> Direct value
          width="50%"  // Raw value -> Direct value
          data-testid="mixed-values"
        >
          Content
        </Box>
      );
      const boxElement = screen.getByTestId('mixed-values');
      expect(boxElement).toHaveStyle('padding: var(--mond-spacing-4)');
      expect(boxElement).toHaveStyle('margin: 10px');
      expect(boxElement).toHaveStyle('width: 50%');
    });
  });
});
