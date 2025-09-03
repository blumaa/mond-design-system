import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Stack } from './Stack';

describe('Stack Component', () => {
  it('renders children correctly', () => {
    render(
      <Stack data-testid="stack">
        <div>Item 1</div>
        <div>Item 2</div>
      </Stack>
    );
    
    const stack = screen.getByTestId('stack');
    expect(stack).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('applies vertical direction by default', () => {
    render(
      <Stack data-testid="stack">
        <div>Item 1</div>
        <div>Item 2</div>
      </Stack>
    );
    
    const stack = screen.getByTestId('stack');
    expect(stack).toHaveStyle('display: flex');
    expect(stack).toHaveStyle('flex-direction: column');
  });

  it('applies horizontal direction when specified', () => {
    render(
      <Stack direction="horizontal" data-testid="stack">
        <div>Item 1</div>
        <div>Item 2</div>
      </Stack>
    );
    
    const stack = screen.getByTestId('stack');
    expect(stack).toHaveStyle('flex-direction: row');
  });

  it('applies gap spacing', () => {
    render(
      <Stack spacing={24} data-testid="stack">
        <div>Item 1</div>
        <div>Item 2</div>
      </Stack>
    );
    
    const stack = screen.getByTestId('stack');
    expect(stack).toHaveStyle('gap: 24px');
  });

  it('applies alignment', () => {
    render(
      <Stack align="center" data-testid="stack">
        <div>Item 1</div>
        <div>Item 2</div>
      </Stack>
    );
    
    const stack = screen.getByTestId('stack');
    expect(stack).toHaveStyle('align-items: center');
  });

  it('applies justification', () => {
    render(
      <Stack justify="between" data-testid="stack">
        <div>Item 1</div>
        <div>Item 2</div>
      </Stack>
    );
    
    const stack = screen.getByTestId('stack');
    expect(stack).toHaveStyle('justify-content: space-between');
  });

  it('forwards additional Box props', () => {
    render(
      <Stack bg="#f0f0f0" p={16} borderRadius={8} data-testid="stack">
        <div>Item 1</div>
      </Stack>
    );
    
    const stack = screen.getByTestId('stack');
    expect(stack).toHaveStyle('background-color: #f0f0f0');
    expect(stack).toHaveStyle('padding: 16px');
    expect(stack).toHaveStyle('border-radius: 8px');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Stack ref={ref}>
        <div>Item</div>
      </Stack>
    );
    
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});