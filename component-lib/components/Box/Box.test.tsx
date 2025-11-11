import React from 'react';
import { render, screen } from '../../test-utils';
import '@testing-library/jest-dom';
import { Box } from './Box';

describe('Box Component - Minimal Design', () => {
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

    it('renders as article element', () => {
      render(<Box as="article" data-testid="article-box">Article content</Box>);
      const boxElement = screen.getByTestId('article-box');
      expect(boxElement.tagName).toBe('ARTICLE');
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

  describe('Spacing Props - CSS Class Mapping', () => {
    describe('Padding', () => {
      it('applies padding class correctly', () => {
        render(<Box padding="4" data-testid="padding-box">Content</Box>);
        const boxElement = screen.getByTestId('padding-box');
        expect(boxElement).toHaveClass('p-4');
      });

      it('applies paddingTop class correctly', () => {
        render(<Box paddingTop="2" data-testid="pt-box">Content</Box>);
        const boxElement = screen.getByTestId('pt-box');
        expect(boxElement).toHaveClass('pt-2');
      });

      it('applies paddingRight class correctly', () => {
        render(<Box paddingRight="6" data-testid="pr-box">Content</Box>);
        const boxElement = screen.getByTestId('pr-box');
        expect(boxElement).toHaveClass('pr-6');
      });

      it('applies paddingBottom class correctly', () => {
        render(<Box paddingBottom="8" data-testid="pb-box">Content</Box>);
        const boxElement = screen.getByTestId('pb-box');
        expect(boxElement).toHaveClass('pb-8');
      });

      it('applies paddingLeft class correctly', () => {
        render(<Box paddingLeft="10" data-testid="pl-box">Content</Box>);
        const boxElement = screen.getByTestId('pl-box');
        expect(boxElement).toHaveClass('pl-10');
      });

      it('applies multiple padding classes correctly', () => {
        render(
          <Box
            paddingTop="2"
            paddingRight="4"
            paddingBottom="6"
            paddingLeft="8"
            data-testid="multi-padding-box"
          >
            Content
          </Box>
        );
        const boxElement = screen.getByTestId('multi-padding-box');
        expect(boxElement).toHaveClass('pt-2', 'pr-4', 'pb-6', 'pl-8');
      });

      it('individual padding props override padding prop', () => {
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
        expect(boxElement).toHaveClass('p-4', 'pt-8');
      });
    });

    describe('Margin', () => {
      it('applies margin class correctly', () => {
        render(<Box margin="4" data-testid="margin-box">Content</Box>);
        const boxElement = screen.getByTestId('margin-box');
        expect(boxElement).toHaveClass('m-4');
      });

      it('applies marginTop class correctly', () => {
        render(<Box marginTop="2" data-testid="mt-box">Content</Box>);
        const boxElement = screen.getByTestId('mt-box');
        expect(boxElement).toHaveClass('mt-2');
      });

      it('applies marginRight class correctly', () => {
        render(<Box marginRight="6" data-testid="mr-box">Content</Box>);
        const boxElement = screen.getByTestId('mr-box');
        expect(boxElement).toHaveClass('mr-6');
      });

      it('applies marginBottom class correctly', () => {
        render(<Box marginBottom="8" data-testid="mb-box">Content</Box>);
        const boxElement = screen.getByTestId('mb-box');
        expect(boxElement).toHaveClass('mb-8');
      });

      it('applies marginLeft class correctly', () => {
        render(<Box marginLeft="10" data-testid="ml-box">Content</Box>);
        const boxElement = screen.getByTestId('ml-box');
        expect(boxElement).toHaveClass('ml-10');
      });

      it('applies multiple margin classes correctly', () => {
        render(
          <Box
            marginTop="2"
            marginRight="4"
            marginBottom="6"
            marginLeft="8"
            data-testid="multi-margin-box"
          >
            Content
          </Box>
        );
        const boxElement = screen.getByTestId('multi-margin-box');
        expect(boxElement).toHaveClass('mt-2', 'mr-4', 'mb-6', 'ml-8');
      });

      it('individual margin props override margin prop', () => {
        render(
          <Box
            margin="4"
            marginTop="8"
            data-testid="override-margin-box"
          >
            Content
          </Box>
        );
        const boxElement = screen.getByTestId('override-margin-box');
        expect(boxElement).toHaveClass('m-4', 'mt-8');
      });
    });

    describe('Combined Spacing', () => {
      it('applies both margin and padding classes correctly', () => {
        render(
          <Box
            margin="8"
            padding="4"
            data-testid="combined-box"
          >
            Content
          </Box>
        );
        const boxElement = screen.getByTestId('combined-box');
        expect(boxElement).toHaveClass('m-8', 'p-4');
      });

      it('applies complex spacing combination', () => {
        render(
          <Box
            marginTop="2"
            paddingLeft="6"
            paddingRight="4"
            marginBottom="8"
            data-testid="complex-spacing-box"
          >
            Content
          </Box>
        );
        const boxElement = screen.getByTestId('complex-spacing-box');
        expect(boxElement).toHaveClass('mt-2', 'pl-6', 'pr-4', 'mb-8');
      });
    });

    describe('All Spacing Token Values', () => {
      const spacingTokens = ['0', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16', '20', '24', '32', '40', '48', '56', '64'] as const;

      spacingTokens.forEach((token) => {
        it(`applies padding="${token}" as p-${token} class`, () => {
          render(<Box padding={token} data-testid={`p-${token}-box`}>Content</Box>);
          const boxElement = screen.getByTestId(`p-${token}-box`);
          expect(boxElement).toHaveClass(`p-${token}`);
        });

        it(`applies margin="${token}" as m-${token} class`, () => {
          render(<Box margin={token} data-testid={`m-${token}-box`}>Content</Box>);
          const boxElement = screen.getByTestId(`m-${token}-box`);
          expect(boxElement).toHaveClass(`m-${token}`);
        });
      });
    });
  });

  describe('TypeScript Type Safety', () => {
    it('accepts valid spacing token for padding', () => {
      // This test ensures TypeScript compilation succeeds with valid tokens
      render(<Box padding="4" data-testid="valid-padding">Content</Box>);
      expect(screen.getByTestId('valid-padding')).toBeInTheDocument();
    });

    it('accepts valid spacing token for margin', () => {
      // This test ensures TypeScript compilation succeeds with valid tokens
      render(<Box margin="8" data-testid="valid-margin">Content</Box>);
      expect(screen.getByTestId('valid-margin')).toBeInTheDocument();
    });

    it('accepts all valid spacing tokens', () => {
      // This test ensures TypeScript compilation succeeds with all valid tokens
      render(
        <Box
          padding="0"
          margin="1"
          paddingTop="2"
          marginRight="3"
          paddingBottom="64"
          marginLeft="56"
          data-testid="all-valid"
        >
          Content
        </Box>
      );
      expect(screen.getByTestId('all-valid')).toBeInTheDocument();
    });
  });

  describe('className Prop', () => {
    it('applies custom className', () => {
      render(<Box className="custom-class" data-testid="class-box">Content</Box>);
      const boxElement = screen.getByTestId('class-box');
      expect(boxElement).toHaveClass('custom-class');
    });

    it('combines spacing classes with custom className', () => {
      render(
        <Box
          padding="4"
          margin="2"
          className="custom-class"
          data-testid="combined-class-box"
        >
          Content
        </Box>
      );
      const boxElement = screen.getByTestId('combined-class-box');
      expect(boxElement).toHaveClass('p-4', 'm-2', 'custom-class');
    });

    it('handles multiple custom classes', () => {
      render(
        <Box
          className="custom-1 custom-2 custom-3"
          data-testid="multi-class-box"
        >
          Content
        </Box>
      );
      const boxElement = screen.getByTestId('multi-class-box');
      expect(boxElement).toHaveClass('custom-1', 'custom-2', 'custom-3');
    });
  });

  describe('SSR Compatibility', () => {
    it('renders correctly without client-side hooks', () => {
      // Box should not depend on useTheme or any client-side hooks
      render(
        <Box
          padding="4"
          margin="2"
          data-testid="ssr-box"
        >
          SSR Content
        </Box>
      );
      const boxElement = screen.getByTestId('ssr-box');
      expect(boxElement).toBeInTheDocument();
      expect(boxElement).toHaveTextContent('SSR Content');
      expect(boxElement).toHaveClass('p-4', 'm-2');
    });

    it('does not require ThemeProvider context', () => {
      // Render without ThemeProvider wrapper
      const { getByTestId } = render(
        <Box
          padding="4"
          margin="2"
          data-testid="no-provider-box"
        >
          No Provider
        </Box>,
        { themeProviderProps: undefined }
      );

      const boxElement = getByTestId('no-provider-box');
      expect(boxElement).toBeInTheDocument();
      expect(boxElement).toHaveClass('p-4', 'm-2');
    });

    it('uses pure CSS classes without inline styles', () => {
      render(
        <Box
          padding="4"
          margin="8"
          data-testid="no-inline-styles"
        >
          Content
        </Box>
      );
      const boxElement = screen.getByTestId('no-inline-styles');

      // Should only have classes, no style attribute (or empty style)
      const styleAttr = boxElement.getAttribute('style');
      expect(styleAttr).toBeNull();
    });
  });

  describe('Theme Compatibility', () => {
    it('works with light theme (CSS variables handle theme switching)', () => {
      render(
        <div data-theme="light">
          <Box padding="4" data-testid="light-theme-box">Light theme content</Box>
        </div>
      );
      const boxElement = screen.getByTestId('light-theme-box');
      expect(boxElement).toHaveClass('p-4');
    });

    it('works with dark theme (CSS variables handle theme switching)', () => {
      render(
        <div data-theme="dark">
          <Box padding="4" data-testid="dark-theme-box">Dark theme content</Box>
        </div>
      );
      const boxElement = screen.getByTestId('dark-theme-box');
      expect(boxElement).toHaveClass('p-4');
    });

    it('supports brand switching (runtime CSS variable overrides)', () => {
      render(
        <div data-theme="light" data-brand="custom">
          <Box padding="8" margin="4" data-testid="brand-box">Brand content</Box>
        </div>
      );
      const boxElement = screen.getByTestId('brand-box');
      expect(boxElement).toHaveClass('p-8', 'm-4');
    });
  });

  describe('Accessibility', () => {
    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Box ref={ref}>Content</Box>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
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

    it('supports ARIA attributes', () => {
      render(
        <Box
          role="region"
          aria-labelledby="heading-id"
          aria-describedby="desc-id"
          data-testid="aria-box"
        >
          Content
        </Box>
      );
      const boxElement = screen.getByTestId('aria-box');
      expect(boxElement).toHaveAttribute('role', 'region');
      expect(boxElement).toHaveAttribute('aria-labelledby', 'heading-id');
      expect(boxElement).toHaveAttribute('aria-describedby', 'desc-id');
    });
  });

  describe('HTML Attributes', () => {
    it('forwards data attributes', () => {
      render(
        <Box
          data-testid="data-box"
          data-custom="custom-value"
          data-analytics="track-this"
        >
          Content
        </Box>
      );
      const boxElement = screen.getByTestId('data-box');
      expect(boxElement).toHaveAttribute('data-custom', 'custom-value');
      expect(boxElement).toHaveAttribute('data-analytics', 'track-this');
    });

    it('forwards id attribute', () => {
      render(<Box id="unique-box" data-testid="id-box">Content</Box>);
      const boxElement = screen.getByTestId('id-box');
      expect(boxElement).toHaveAttribute('id', 'unique-box');
    });

    it('forwards title attribute', () => {
      render(<Box title="Box title" data-testid="title-box">Content</Box>);
      const boxElement = screen.getByTestId('title-box');
      expect(boxElement).toHaveAttribute('title', 'Box title');
    });
  });

  describe('Edge Cases', () => {
    it('handles zero spacing token', () => {
      render(
        <Box
          padding="0"
          margin="0"
          data-testid="zero-box"
        >
          Content
        </Box>
      );
      const boxElement = screen.getByTestId('zero-box');
      expect(boxElement).toHaveClass('p-0', 'm-0');
    });

    it('handles largest spacing token', () => {
      render(
        <Box
          padding="64"
          margin="64"
          data-testid="large-box"
        >
          Content
        </Box>
      );
      const boxElement = screen.getByTestId('large-box');
      expect(boxElement).toHaveClass('p-64', 'm-64');
    });

    it('handles no spacing props', () => {
      render(<Box data-testid="no-spacing">Content</Box>);
      const boxElement = screen.getByTestId('no-spacing');
      // Should have no spacing classes
      const className = boxElement.className;
      expect(className).not.toMatch(/[mp][tlrb]?-/);
    });

    it('does not render className attribute if no classes are applied', () => {
      render(<Box data-testid="no-classes">Content</Box>);
      const boxElement = screen.getByTestId('no-classes');
      expect(boxElement.hasAttribute('class')).toBe(false);
    });
  });

  describe('Nested Box Components', () => {
    it('allows nesting Box components', () => {
      render(
        <Box padding="4" data-testid="outer-box">
          <Box margin="2" data-testid="inner-box">
            Nested content
          </Box>
        </Box>
      );
      const outerBox = screen.getByTestId('outer-box');
      const innerBox = screen.getByTestId('inner-box');

      expect(outerBox).toHaveClass('p-4');
      expect(innerBox).toHaveClass('m-2');
      expect(innerBox).toHaveTextContent('Nested content');
    });

    it('maintains proper DOM hierarchy with nested boxes', () => {
      render(
        <Box as="article" padding="8" data-testid="article">
          <Box as="header" padding="4" data-testid="header">
            Header
          </Box>
          <Box as="main" padding="4" data-testid="main">
            Main
          </Box>
          <Box as="footer" padding="4" data-testid="footer">
            Footer
          </Box>
        </Box>
      );

      const article = screen.getByTestId('article');
      const header = screen.getByTestId('header');
      const main = screen.getByTestId('main');
      const footer = screen.getByTestId('footer');

      expect(article.tagName).toBe('ARTICLE');
      expect(header.tagName).toBe('HEADER');
      expect(main.tagName).toBe('MAIN');
      expect(footer.tagName).toBe('FOOTER');
    });
  });

  describe('Layout Props - Flexbox and Display', () => {
    describe('Display', () => {
      it('applies display="flex" class correctly', () => {
        render(<Box display="flex" data-testid="flex-box">Content</Box>);
        const boxElement = screen.getByTestId('flex-box');
        expect(boxElement).toHaveClass('display-flex');
      });

      it('applies display="block" class correctly', () => {
        render(<Box display="block" data-testid="block-box">Content</Box>);
        const boxElement = screen.getByTestId('block-box');
        expect(boxElement).toHaveClass('display-block');
      });

      it('applies display="inline-block" class correctly', () => {
        render(<Box display="inline-block" data-testid="inline-block-box">Content</Box>);
        const boxElement = screen.getByTestId('inline-block-box');
        expect(boxElement).toHaveClass('display-inline-block');
      });

      it('applies display="grid" class correctly', () => {
        render(<Box display="grid" data-testid="grid-box">Content</Box>);
        const boxElement = screen.getByTestId('grid-box');
        expect(boxElement).toHaveClass('display-grid');
      });

      it('applies display="none" class correctly', () => {
        render(<Box display="none" data-testid="none-box">Content</Box>);
        const boxElement = screen.getByTestId('none-box');
        expect(boxElement).toHaveClass('display-none');
      });
    });

    describe('Flex Direction', () => {
      it('applies flexDirection="row" class correctly', () => {
        render(<Box flexDirection="row" data-testid="row-box">Content</Box>);
        const boxElement = screen.getByTestId('row-box');
        expect(boxElement).toHaveClass('flex-direction-row');
      });

      it('applies flexDirection="column" class correctly', () => {
        render(<Box flexDirection="column" data-testid="column-box">Content</Box>);
        const boxElement = screen.getByTestId('column-box');
        expect(boxElement).toHaveClass('flex-direction-column');
      });

      it('applies flexDirection="row-reverse" class correctly', () => {
        render(<Box flexDirection="row-reverse" data-testid="row-reverse-box">Content</Box>);
        const boxElement = screen.getByTestId('row-reverse-box');
        expect(boxElement).toHaveClass('flex-direction-row-reverse');
      });

      it('applies flexDirection="column-reverse" class correctly', () => {
        render(<Box flexDirection="column-reverse" data-testid="column-reverse-box">Content</Box>);
        const boxElement = screen.getByTestId('column-reverse-box');
        expect(boxElement).toHaveClass('flex-direction-column-reverse');
      });
    });

    describe('Align Items', () => {
      it('applies alignItems="flex-start" class correctly', () => {
        render(<Box alignItems="flex-start" data-testid="align-start-box">Content</Box>);
        const boxElement = screen.getByTestId('align-start-box');
        expect(boxElement).toHaveClass('align-items-flex-start');
      });

      it('applies alignItems="center" class correctly', () => {
        render(<Box alignItems="center" data-testid="align-center-box">Content</Box>);
        const boxElement = screen.getByTestId('align-center-box');
        expect(boxElement).toHaveClass('align-items-center');
      });

      it('applies alignItems="flex-end" class correctly', () => {
        render(<Box alignItems="flex-end" data-testid="align-end-box">Content</Box>);
        const boxElement = screen.getByTestId('align-end-box');
        expect(boxElement).toHaveClass('align-items-flex-end');
      });

      it('applies alignItems="stretch" class correctly', () => {
        render(<Box alignItems="stretch" data-testid="align-stretch-box">Content</Box>);
        const boxElement = screen.getByTestId('align-stretch-box');
        expect(boxElement).toHaveClass('align-items-stretch');
      });

      it('applies alignItems="baseline" class correctly', () => {
        render(<Box alignItems="baseline" data-testid="align-baseline-box">Content</Box>);
        const boxElement = screen.getByTestId('align-baseline-box');
        expect(boxElement).toHaveClass('align-items-baseline');
      });
    });

    describe('Justify Content', () => {
      it('applies justifyContent="flex-start" class correctly', () => {
        render(<Box justifyContent="flex-start" data-testid="justify-start-box">Content</Box>);
        const boxElement = screen.getByTestId('justify-start-box');
        expect(boxElement).toHaveClass('justify-content-flex-start');
      });

      it('applies justifyContent="center" class correctly', () => {
        render(<Box justifyContent="center" data-testid="justify-center-box">Content</Box>);
        const boxElement = screen.getByTestId('justify-center-box');
        expect(boxElement).toHaveClass('justify-content-center');
      });

      it('applies justifyContent="flex-end" class correctly', () => {
        render(<Box justifyContent="flex-end" data-testid="justify-end-box">Content</Box>);
        const boxElement = screen.getByTestId('justify-end-box');
        expect(boxElement).toHaveClass('justify-content-flex-end');
      });

      it('applies justifyContent="space-between" class correctly', () => {
        render(<Box justifyContent="space-between" data-testid="justify-between-box">Content</Box>);
        const boxElement = screen.getByTestId('justify-between-box');
        expect(boxElement).toHaveClass('justify-content-space-between');
      });

      it('applies justifyContent="space-around" class correctly', () => {
        render(<Box justifyContent="space-around" data-testid="justify-around-box">Content</Box>);
        const boxElement = screen.getByTestId('justify-around-box');
        expect(boxElement).toHaveClass('justify-content-space-around');
      });

      it('applies justifyContent="space-evenly" class correctly', () => {
        render(<Box justifyContent="space-evenly" data-testid="justify-evenly-box">Content</Box>);
        const boxElement = screen.getByTestId('justify-evenly-box');
        expect(boxElement).toHaveClass('justify-content-space-evenly');
      });
    });

    describe('Gap', () => {
      it('applies gap="md" class correctly', () => {
        render(<Box gap="md" data-testid="gap-box">Content</Box>);
        const boxElement = screen.getByTestId('gap-box');
        expect(boxElement).toHaveClass('gap-md');
      });

      it('applies gap with different size names', () => {
        const { rerender } = render(<Box gap="xs" data-testid="gap-test">Content</Box>);
        expect(screen.getByTestId('gap-test')).toHaveClass('gap-xs');

        rerender(<Box gap="lg" data-testid="gap-test">Content</Box>);
        expect(screen.getByTestId('gap-test')).toHaveClass('gap-lg');

        rerender(<Box gap="xxl" data-testid="gap-test">Content</Box>);
        expect(screen.getByTestId('gap-test')).toHaveClass('gap-xxl');
      });

      it('applies all gap size options correctly', () => {
        (['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const).forEach((size) => {
          const { container } = render(<Box gap={size} data-testid={`gap-${size}`}>Content</Box>);
          const boxElement = container.querySelector(`[data-testid="gap-${size}"]`);
          expect(boxElement).toHaveClass(`gap-${size}`);
        });
      });
    });

    describe('Flex', () => {
      it('applies flex prop as inline style', () => {
        render(<Box flex="1" data-testid="flex-1-box">Content</Box>);
        const boxElement = screen.getByTestId('flex-1-box');
        expect(boxElement).toHaveStyle({ flex: '1' });
      });

      it('applies flex="0 1 auto" as inline style', () => {
        render(<Box flex="0 1 auto" data-testid="flex-auto-box">Content</Box>);
        const boxElement = screen.getByTestId('flex-auto-box');
        expect(boxElement).toHaveStyle({ flex: '0 1 auto' });
      });

      it('applies flex="1 1 200px" as inline style', () => {
        render(<Box flex="1 1 200px" data-testid="flex-basis-box">Content</Box>);
        const boxElement = screen.getByTestId('flex-basis-box');
        expect(boxElement).toHaveStyle({ flex: '1 1 200px' });
      });
    });

    describe('Combined Layout Props', () => {
      it('applies multiple flex layout props correctly', () => {
        render(
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="space-between"
            gap="md"
            data-testid="combined-flex-box"
          >
            Content
          </Box>
        );
        const boxElement = screen.getByTestId('combined-flex-box');
        expect(boxElement).toHaveClass(
          'display-flex',
          'flex-direction-column',
          'align-items-center',
          'justify-content-space-between',
          'gap-md'
        );
      });

      it('combines layout props with spacing props', () => {
        render(
          <Box
            display="flex"
            gap="lg"
            padding="8"
            margin="4"
            data-testid="layout-spacing-box"
          >
            Content
          </Box>
        );
        const boxElement = screen.getByTestId('layout-spacing-box');
        expect(boxElement).toHaveClass('display-flex', 'gap-lg', 'p-8', 'm-4');
      });

      it('combines all layout props with custom className', () => {
        render(
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap="sm"
            flex="1"
            className="custom-layout"
            data-testid="full-layout-box"
          >
            Content
          </Box>
        );
        const boxElement = screen.getByTestId('full-layout-box');
        expect(boxElement).toHaveClass(
          'display-flex',
          'align-items-center',
          'justify-content-center',
          'gap-sm',
          'custom-layout'
        );
        expect(boxElement).toHaveStyle({ flex: '1' });
      });
    });

    describe('SSR Compatibility for Layout Props', () => {
      it('renders layout props without client-side hooks', () => {
        render(
          <Box
            display="flex"
            flexDirection="column"
            gap="md"
            data-testid="ssr-layout-box"
          >
            SSR Content
          </Box>
        );
        const boxElement = screen.getByTestId('ssr-layout-box');
        expect(boxElement).toBeInTheDocument();
        expect(boxElement).toHaveClass('display-flex', 'flex-direction-column', 'gap-md');
      });

      it('uses pure CSS classes for layout (except flex prop)', () => {
        render(
          <Box
            display="flex"
            alignItems="center"
            gap="lg"
            data-testid="pure-css-layout"
          >
            Content
          </Box>
        );
        const boxElement = screen.getByTestId('pure-css-layout');

        const styleAttr = boxElement.getAttribute('style');
        expect(styleAttr).toBeNull();
      });

      it('applies flex prop as inline style only', () => {
        render(
          <Box
            display="flex"
            flex="1"
            data-testid="flex-inline-style"
          >
            Content
          </Box>
        );
        const boxElement = screen.getByTestId('flex-inline-style');

        expect(boxElement).toHaveClass('display-flex');
        expect(boxElement).toHaveStyle({ flex: '1' });
      });
    });
  });
});
