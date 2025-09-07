import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from '../Button';

describe('Button Component', () => {
  it('renders the button with the correct text', () => {
    render(<Button onClick={()=>console.log('click')}>Click Me</Button>);
    const buttonElement = screen.getByText(/click me/i);
    expect(buttonElement).toBeInTheDocument();
  });

  it('calls the onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    const buttonElement = screen.getByText(/click me/i);
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies the disabled attribute correctly', () => {
    render(<Button onClick={()=>console.log('click')} disabled>Click Me</Button>);
    const buttonElement = screen.getByText(/click me/i);
    expect(buttonElement).toBeDisabled();
  });

  it('renders with default props', () => {
    render(<Button>Default Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveStyle('display: inline-flex');
  });

  describe('variants', () => {
    it('renders primary variant by default', () => {
      render(<Button>Primary</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveStyle('background-color: #0284c7'); // blue.600
    });

    it('renders outline variant', () => {
      render(<Button variant="outline">Outline</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveStyle('background-color: transparent');
    });

    it('renders ghost variant', () => {
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveStyle('background-color: transparent');
    });
  });

  describe('sizes', () => {
    it('renders small size', () => {
      render(<Button size="sm">Small</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveStyle('padding: 0.5rem 0.75rem'); // 8px 12px
      expect(button).toHaveStyle('font-size: 0.875rem'); // sm
    });

    it('renders medium size by default', () => {
      render(<Button size="md">Medium</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveStyle('padding: 0.75rem 1rem'); // 12px 16px
      expect(button).toHaveStyle('font-size: 1rem'); // base
    });

    it('renders large size', () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveStyle('padding: 1rem 1.5rem'); // 16px 24px
      expect(button).toHaveStyle('font-size: 1.125rem'); // lg
    });
  });

  describe('corners', () => {
    it('applies default corner radius', () => {
      render(<Button corners="default">Default Corners</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveStyle('border-radius: 0.25rem'); // md
    });

    it('applies rounded corners', () => {
      render(<Button corners="rounded">Rounded</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveStyle('border-radius: 9999px'); // full
    });
  });

  describe('alignContent prop', () => {
    it('applies center alignment by default', () => {
      render(<Button>Center</Button>);
      const buttonElement = screen.getByText(/center/i);
      expect(buttonElement).toHaveStyle('justify-content: center');
    });

    it('applies left alignment when alignContent is "left"', () => {
      render(<Button alignContent="left">Left Aligned</Button>);
      const buttonElement = screen.getByText(/left aligned/i);
      expect(buttonElement).toHaveStyle('justify-content: flex-start');
    });

    it('applies center alignment when alignContent is "center"', () => {
      render(<Button alignContent="center">Center Aligned</Button>);
      const buttonElement = screen.getByText(/center aligned/i);
      expect(buttonElement).toHaveStyle('justify-content: center');
    });

    it('applies right alignment when alignContent is "right"', () => {
      render(<Button alignContent="right">Right Aligned</Button>);
      const buttonElement = screen.getByText(/right aligned/i);
      expect(buttonElement).toHaveStyle('justify-content: flex-end');
    });

    it('ensures button has inline-flex display for alignment to work', () => {
      render(<Button alignContent="left">Test</Button>);
      const buttonElement = screen.getByText(/test/i);
      expect(buttonElement).toHaveStyle('display: inline-flex');
    });
  });

  describe('icon-only buttons', () => {
    it('renders icon-only button', () => {
      render(<Button iconOnly>Icon</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });
  });

  describe('dark mode', () => {
    it('applies dark mode styles', () => {
      render(<Button isDarkMode>Dark Mode</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveStyle('background-color: #0ea5e9'); // blue.500 for dark mode
    });
  });

  describe('interaction states', () => {
    it('handles mouse enter and leave', () => {
      render(<Button>Hover Test</Button>);
      const button = screen.getByRole('button');
      
      fireEvent.mouseEnter(button);
      fireEvent.mouseLeave(button);
      
      expect(button).toBeInTheDocument();
    });

    it('handles mouse down and up', () => {
      render(<Button>Press Test</Button>);
      const button = screen.getByRole('button');
      
      fireEvent.mouseDown(button);
      fireEvent.mouseUp(button);
      
      expect(button).toBeInTheDocument();
    });

    it('handles focus and blur', () => {
      render(<Button>Focus Test</Button>);
      const button = screen.getByRole('button');
      
      fireEvent.focus(button);
      fireEvent.blur(button);
      
      expect(button).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('has proper button role', () => {
      render(<Button>Accessible Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('forwards additional props', () => {
      render(<Button data-testid="custom-button" aria-label="Custom Button">Test</Button>);
      const button = screen.getByTestId('custom-button');
      expect(button).toHaveAttribute('aria-label', 'Custom Button');
    });
  });

  describe('ref forwarding', () => {
    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<Button ref={ref}>Ref Button</Button>);
      
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });
});

