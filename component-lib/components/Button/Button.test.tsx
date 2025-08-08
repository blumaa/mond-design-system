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
    render(<Button onClick={()=>console.log('click')}disabled>Click Me</Button>);
    const buttonElement = screen.getByText(/click me/i);
    expect(buttonElement).toBeDisabled();
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
});

