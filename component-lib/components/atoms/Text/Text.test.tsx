import React from 'react';
import { render, screen } from '../../../test-utils';
import '@testing-library/jest-dom';
import { Text } from './Text';

describe('Text', () => {
  it('renders correctly with default props', () => {
    render(<Text>Hello World</Text>);
    
    const text = screen.getByText('Hello World');
    expect(text).toBeInTheDocument();
    expect(text.tagName).toBe('SPAN');
  });

  it('renders with different variants', () => {
    const variants = ['body-lg', 'body-md', 'body-sm', 'caption', 'overline'] as const;
    
    variants.forEach((variant) => {
      const { unmount } = render(
        <Text variant={variant} data-testid={`text-${variant}`}>
          Test text {variant}
        </Text>
      );
      
      const text = screen.getByTestId(`text-${variant}`);
      expect(text).toBeInTheDocument();
      
      unmount();
    });
  });

  it('renders with different HTML elements', () => {
    const elements = ['span', 'p', 'div', 'label', 'strong', 'em', 'small'] as const;
    
    elements.forEach((element) => {
      const { unmount } = render(
        <Text as={element} data-testid={`text-${element}`}>
          Test text
        </Text>
      );
      
      const text = screen.getByTestId(`text-${element}`);
      expect(text.tagName).toBe(element.toUpperCase());
      
      unmount();
    });
  });

  it('renders with different semantic colors', () => {
    const semantics = ['primary', 'secondary', 'tertiary', 'disabled', 'inverse', 'link', 'success', 'warning', 'error'] as const;
    
    semantics.forEach((semantic) => {
      const { unmount } = render(
        <Text semantic={semantic} data-testid={`text-${semantic}`}>
          Test text {semantic}
        </Text>
      );
      
      const text = screen.getByTestId(`text-${semantic}`);
      expect(text).toBeInTheDocument();
      
      unmount();
    });
  });

  it('renders with different font weights', () => {
    render(<Text weight="bold" data-testid="bold-text">Bold text</Text>);
    
    const text = screen.getByTestId('bold-text');
    expect(text).toHaveStyle({ fontWeight: '700' });
  });

  it('renders with text alignment', () => {
    render(<Text align="center" data-testid="centered-text">Centered text</Text>);
    
    const text = screen.getByTestId('centered-text');
    expect(text).toHaveStyle({ textAlign: 'center' });
  });

  it('renders italic text', () => {
    render(<Text italic data-testid="italic-text">Italic text</Text>);
    
    const text = screen.getByTestId('italic-text');
    expect(text).toHaveStyle({ fontStyle: 'italic' });
  });

  it('renders underlined text', () => {
    render(<Text underline data-testid="underlined-text">Underlined text</Text>);
    
    const text = screen.getByTestId('underlined-text');
    expect(text).toHaveStyle({ textDecoration: 'underline' });
  });

  it('renders strikethrough text', () => {
    render(<Text strikethrough data-testid="strikethrough-text">Strikethrough text</Text>);
    
    const text = screen.getByTestId('strikethrough-text');
    expect(text).toHaveStyle({ textDecoration: 'line-through' });
  });

  it('renders combined text decorations', () => {
    render(
      <Text underline strikethrough data-testid="decorated-text">
        Decorated text
      </Text>
    );
    
    const text = screen.getByTestId('decorated-text');
    expect(text).toHaveStyle({ textDecoration: 'underline line-through' });
  });

  it('renders truncated text', () => {
    render(<Text truncate data-testid="truncated-text">Long text that should be truncated</Text>);
    
    const text = screen.getByTestId('truncated-text');
    expect(text).toHaveStyle({ 
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    });
  });

  it('renders overline variant with proper styling', () => {
    render(<Text variant="overline" data-testid="overline-text">Overline text</Text>);
    
    const text = screen.getByTestId('overline-text');
    expect(text).toHaveStyle({
      textTransform: 'uppercase',
      letterSpacing: '0.1em'
    });
  });

  it('renders with custom color', () => {
    render(<Text color="red" data-testid="custom-color-text">Custom color text</Text>);
    
    const text = screen.getByTestId('custom-color-text');
    expect(text).toHaveStyle({ color: 'red' });
  });

  it('supports dark mode', () => {
    render(<Text data-testid="dark-mode-text">Dark mode text</Text>);
    
    const text = screen.getByTestId('dark-mode-text');
    expect(text).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLElement>();
    
    render(
      <Text ref={ref}>Text with ref</Text>
    );
    
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('passes through additional props', () => {
    render(
      <Text className="custom-class" data-testid="custom-props-text">
        Text with props
      </Text>
    );
    
    const text = screen.getByTestId('custom-props-text');
    expect(text).toHaveClass('custom-class');
  });

  it('uses sans font family by default', () => {
    render(<Text data-testid="font-text">Font test</Text>);
    
    const text = screen.getByTestId('font-text');
    expect(text).toHaveStyle({ 
      fontFamily: "'DM Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" 
    });
  });

  it('has no text decoration by default', () => {
    render(<Text data-testid="no-decoration-text">Plain text</Text>);
    
    const text = screen.getByTestId('no-decoration-text');
    expect(text).toHaveStyle({ textDecoration: 'none' });
  });
});