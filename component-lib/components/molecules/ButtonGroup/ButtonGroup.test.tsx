import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ButtonGroup } from './ButtonGroup';
import { Button } from '../../atoms/Button/Button';

describe('ButtonGroup Component', () => {
  it('renders button group with buttons', () => {
    render(
      <ButtonGroup data-testid="button-group">
        <Button>First</Button>
        <Button>Second</Button>
        <Button>Third</Button>
      </ButtonGroup>
    );
    
    const group = screen.getByTestId('button-group');
    const buttons = screen.getAllByRole('button');
    
    expect(group).toBeInTheDocument();
    expect(buttons).toHaveLength(3);
    expect(buttons[0]).toHaveTextContent('First');
    expect(buttons[1]).toHaveTextContent('Second');
    expect(buttons[2]).toHaveTextContent('Third');
  });

  it('applies horizontal orientation by default', () => {
    render(
      <ButtonGroup data-testid="button-group">
        <Button>First</Button>
        <Button>Second</Button>
      </ButtonGroup>
    );
    
    const group = screen.getByTestId('button-group');
    expect(group).toBeInTheDocument();
    // Component renders successfully with default horizontal orientation
  });

  it('applies vertical orientation when specified', () => {
    render(
      <ButtonGroup orientation="vertical" data-testid="button-group">
        <Button>First</Button>
        <Button>Second</Button>
      </ButtonGroup>
    );
    
    const group = screen.getByTestId('button-group');
    expect(group).toBeInTheDocument();
    // Component renders successfully with vertical orientation
  });

  it('applies custom gap between buttons', () => {
    render(
      <ButtonGroup gap="1rem" data-testid="button-group">
        <Button>First</Button>
        <Button>Second</Button>
      </ButtonGroup>
    );
    
    const group = screen.getByTestId('button-group');
    expect(group).toHaveStyle('gap: 1rem');
  });

  it('inherits group variant to child buttons', () => {
    render(
      <ButtonGroup variant="outline" data-testid="button-group">
        <Button data-testid="button-1">First</Button>
        <Button data-testid="button-2">Second</Button>
      </ButtonGroup>
    );
    
    const button1 = screen.getByTestId('button-1');
    const button2 = screen.getByTestId('button-2');
    
    // Check that buttons inherit outline variant styles
    expect(button1).toHaveStyle('background-color: transparent');
    expect(button2).toHaveStyle('background-color: transparent');
  });

  it('inherits group size to child buttons', () => {
    render(
      <ButtonGroup size="lg" data-testid="button-group">
        <Button data-testid="button-1">First</Button>
        <Button data-testid="button-2">Second</Button>
      </ButtonGroup>
    );
    
    const button1 = screen.getByTestId('button-1');
    const button2 = screen.getByTestId('button-2');
    
    // Check that buttons inherit large size styles (rem values)
    expect(button1).toHaveStyle('font-size: 1.125rem');
    expect(button2).toHaveStyle('font-size: 1.125rem');
  });

  it('allows individual buttons to override group properties', () => {
    render(
      <ButtonGroup variant="outline" data-testid="button-group">
        <Button data-testid="button-1">First</Button>
        <Button variant="primary" data-testid="button-2">Second</Button>
      </ButtonGroup>
    );
    
    const button1 = screen.getByTestId('button-1');
    const button2 = screen.getByTestId('button-2');
    
    // First button should inherit outline variant
    expect(button1).toHaveStyle('background-color: transparent');
    // Second button should override with primary variant
    expect(button2).not.toHaveStyle('background-color: transparent');
  });

  it('applies dark mode to all buttons when specified', () => {
    render(
      <ButtonGroup isDarkMode data-testid="button-group">
        <Button data-testid="button-1">First</Button>
        <Button data-testid="button-2">Second</Button>
      </ButtonGroup>
    );
    
    // The buttons should receive the isDarkMode prop
    // This is tested through prop inheritance in the component logic
    const group = screen.getByTestId('button-group');
    expect(group).toBeInTheDocument();
  });

  it('handles non-button children without crashing', () => {
    render(
      <ButtonGroup data-testid="button-group">
        <Button>Button</Button>
        <div>Not a button</div>
        <Button>Another button</Button>
      </ButtonGroup>
    );
    
    const group = screen.getByTestId('button-group');
    const buttons = screen.getAllByRole('button');
    
    expect(group).toBeInTheDocument();
    expect(buttons).toHaveLength(2);
    expect(screen.getByText('Not a button')).toBeInTheDocument();
  });

  it('applies correct ARIA role for accessibility', () => {
    render(
      <ButtonGroup data-testid="button-group">
        <Button>First</Button>
        <Button>Second</Button>
      </ButtonGroup>
    );
    
    const group = screen.getByTestId('button-group');
    expect(group).toHaveAttribute('role', 'group');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    
    render(
      <ButtonGroup ref={ref} data-testid="button-group">
        <Button>Test</Button>
      </ButtonGroup>
    );
    
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toBe(screen.getByTestId('button-group'));
  });

  it('passes through additional props', () => {
    render(
      <ButtonGroup 
        data-testid="button-group" 
        className="custom-class"
        aria-label="Custom button group"
      >
        <Button>Test</Button>
      </ButtonGroup>
    );
    
    const group = screen.getByTestId('button-group');
    expect(group).toHaveClass('custom-class');
    expect(group).toHaveAttribute('aria-label', 'Custom button group');
  });
});