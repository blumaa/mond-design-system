import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Heading } from './Heading';

describe('Heading', () => {
  it('renders correctly with default props', () => {
    render(<Heading>Test Heading</Heading>);
    
    const heading = screen.getByText('Test Heading');
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H1');
  });

  it('renders with different heading levels', () => {
    const levels = [1, 2, 3, 4, 5, 6] as const;
    
    levels.forEach((level) => {
      const { unmount } = render(
        <Heading level={level} data-testid={`heading-${level}`}>
          Heading Level {level}
        </Heading>
      );
      
      const heading = screen.getByTestId(`heading-${level}`);
      expect(heading.tagName).toBe(`H${level}`);
      
      unmount();
    });
  });

  it('uses default sizes based on heading level', () => {
    const defaultSizes = {
      1: '4xl',
      2: '3xl',
      3: '2xl',
      4: 'xl',
      5: 'lg',
      6: 'md'
    };

    Object.entries(defaultSizes).forEach(([level, _expectedSize]) => {
      const { unmount } = render(
        <Heading level={parseInt(level) as 1 | 2 | 3 | 4 | 5 | 6} data-testid={`heading-level-${level}`}>
          Level {level}
        </Heading>
      );
      
      const heading = screen.getByTestId(`heading-level-${level}`);
      expect(heading).toBeInTheDocument();
      
      unmount();
    });
  });

  it('renders with custom size override', () => {
    render(
      <Heading level={1} size="sm" data-testid="custom-size-heading">
        Small H1
      </Heading>
    );
    
    const heading = screen.getByTestId('custom-size-heading');
    expect(heading.tagName).toBe('H1');
    expect(heading).toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'] as const;
    
    sizes.forEach((size) => {
      const { unmount } = render(
        <Heading size={size} data-testid={`heading-${size}`}>
          Heading size {size}
        </Heading>
      );
      
      const heading = screen.getByTestId(`heading-${size}`);
      expect(heading).toBeInTheDocument();
      
      unmount();
    });
  });

  it('renders with different font weights', () => {
    render(<Heading weight="medium" data-testid="medium-weight">Medium Weight</Heading>);
    
    const heading = screen.getByTestId('medium-weight');
    expect(heading).toHaveStyle({ fontWeight: '500' });
  });

  it('renders with different semantic colors', () => {
    const semantics = ['primary', 'secondary', 'tertiary', 'inverse'] as const;
    
    semantics.forEach((semantic) => {
      const { unmount } = render(
        <Heading semantic={semantic} data-testid={`heading-${semantic}`}>
          {semantic} heading
        </Heading>
      );
      
      const heading = screen.getByTestId(`heading-${semantic}`);
      expect(heading).toBeInTheDocument();
      
      unmount();
    });
  });

  it('renders with text alignment', () => {
    render(<Heading align="center" data-testid="centered-heading">Centered</Heading>);
    
    const heading = screen.getByTestId('centered-heading');
    expect(heading).toHaveStyle({ textAlign: 'center' });
  });

  it('renders with custom color', () => {
    render(<Heading color="red" data-testid="custom-color">Custom Color</Heading>);
    
    const heading = screen.getByTestId('custom-color');
    expect(heading).toHaveStyle({ color: 'red' });
  });

  it('renders truncated heading', () => {
    render(
      <Heading truncate data-testid="truncated-heading">
        This is a very long heading that should be truncated
      </Heading>
    );
    
    const heading = screen.getByTestId('truncated-heading');
    expect(heading).toHaveStyle({
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    });
  });

  it('resets default margins', () => {
    render(<Heading data-testid="no-margin-heading">No Margin</Heading>);
    
    const heading = screen.getByTestId('no-margin-heading');
    expect(heading).toHaveStyle({ margin: '0px' });
  });

  it('supports dark mode', () => {
    render(
      <Heading isDarkMode data-testid="dark-mode-heading">
        Dark Mode Heading
      </Heading>
    );
    
    const heading = screen.getByTestId('dark-mode-heading');
    expect(heading).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLHeadingElement>();
    
    render(
      <Heading ref={ref}>Heading with ref</Heading>
    );
    
    expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
    expect(ref.current?.tagName).toBe('H1');
  });

  it('forwards ref with different levels', () => {
    const ref = React.createRef<HTMLHeadingElement>();
    
    render(
      <Heading level={3} ref={ref}>H3 with ref</Heading>
    );
    
    expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
    expect(ref.current?.tagName).toBe('H3');
  });

  it('passes through additional props', () => {
    render(
      <Heading className="custom-class" data-testid="custom-props-heading">
        Heading with props
      </Heading>
    );
    
    const heading = screen.getByTestId('custom-props-heading');
    expect(heading).toHaveClass('custom-class');
  });

  it('uses sans font family by default', () => {
    render(<Heading data-testid="font-heading">Font Test</Heading>);
    
    const heading = screen.getByTestId('font-heading');
    expect(heading).toHaveStyle({ 
      fontFamily: "'DM Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" 
    });
  });

  it('uses bold font weight by default', () => {
    render(<Heading data-testid="bold-heading">Bold by default</Heading>);
    
    const heading = screen.getByTestId('bold-heading');
    expect(heading).toHaveStyle({ fontWeight: '700' });
  });

  it('combines level and custom properties correctly', () => {
    render(
      <Heading 
        level={2} 
        size="xs" 
        weight="light" 
        align="right"
        data-testid="combined-props-heading"
      >
        Combined Props
      </Heading>
    );
    
    const heading = screen.getByTestId('combined-props-heading');
    expect(heading.tagName).toBe('H2');
    expect(heading).toHaveStyle({
      textAlign: 'right',
      fontWeight: '300'
    });
  });
});