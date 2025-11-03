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
          paddingTop={8}
          paddingRight={12}
          paddingBottom={20}
          paddingLeft={14}
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
          marginTop={8}
          marginRight={12}
          marginBottom={20}
          marginLeft={14}
          data-testid="margin-box"
        >
          Content
        </Box>
      );
      const boxElement = screen.getByTestId('margin-box');

      // Individual sides should be applied as pixel values
      expect(boxElement).toHaveStyle('margin-top: 8px');
      expect(boxElement).toHaveStyle('margin-right: 12px');
      expect(boxElement).toHaveStyle('margin-bottom: 20px');
      expect(boxElement).toHaveStyle('margin-left: 14px');
    });

    it('handles string spacing values', () => {
      render(<Box padding="1rem" margin="2em" data-testid="string-spacing">Content</Box>);
      const boxElement = screen.getByTestId('string-spacing');
      expect(boxElement).toHaveStyle('padding: 1rem');
      expect(boxElement).toHaveStyle('margin: 2em');
    });

    describe('Theme Token Resolution - Spacing Tokens', () => {
      it('resolves numeric spacing token keys to theme values', () => {
        render(<Box padding="4" margin="2" data-testid="token-spacing">Content</Box>);
        const boxElement = screen.getByTestId('token-spacing');

        // Should resolve to theme.space values
        expect(boxElement).toHaveStyle('padding: 1rem');
        expect(boxElement).toHaveStyle('margin: 0.5rem');
      });

      it('handles individual spacing props with tokens', () => {
        render(
          <Box
            paddingLeft="4"
            paddingRight="4"
            paddingTop="2"
            paddingBottom="2"
            data-testid="individual-spacing"
          >
            Content
          </Box>
        );
        const boxElement = screen.getByTestId('individual-spacing');

        expect(boxElement).toHaveStyle('padding-left: 1rem');
        expect(boxElement).toHaveStyle('padding-right: 1rem');
        expect(boxElement).toHaveStyle('padding-top: 0.5rem');
        expect(boxElement).toHaveStyle('padding-bottom: 0.5rem');
      });
    });
  });

  describe('color props', () => {
    it('applies background color with raw values', () => {
      render(<Box backgroundColor="#ff0000" data-testid="bg-box">Content</Box>);
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

    describe('Theme Token Resolution - Color Tokens', () => {
      it('resolves color token keys to theme values for background', () => {
        render(
          <Box
            backgroundColor="brandPrimary600"
            data-testid="token-bg-box"
          >
            Content
          </Box>
        );
        const boxElement = screen.getByTestId('token-bg-box');
        // Should resolve to theme.colors.brandPrimary600 (rendered as rgb in jsdom)
        expect(boxElement).toHaveStyle('background-color: rgb(2, 132, 199)');
      });

      it('resolves color token keys to theme values for color', () => {
        render(
          <Box
            color="brandPrimary600"
            data-testid="token-color-box"
          >
            Content
          </Box>
        );
        const boxElement = screen.getByTestId('token-color-box');
        expect(boxElement).toHaveStyle('color: rgb(2, 132, 199)');
      });

      it('resolves color token keys to theme values for border color', () => {
        render(
          <Box
            borderColor="brandPrimary700"
            data-testid="token-border-box"
          >
            Content
          </Box>
        );
        const boxElement = screen.getByTestId('token-border-box');
        expect(boxElement).toHaveStyle('border-color: #0369a1');
      });

      it('handles multiple color tokens correctly', () => {
        render(
          <Box
            backgroundColor="brandPrimary600"
            color="textPrimary"
            borderColor="brandPrimary700"
            data-testid="multi-token-box"
          >
            Content
          </Box>
        );
        const boxElement = screen.getByTestId('multi-token-box');
        expect(boxElement).toHaveStyle('background-color: rgb(2, 132, 199)');
        expect(boxElement).toHaveStyle('color: rgb(65, 74, 76)');
        expect(boxElement).toHaveStyle('border-color: #0369a1');
      });

      it('passes through non-token color values unchanged', () => {
        render(
          <Box
            backgroundColor="red"
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

    it('resolves token gap values to theme values', () => {
      render(
        <Box
          display="grid"
          gap="4"
          data-testid="token-gap-box"
        >
          Content
        </Box>
      );
      const boxElement = screen.getByTestId('token-gap-box');
      expect(boxElement).toHaveStyle('gap: 1rem');
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
      expect(boxElement).toHaveStyle('font-weight: 700'); // 'bold' resolves to 700
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

  describe('Theme integration', () => {
    it('renders correctly with theme tokens', () => {
      render(
        <Box
          backgroundColor="brandPrimary600"
          color="textPrimary"
          padding="4"
          data-testid="theme-box"
        >
          Theme Content
        </Box>
      );
      const boxElement = screen.getByTestId('theme-box');
      expect(boxElement).toBeInTheDocument();
      expect(boxElement).toHaveTextContent('Theme Content');

      // Should resolve theme tokens (colors rendered as rgb in jsdom)
      expect(boxElement).toHaveStyle('background-color: rgb(2, 132, 199)');
      expect(boxElement).toHaveStyle('color: rgb(65, 74, 76)');
      expect(boxElement).toHaveStyle('padding: 1rem');
    });

    it('works with ThemeProvider from test-utils', () => {
      const { getByTestId } = render(
        <Box
          backgroundColor="brandPrimary600"
          padding={4}
          data-testid="provider-box"
        >
          With Provider
        </Box>
      );

      const boxElement = getByTestId('provider-box');
      expect(boxElement).toBeInTheDocument();
      expect(boxElement).toHaveStyle('background-color: rgb(2, 132, 199)');
      expect(boxElement).toHaveStyle('padding: 4px');
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
          padding={0}
          margin={0}
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
    it('resolves color token keys to theme values', () => {
      render(
        <Box
          backgroundColor="brandPrimary600"
          color="textSecondary"
          data-testid="color-tokens"
        >
          Content
        </Box>
      );
      const boxElement = screen.getByTestId('color-tokens');
      expect(boxElement).toHaveStyle('background-color: rgb(2, 132, 199)');
      expect(boxElement).toHaveStyle('color: rgb(100, 116, 139)');
    });

    it('correctly differentiates between token keys and raw values', () => {
      render(
        <Box
          padding="4"      // Token key -> theme.space['4']
          margin="10px"    // Raw value -> Direct value
          width="50%"      // Raw value -> Direct value
          data-testid="mixed-values"
        >
          Content
        </Box>
      );
      const boxElement = screen.getByTestId('mixed-values');
      expect(boxElement).toHaveStyle('padding: 1rem');
      expect(boxElement).toHaveStyle('margin: 10px');
      expect(boxElement).toHaveStyle('width: 50%');
    });
  });
});
