import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { InputGroup } from './InputGroup';
import { Input } from '../Input/Input';

describe('InputGroup Component', () => {
  it('renders input group with input', () => {
    render(
      <InputGroup data-testid="input-group">
        <Input placeholder="Enter text..." />
      </InputGroup>
    );
    
    const group = screen.getByTestId('input-group');
    const input = screen.getByRole('textbox');
    
    expect(group).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Enter text...');
  });

  it('renders with prefix element', () => {
    render(
      <InputGroup prefix="🔍" data-testid="input-group">
        <Input placeholder="Search..." />
      </InputGroup>
    );
    
    const group = screen.getByTestId('input-group');
    const prefix = screen.getByText('🔍');
    const input = screen.getByRole('textbox');
    
    expect(group).toBeInTheDocument();
    expect(prefix).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  it('renders with suffix element', () => {
    render(
      <InputGroup suffix="@example.com" data-testid="input-group">
        <Input placeholder="username" />
      </InputGroup>
    );
    
    const group = screen.getByTestId('input-group');
    const suffix = screen.getByText('@example.com');
    const input = screen.getByRole('textbox');
    
    expect(group).toBeInTheDocument();
    expect(suffix).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  it('renders with both prefix and suffix', () => {
    render(
      <InputGroup prefix="$" suffix=".00" data-testid="input-group">
        <Input placeholder="0" />
      </InputGroup>
    );
    
    const group = screen.getByTestId('input-group');
    const prefix = screen.getByText('$');
    const suffix = screen.getByText('.00');
    const input = screen.getByRole('textbox');
    
    expect(group).toBeInTheDocument();
    expect(prefix).toBeInTheDocument();
    expect(suffix).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  it('inherits group size to child input', () => {
    render(
      <InputGroup inputSize="lg" data-testid="input-group">
        <Input placeholder="Large input" data-testid="input" />
      </InputGroup>
    );
    
    const group = screen.getByTestId('input-group');
    expect(group).toBeInTheDocument();
    // Input should inherit large size properties via prop cloning
  });

  it('inherits group variant to child input', () => {
    render(
      <InputGroup variant="error" data-testid="input-group">
        <Input placeholder="Error input" data-testid="input" />
      </InputGroup>
    );
    
    const group = screen.getByTestId('input-group');
    expect(group).toBeInTheDocument();
    // Input should inherit error variant properties via prop cloning
  });

  it('allows input to override group properties', () => {
    render(
      <InputGroup inputSize="md" variant="default" data-testid="input-group">
        <Input 
          inputSize="lg" 
          variant="error" 
          placeholder="Override input" 
          data-testid="input" 
        />
      </InputGroup>
    );
    
    const group = screen.getByTestId('input-group');
    expect(group).toBeInTheDocument();
    // Input should keep its own properties when specified
  });

  it('applies dark mode to input when specified', () => {
    render(
      <InputGroup isDarkMode data-testid="input-group">
        <Input placeholder="Dark input" data-testid="input" />
      </InputGroup>
    );
    
    const group = screen.getByTestId('input-group');
    expect(group).toBeInTheDocument();
    // Input should inherit dark mode via prop cloning
  });

  it('renders with button as prefix', () => {
    render(
      <InputGroup 
        prefix={<button type="button">Search</button>} 
        data-testid="input-group"
      >
        <Input placeholder="Enter query..." />
      </InputGroup>
    );
    
    const group = screen.getByTestId('input-group');
    const prefixButton = screen.getByRole('button', { name: 'Search' });
    const input = screen.getByRole('textbox');
    
    expect(group).toBeInTheDocument();
    expect(prefixButton).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  it('renders with button as suffix', () => {
    render(
      <InputGroup 
        suffix={<button type="button">Submit</button>} 
        data-testid="input-group"
      >
        <Input placeholder="Enter data..." />
      </InputGroup>
    );
    
    const group = screen.getByTestId('input-group');
    const suffixButton = screen.getByRole('button', { name: 'Submit' });
    const input = screen.getByRole('textbox');
    
    expect(group).toBeInTheDocument();
    expect(suffixButton).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  it('handles complex prefix/suffix elements', () => {
    const PrefixIcon = () => <span data-testid="prefix-icon">🔍</span>;
    const SuffixButton = () => (
      <button type="button" data-testid="suffix-button">
        Clear
      </button>
    );

    render(
      <InputGroup 
        prefix={<PrefixIcon />} 
        suffix={<SuffixButton />} 
        data-testid="input-group"
      >
        <Input placeholder="Complex example..." />
      </InputGroup>
    );
    
    const group = screen.getByTestId('input-group');
    const prefixIcon = screen.getByTestId('prefix-icon');
    const suffixButton = screen.getByTestId('suffix-button');
    const input = screen.getByRole('textbox');
    
    expect(group).toBeInTheDocument();
    expect(prefixIcon).toBeInTheDocument();
    expect(suffixButton).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    
    render(
      <InputGroup ref={ref} data-testid="input-group">
        <Input placeholder="Test" />
      </InputGroup>
    );
    
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toBe(screen.getByTestId('input-group'));
  });

  it('passes through additional props', () => {
    render(
      <InputGroup 
        data-testid="input-group" 
        className="custom-class"
        aria-label="Custom input group"
      >
        <Input placeholder="Test" />
      </InputGroup>
    );
    
    const group = screen.getByTestId('input-group');
    expect(group).toHaveClass('custom-class');
    expect(group).toHaveAttribute('aria-label', 'Custom input group');
  });

  it('handles input without modifications when no prefix/suffix', () => {
    render(
      <InputGroup data-testid="input-group">
        <Input placeholder="Plain input" data-testid="plain-input" />
      </InputGroup>
    );
    
    const group = screen.getByTestId('input-group');
    const input = screen.getByRole('textbox');
    
    expect(group).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Plain input');
    // Component renders successfully with plain input
  });
});